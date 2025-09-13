from pydantic import BaseModel
from typing import List, Optional, Any
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
    url: Optional[str] = None
    number: Optional[int] = None
    select: Optional[str] = None
    multi_select: Optional[List[str]] = None
    people: Optional[List[str]] = None
    files: Optional[List[str]] = None
    status: Optional[str] = None
    relation: Optional[List[str]] = None
    formula: Optional[Any] = None
    rollup: Optional[Any] = None
    created_by: Optional[str] = None
    last_edited_by: Optional[str] = None
    created_time: Optional[str] = None
    last_edited_time: Optional[str] = None

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

