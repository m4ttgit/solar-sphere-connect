import os
import re
from datetime import datetime
from supabase import create_client, Client

# Use service role key to bypass RLS
SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjYzOTcyNCwiZXhwIjoyMDU4MjE1NzI0fQ.WQKOtOyXKrIiIJK4T4xJRAhCEs6qOpU2DhBMX9NorRc"

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
        'content': markdown_content,
        'slug': re.sub(r'[^\w\s-]', '', metadata.get('title', '').lower()).replace(' ', '-').strip('-')
    }

def main():
    supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
    blog_posts_dir = "D:\\Projects\\solar-sphere-connect\\blog_posts"
    
    for filename in sorted(os.listdir(blog_posts_dir)):
        if filename.endswith('.md'):
            file_path = os.path.join(blog_posts_dir, filename)
            article_data = parse_markdown_file(file_path)
            
            if article_data:
                data = {
                    "title": article_data['title'],
                    "excerpt": article_data['excerpt'],
                    "content": article_data['content'],
                    "author": article_data['author'],
                    "read_time": article_data['read_time'],
                    "category": article_data['category'],
                    "image": article_data['image'],
                    "slug": article_data['slug'],
                    "published": True
                }
                
                try:
                    response = supabase.table("blog_posts").insert(data).execute()
                    print(f"SUCCESS: {article_data['title']}")
                except Exception as e:
                    print(f"ERROR: {article_data['title']} - {e}")

if __name__ == "__main__":
    main()