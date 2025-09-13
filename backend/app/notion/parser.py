from typing import List, Dict, Any
from app.notion.client import get_notion, get_database_id

def query_database() -> List[Dict[str, Any]]:
    """Query Notion database for published posts"""
    notion = get_notion()
    database_id = get_database_id()
    
    response = notion.databases.query(
        database_id=database_id,
        filter={
            "property": "Published",
            "checkbox": {
                "equals": True
            }
        },
        sorts=[
            {
                "property": "Date",
                "direction": "descending"
            }
        ]
    )
    
    return response.get("results", [])

def parse_page_properties(page: Dict[str, Any]) -> Dict[str, Any]:
    """Extract and format page properties"""
    properties = page.get("properties", {})
    page_id = page.get("id")
    blocks = get_page_content(page_id)

    cover = get_cover_from_property(properties.get("Cover", {}))
    if not cover:
        cover = get_cover_from_blocks(blocks)

    return {
        "id": page_id,
        "title": get_title_from_property(properties.get("Title", {})),
        "slug": get_rich_text_from_property(properties.get("Slug", {})),
        "date": get_date_from_property(properties.get("Date", {})),
        "excerpt": get_rich_text_from_property(properties.get("Excerpt", {})),
        "cover": cover,
        "published": get_checkbox_from_property(properties.get("Published", {})),
        "content": parse_blocks_to_markdown(blocks),
        "url": get_url_from_property(properties.get("URL", {})),
        "number": get_number_from_property(properties.get("Number", {})),
        "select": get_select_from_property(properties.get("Select", {})),
        "multi_select": get_multi_select_from_property(properties.get("Multi-Select", {})),
        "people": get_people_from_property(properties.get("People", {})),
        "files": get_files_from_property(properties.get("Files", {})),
        "status": get_status_from_property(properties.get("Status", {})),
        "relation": get_relation_from_property(properties.get("Relation", {})),
        "formula": get_formula_from_property(properties.get("Formula", {})),
        "rollup": get_rollup_from_property(properties.get("Rollup", {})),
        "created_by": get_created_by_from_property(properties.get("Created by", {})),
        "last_edited_by": get_last_edited_by_from_property(properties.get("Last edited by", {})),
        "created_time": get_created_time_from_property(properties.get("Created time", {})),
        "last_edited_time": get_last_edited_time_from_property(properties.get("Last edited time", {})),
    }

def get_title_from_property(title_property: Dict[str, Any]) -> str:
    """Extract title from title property"""
    title_list = title_property.get("title", [])
    if title_list:
        return title_list[0].get("text", {}).get("content", "")
    return ""

def get_rich_text_from_property(rich_text_property: Dict[str, Any]) -> str:
    """Extract text from rich text property"""
    rich_text_list = rich_text_property.get("rich_text", [])
    if rich_text_list:
        return rich_text_list[0].get("text", {}).get("content", "")
    return ""

def get_date_from_property(date_property: Dict[str, Any]) -> str:
    """Extract date from date property"""
    date_obj = date_property.get("date", {})
    if date_obj:
        return date_obj.get("start", "")
    return ""

def get_url_from_property(url_property: Dict[str, Any]) -> str:
    """Extract URL from property"""
    return url_property.get("url", "")

def get_number_from_property(number_property: Dict[str, Any]) -> int:
    """Extract number from property"""
    return number_property.get("number", 0)

def get_select_from_property(select_property: Dict[str, Any]) -> str:
    """Extract select option from property"""
    return select_property.get("select", {}).get("name", "")

def get_multi_select_from_property(multi_select_property: Dict[str, Any]) -> List[str]:
    """Extract multi-select options from property"""
    return [option.get("name", "") for option in multi_select_property.get("multi_select", [])]

def get_people_from_property(people_property: Dict[str, Any]) -> List[str]:
    """Extract people from property"""
    return [person.get("name", "") for person in people_property.get("people", [])]

def get_files_from_property(files_property: Dict[str, Any]) -> List[str]:
    """Extract file URLs from property"""
    files = []
    for file_obj in files_property.get("files", []):
        if file_obj.get("type") == "file":
            files.append(file_obj.get("file", {}).get("url", ""))
        elif file_obj.get("type") == "external":
            files.append(file_obj.get("external", {}).get("url", ""))
    return files

def get_status_from_property(status_property: Dict[str, Any]) -> str:
    """Extract status from property"""
    return status_property.get("status", {}).get("name", "")

def get_relation_from_property(relation_property: Dict[str, Any]) -> List[str]:
    """Extract relation IDs from property"""
    return [relation.get("id", "") for relation in relation_property.get("relation", [])]

def get_formula_from_property(formula_property: Dict[str, Any]) -> Any:
    """Extract formula result from property"""
    formula = formula_property.get("formula", {})
    formula_type = formula.get("type")
    
    if formula_type in ["string", "number", "boolean"]:
        return formula.get(formula_type)
    elif formula_type == "date":
        return formula.get("date", {}).get("start")
        
    return None

def get_rollup_from_property(rollup_property: Dict[str, Any]) -> Any:
    """Extract rollup result from property"""
    rollup = rollup_property.get("rollup", {})
    rollup_type = rollup.get("type")
    
    if rollup_type == "number":
        return rollup.get("number")
    elif rollup_type == "date":
        return rollup.get("date", {}).get("start")
    elif rollup_type == "array":
        # For arrays, we might have different types of items
        array_items = rollup.get("array", [])
        return [item.get(item.get("type")) for item in array_items]
        
    return None

def get_created_by_from_property(created_by_property: Dict[str, Any]) -> str:
    """Extract created by from property"""
    return created_by_property.get("created_by", {}).get("name", "")

def get_last_edited_by_from_property(last_edited_by_property: Dict[str, Any]) -> str:
    """Extract last edited by from property"""
    return last_edited_by_property.get("last_edited_by", {}).get("name", "")

def get_created_time_from_property(created_time_property: Dict[str, Any]) -> str:
    """Extract created time from property"""
    return created_time_property.get("created_time", "")

def get_last_edited_time_from_property(last_edited_time_property: Dict[str, Any]) -> str:
    """Extract last edited time from property"""
    return last_edited_time_property.get("last_edited_time", "")

def get_checkbox_from_property(checkbox_property: Dict[str, Any]) -> bool:
    """Extract boolean from checkbox property"""
    return checkbox_property.get("checkbox", False)

def get_cover_from_property(cover_property: Dict[str, Any]) -> str:
    """Extract cover image URL from files property"""
    if cover_property.get("type") == "url":
        return cover_property.get("url", "")
    
    files = cover_property.get("files", [])
    if files:
        file_obj = files[0]
        if file_obj.get("type") == "file":
            return file_obj.get("file", {}).get("url", "")
        elif file_obj.get("type") == "external":
            return file_obj.get("external", {}).get("url", "")
    return ""


def get_cover_from_blocks(blocks: List[Dict[str, Any]]) -> str:
    """Extract the first image URL from a list of blocks"""
    for block in blocks:
        if block.get("type") == "image":
            image_url = ""
            if block["image"]["type"] == "file":
                image_url = block["image"]["file"]["url"]
            elif block["image"]["type"] == "external":
                image_url = block["image"]["external"]["url"]
            return image_url
    return ""


def parse_blocks_to_markdown(blocks: List[Dict[str, Any]]) -> str:
    """Convert Notion blocks to markdown"""
    markdown_content = []
    
    for block in blocks:
        block_type = block.get("type")
        
        if block_type == "paragraph":
            text = extract_rich_text(block["paragraph"]["rich_text"])
            if text.strip():
                markdown_content.append(text)
        
        elif block_type == "heading_1":
            text = extract_rich_text(block["heading_1"]["rich_text"])
            markdown_content.append(f"# {text}")
        
        elif block_type == "heading_2":
            text = extract_rich_text(block["heading_2"]["rich_text"])
            markdown_content.append(f"## {text}")
        
        elif block_type == "heading_3":
            text = extract_rich_text(block["heading_3"]["rich_text"])
            markdown_content.append(f"### {text}")
        
        elif block_type == "bulleted_list_item":
            text = extract_rich_text(block["bulleted_list_item"]["rich_text"])
            markdown_content.append(f"- {text}")
        
        elif block_type == "numbered_list_item":
            text = extract_rich_text(block["numbered_list_item"]["rich_text"])
            markdown_content.append(f"1. {text}")
        
        elif block_type == "code":
            code_text = extract_rich_text(block["code"]["rich_text"])
            language = block["code"].get("language", "")
            markdown_content.append(f"""```{language}
{code_text}
```""")
        
        elif block_type == "image":
            image_url = ""
            if block["image"]["type"] == "file":
                image_url = block["image"]["file"]["url"]
            elif block["image"]["type"] == "external":
                image_url = block["image"]["external"]["url"]
            
            caption = ""
            if block["image"].get("caption"):
                caption = extract_rich_text(block["image"]["caption"])
            
            markdown_content.append(f"![{caption}]({image_url})")
        
        elif block_type == "quote":
            text = extract_rich_text(block["quote"]["rich_text"])
            markdown_content.append(f"> {text}")
        
        elif block_type == "divider":
            markdown_content.append("---")

        elif block_type == "table":
            table_rows = get_block_children(block["id"])
            
            # Initialize a list to hold the rows of the table
            table_data = []
            
            # Assuming the first row is the header
            header_row = table_rows[0]
            header_cells = header_row.get("table_row", {}).get("cells", [])
            header_texts = [extract_rich_text(cell) for cell in header_cells]
            table_data.append(header_texts)
            
            # Create the markdown separator for the header
            separator = ["---" for _ in header_texts]
            table_data.append(separator)
            
            # Process the rest of the rows
            for row_block in table_rows[1:]:
                row_cells = row_block.get("table_row", {}).get("cells", [])
                row_texts = [extract_rich_text(cell) for cell in row_cells]
                table_data.append(row_texts)
            
            # Format the table as markdown
            markdown_table = "\n".join(["| " + " | ".join(row) + " |" for row in table_data])
            markdown_content.append(markdown_table)
    
    return "\n\n".join(markdown_content)

def get_block_children(block_id: str) -> List[Dict[str, Any]]:
    """Get children of a block"""
    notion = get_notion()
    
    response = notion.blocks.children.list(block_id=block_id)
    return response.get("results", [])

def extract_rich_text(rich_text_list: List[Dict[str, Any]]) -> str:
    """Extract plain text from rich text objects"""
    text_parts = []
    
    for text_obj in rich_text_list:
        content = text_obj.get("text", {}).get("content", "")
        annotations = text_obj.get("annotations", {})
        
        # Apply formatting
        if annotations.get("bold"):
            content = f"**{content}**"
        if annotations.get("italic"):
            content = f"*{content}*"
        if annotations.get("code"):
            content = f"`{content}`"
        if annotations.get("strikethrough"):
            content = f"~~{content}~~"
        
        # Handle links
        if text_obj.get("href"):
            content = f"[{content}]({text_obj['href']})"
        
        text_parts.append(content)
    
    return "".join(text_parts)

def get_page_content(page_id: str) -> List[Dict[str, Any]]:
    """Get page content blocks"""
    notion = get_notion()
    
    blocks_response = notion.blocks.children.list(block_id=page_id)
    return blocks_response.get("results", [])
