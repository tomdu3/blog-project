from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import logging

from app.models import PostSummary, PostDetail, PostsResponse, ErrorResponse
from app.notion.parser import query_database, parse_page_properties, get_page_content
from app.cache import cache

app = FastAPI(
    title="Blog API",
    description="A blog API powered by Notion CMS",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
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
async def get_posts():
    """Get all published blog posts"""
    try:
        # Check cache first
        cache_key = "posts_list"
        cached_posts = cache.get(cache_key)
        
        if cached_posts:
            logger.info("Returning cached posts list")
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
        
        response = PostsResponse(posts=posts, total=len(posts))
        
        # Cache the response for 5 minutes
        cache.set(cache_key, response, ttl=300)
        
        logger.info(f"Successfully fetched and cached {len(posts)} posts")
        
        return response
        
    except Exception as e:
        logger.error(f"Error fetching posts: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch posts: {str(e)}"
        )


@app.get("/posts/{slug}", response_model=PostDetail)
async def get_post(slug: str):
    """Get a specific blog post by slug"""
    try:
        # Check cache first
        cache_key = f"post_{slug}"
        cached_post = cache.get(cache_key)
        
        if cached_post:
            logger.info(f"Returning cached post: {slug}")
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