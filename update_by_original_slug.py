import os
import re
from datetime import datetime
from supabase import create_client, Client

SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjYzOTcyNCwiZXhwIjoyMDU4MjE1NzI0fQ.WQKOtOyXKrIiIJK4T4xJRAhCEs6qOpU2DhBMX9NorRc"

# Map filenames to original slugs
SLUG_MAP = {
    "1-understanding-solar-energy.md": "understanding-solar-energy-a-beginners-guide",
    "2-solar-panels-for-homes.md": "solar-panels-for-homes-a-comprehensive-guide", 
    "3-solar-energy-storage.md": "solar-energy-storage-batteries-and-beyond",
    "4-cost-of-solar-energy.md": "the-cost-of-solar-energy-is-it-worth-it",
    "5-future-of-solar-energy.md": "the-future-of-solar-energy-innovations-and-trends"
}

def parse_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None
    
    frontmatter = parts[1].strip()
    markdown_content = parts[2].strip()
    
    metadata = {}
    for line in frontmatter.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            metadata[key.strip()] = value.strip()
    
    return {
        'title': metadata.get('title', ''),
        'excerpt': metadata.get('excerpt', ''),
        'author': metadata.get('author', ''),
        'read_time': metadata.get('read_time', ''),
        'category': metadata.get('category', ''),
        'image': metadata.get('image', ''),
        'content': markdown_content
    }

def main():
    supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
    blog_posts_dir = "D:\\Projects\\solar-sphere-connect\\blog_posts"
    
    for filename in sorted(os.listdir(blog_posts_dir)):
        if filename.endswith('.md') and filename in SLUG_MAP:
            file_path = os.path.join(blog_posts_dir, filename)
            article_data = parse_markdown_file(file_path)
            original_slug = SLUG_MAP[filename]
            
            if article_data:
                # Find existing article by original slug
                existing = supabase.table("blog_posts").select("id").eq("slug", original_slug).execute()
                
                if existing.data:
                    article_id = existing.data[0]['id']
                    update_data = {
                        "title": article_data['title'],
                        "excerpt": article_data['excerpt'],
                        "content": article_data['content'],
                        "updated_at": datetime.now().isoformat()
                    }
                    
                    try:
                        response = supabase.table("blog_posts").update(update_data).eq("id", article_id).execute()
                        print(f"UPDATED: {article_data['title']}")
                    except Exception as e:
                        print(f"ERROR: {e}")
                else:
                    print(f"NOT FOUND: {original_slug}")

if __name__ == "__main__":
    main()