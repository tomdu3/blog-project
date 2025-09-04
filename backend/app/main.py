from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import logging

from app.models import PostSummary, PostDetail, PostsResponse, ErrorResponse, ContactForm
from app.notion.parser import query_database, parse_page_properties, get_page_content
from app.cache import cache
from app.email_utils import send_contact_email

app = FastAPI(
    title="Blog API",
    description="A blog API powered by Notion CMS",
    version="1.0.0"
)

# Configure CORS
origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.get("/")
def index():
    return {"message": "Blog API", "status": "running", "version": "1.0.0"}


@app.get("/posts", response_model=PostsResponse)
async def get_posts(response: Response):
    """Get all published blog posts"""
    try:
        # Check cache first
        cache_key = "posts_list"
        cached_posts = cache.get(cache_key)
        
        if cached_posts:
            logger.info("Returning cached posts list")
            # Set cache headers for cached responses
            response.headers["Cache-Control"] = "public, max-age=300"
            response.headers["X-Cache-Status"] = "HIT"
            return cached_posts
        
        logger.info("Fetching posts from Notion database")
        
        # Query Notion database for published posts
        pages = query_database()
        
        # Parse page properties into PostSummary models
        posts = []
        for page in pages:
            parsed_props = parse_page_properties(page)
            
            post_summary = PostSummary(
                id=parsed_props["id"],
                title=parsed_props["title"],
                slug=parsed_props["slug"],
                date=parsed_props["date"],
                excerpt=parsed_props["excerpt"],
                cover=parsed_props["cover"],
                published=parsed_props["published"]
            )
            posts.append(post_summary)
        
        response_data = PostsResponse(posts=posts, total=len(posts))
        
        # Cache the response for 5 minutes
        cache.set(cache_key, response_data, ttl=300)
        
        # Set cache headers for fresh responses
        response.headers["Cache-Control"] = "public, max-age=300"
        response.headers["X-Cache-Status"] = "MISS"
        
        logger.info(f"Successfully fetched and cached {len(posts)} posts")
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error fetching posts: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch posts: {str(e)}"
        )


@app.get("/posts/{slug}", response_model=PostDetail)
async def get_post(slug: str, response: Response):
    """Get a specific blog post by slug"""
    try:
        # Check cache first
        cache_key = f"post_{slug}"
        cached_post = cache.get(cache_key)
        
        if cached_post:
            logger.info(f"Returning cached post: {slug}")
            # Set cache headers for cached responses
            response.headers["Cache-Control"] = "public, max-age=600"
            response.headers["X-Cache-Status"] = "HIT"
            return cached_post
        
        logger.info(f"Fetching post with slug: {slug}")
        
        # Query Notion database for published posts
        pages = query_database()
        
        # Find the page with matching slug
        target_page = None
        for page in pages:
            parsed_props = parse_page_properties(page)
            if parsed_props["slug"] == slug:
                target_page = page
                break
        
        if not target_page:
            logger.warning(f"Post not found with slug: {slug}")
            raise HTTPException(
                status_code=404,
                detail=f"Post with slug '{slug}' not found"
            )
        
        # Parse page properties
        parsed_props = parse_page_properties(target_page)
        
        # Get full page content
        content = get_page_content(parsed_props["id"])
        
        # Create PostDetail model
        post_detail = PostDetail(
            id=parsed_props["id"],
            title=parsed_props["title"],
            slug=parsed_props["slug"],
            date=parsed_props["date"],
            excerpt=parsed_props["excerpt"],
            cover=parsed_props["cover"],
            published=parsed_props["published"],
            content=content
        )
        
        # Cache the post for 10 minutes (longer than list since content is more expensive)
        cache.set(cache_key, post_detail, ttl=600)
        
        # Set cache headers for fresh responses
        response.headers["Cache-Control"] = "public, max-age=600"
        response.headers["X-Cache-Status"] = "MISS"
        
        logger.info(f"Successfully fetched and cached post: {parsed_props['title']}")
        
        return post_detail
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching post with slug {slug}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch post: {str(e)}"
        )


@app.post("/webhooks/notion")
async def handle_notion_webhook(payload: dict):
    """Handle Notion webhook updates"""
    try:
        logger.info(f"Received Notion webhook: {payload}")
        
        # Extract relevant information from the payload
        event_type = payload.get("event", {}).get("type")
        object_id = payload.get("event", {}).get("object", {}).get("id")
        
        if event_type in ["page.updated", "page.created", "page.deleted"]:
            # Clear relevant caches
            cache.clear_pattern("posts_*")
            cache.clear_pattern("post_*")
            
            logger.info(f"Cleared cache for event: {event_type} on object: {object_id}")
            
            return {
                "status": "success",
                "message": "Cache cleared successfully",
                "event_type": event_type,
                "object_id": object_id
            }
        
        return {
            "status": "ignored",
            "message": "Event type not relevant for cache clearing",
            "event_type": event_type
        }
        
    except Exception as e:
        logger.error(f"Error processing Notion webhook: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process webhook: {str(e)}"
        )


@app.post("/cache/clear")
async def clear_cache():
    """Manual cache clearing endpoint"""
    try:
        # Clear all blog-related caches
        cache.clear_pattern("posts_*")
        cache.clear_pattern("post_*")
        
        logger.info("Manual cache clear requested")
        
        return {
            "status": "success",
            "message": "All blog caches cleared successfully"
        }
        
    except Exception as e:
        logger.error(f"Error clearing cache: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear cache: {str(e)}"
        )


@app.get("/cache/stats")
async def get_cache_stats():
    """Get cache statistics"""
    stats = cache.stats()
    cleaned = cache.cleanup_expired()
    
    return {
        "cache_stats": stats,
        "expired_cleaned": cleaned,
        "cache_info": {
            "default_ttl": cache.default_ttl,
            "posts_list_ttl": 300,
            "individual_post_ttl": 600
        }
    }

@app.post("/contact")
async def contact(form: ContactForm):
    """Receive contact form submissions"""
    try:
        send_contact_email(form.name, form.email, form.message)
        return {"message": "Contact form submitted successfully"}
    except Exception as e:
        logger.error(f"Error sending contact form email: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send message."
        )