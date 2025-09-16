import os
import re
import asyncio
from datetime import datetime
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Mzk3MjQsImV4cCI6MjA1ODIxNTcyNH0.5bU4C32vLSlHW-mmVcXIg1vMZb_o3_k-u5OIdpUxNLk"

def parse_markdown_file(file_path):
    """Parse markdown file and extract frontmatter and content."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Split frontmatter and content
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None
    
    frontmatter = parts[1].strip()
    markdown_content = parts[2].strip()
    
    # Parse frontmatter
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
        'slug': slugify(metadata.get('title', ''))
    }

def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

async def post_blog_articles():
    """Post all blog articles from the blog_posts directory."""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    blog_posts_dir = "D:\\Projects\\solar-sphere-connect\\blog_posts"
    
    for filename in os.listdir(blog_posts_dir):
        if filename.endswith('.md'):
            file_path = os.path.join(blog_posts_dir, filename)
            article_data = parse_markdown_file(file_path)
            
            if article_data:
                # Prepare data for Supabase
                data = {
                    "title": article_data['title'],
                    "excerpt": article_data['excerpt'],
                    "content": article_data['content'],
                    "author": article_data['author'],
                    "read_time": article_data['read_time'],
                    "category": article_data['category'],
                    "image": article_data['image'],
                    "slug": article_data['slug'],
                    "published": True,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                
                try:
                    response = supabase.table("blog_posts").insert(data).execute()
                    print(f"Success: Posted {article_data['title']}")
                except Exception as e:
                    print(f"Error posting {article_data['title']}: {e}")

if __name__ == "__main__":
    asyncio.run(post_blog_articles())