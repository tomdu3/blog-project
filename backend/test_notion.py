#!/usr/bin/env python3
"""Test script to verify Notion integration"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from notion.client import get_notion, get_database_id
from notion.parser import query_database, parse_page_properties

def test_notion_connection():
    """Test basic Notion connection and database access"""
    try:
        # Test client initialization
        print("🔍 Testing Notion client initialization...")
        notion = get_notion()
        print("✅ Notion client initialized successfully")
        
        # Test database ID retrieval
        print("🔍 Testing database ID retrieval...")
        database_id = get_database_id()
        print(f"✅ Database ID retrieved: {database_id}")
        
        # Test database query
        print("🔍 Testing database query...")
        results = query_database()
        print(f"✅ Database query successful - found {len(results)} pages")
        
        # Test page property parsing
        if results:
            print("🔍 Testing page property parsing...")
            first_page = results[0]
            parsed_props = parse_page_properties(first_page)
            print("✅ Page properties parsed successfully:")
            print(f"   Title: {parsed_props.get('title', 'N/A')}")
            print(f"   Slug: {parsed_props.get('slug', 'N/A')}")
            print(f"   Date: {parsed_props.get('date', 'N/A')}")
            print(f"   Excerpt: {parsed_props.get('excerpt', 'N/A')}")
            print(f"   Published: {parsed_props.get('published', 'N/A')}")
        else:
            print("ℹ️  No pages found in database (make sure you have published pages)")
        
        print("\n🎉 All tests passed! Notion integration is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("   1. Check your NOTION_API_KEY in .env file")
        print("   2. Verify NOTION_DATABASE_ID is correct")
        print("   3. Ensure the integration has access to the database")
        print("   4. Make sure you have at least one published page")
        return False

if __name__ == "__main__":
    test_notion_connection()