import os
from notion_client import Client
from dotenv import load_dotenv

load_dotenv()

def get_notion():
    """Initialize and return Notion client"""
    api_key = os.getenv("NOTION_API_KEY")
    if not api_key:
        raise ValueError("NOTION_API_KEY environment variable is required")
    return Client(auth=api_key)

def get_database_id():
    """Get the Notion database ID from environment"""
    database_id = os.getenv("NOTION_DATABASE_ID")
    if not database_id:
        raise ValueError("NOTION_DATABASE_ID environment variable is required")
    return database_id