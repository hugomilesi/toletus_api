import json
import os

def load_collection(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def format_description(description):
    if not description:
        return ""
    if isinstance(description, dict):
        return description.get('content', '')
    return description

def format_url(url_obj):
    if isinstance(url_obj, str):
        return url_obj
    if isinstance(url_obj, dict):
        return url_obj.get('raw', '')
    return ""

def format_headers(headers):
    if not headers:
        return None
    lines = []
    for h in headers:
        lines.append(f"- **{h.get('key')}**: `{h.get('value')}`")
    return "\n".join(lines)

def format_body(body):
    if not body:
        return None
    mode = body.get('mode')
    if mode == 'raw':
        return body.get('raw')
    elif mode == 'formdata':
        lines = []
        for item in body.get('formdata', []):
            lines.append(f"- {item.get('key')}: {item.get('value')} ({item.get('type')})")
        return "\n".join(lines)
    elif mode == 'urlencoded':
        lines = []
        for item in body.get('urlencoded', []):
            lines.append(f"- {item.get('key')}: {item.get('value')}")
        return "\n".join(lines)
    return None

def process_item(item, level=1):
    output = []
    
    # Is it a folder or a request?
    if 'item' in item: # Folder
        header_prefix = "#" * level
        output.append(f"{header_prefix} {item.get('name')}\n")
        
        desc = format_description(item.get('description'))
        if desc:
            output.append(f"{desc}\n")
            
        for subitem in item.get('item', []):
            output.extend(process_item(subitem, level + 1))
            
    elif 'request' in item: # Request
        header_prefix = "#" * level
        output.append(f"{header_prefix} {item.get('name')}\n")
        
        request = item.get('request')
        method = request.get('method')
        url = format_url(request.get('url'))
        
        output.append(f"**Method:** `{method}`  \n")
        output.append(f"**URL:** `{url}`\n")
        
        desc = format_description(request.get('description'))
        if desc:
            output.append(f"**Description:**\n{desc}\n")
        
        headers = format_headers(request.get('header'))
        if headers:
            output.append(f"**Headers:**\n{headers}\n")
            
        body = format_body(request.get('body'))
        if body:
            output.append("**Body:**\n")
            output.append("```json")
            output.append(f"{body}")
            output.append("```\n")
            
        # Responses
        if 'response' in item and item['response']:
            output.append("**Responses:**\n")
            for resp in item['response']:
                output.append(f"#### {resp.get('code', 'Unknown Code')} {resp.get('status', '')}")
                if resp.get('body'):
                    output.append("```json")
                    try:
                        # Try to format JSON if valid
                        parsed = json.loads(resp.get('body'))
                        output.append(json.dumps(parsed, indent=2))
                    except:
                        output.append(resp.get('body'))
                    output.append("```\n")
        
        output.append("---\n")
        
    return output

def main():
    try:
        collection = load_collection('postman_collection.json')
        
        info = collection.get('info', {})
        name = info.get('name', 'API Documentation')
        desc = format_description(info.get('description'))
        
        markdown_content = []
        markdown_content.append(f"# {name}\n")
        if desc:
            markdown_content.append(f"{desc}\n")
        markdown_content.append("---\n")
        
        for item in collection.get('item', []):
            markdown_content.extend(process_item(item, 2))
            
        with open('documentation.md', 'w', encoding='utf-8') as f:
            f.write("".join(markdown_content))
            
        print("Documentation generated successfully in documentation.md")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
