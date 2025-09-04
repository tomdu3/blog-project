from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PostSummary(BaseModel):
    """Model for blog post summary (used in listing)"""
    id: str
    title: str
    slug: str
    date: str
    excerpt: str
    cover: Optional[str] = None
    published: bool

class PostDetail(BaseModel):
    """Model for full blog post with content"""
    id: str
    title: str
    slug: str
    date: str
    excerpt: str
    cover: Optional[str] = None
    published: bool
    content: str

class PostsResponse(BaseModel):
    """Model for posts listing response"""
    posts: List[PostSummary]
    total: int

class ErrorResponse(BaseModel):
    """Model for error responses"""
    error: str
    message: str

class ContactForm(BaseModel):
    """Model for the contact form"""
    name: str
    email: str
    message: str

