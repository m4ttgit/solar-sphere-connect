import os
import re
from datetime import datetime
from supabase import create_client, Client

# Supabase credentials - you may need to use service_role key for RLS bypass
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

def main():
    """Post all blog articles from the blog_posts directory."""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    blog_posts_dir = "D:\\Projects\\solar-sphere-connect\\blog_posts"
    
    print("Processing blog posts...")
    
    for filename in sorted(os.listdir(blog_posts_dir)):
        if filename.endswith('.md'):
            file_path = os.path.join(blog_posts_dir, filename)
            article_data = parse_markdown_file(file_path)
            
            if article_data:
                print(f"\nProcessing: {article_data['title']}")
                
                # Check if article already exists
                existing = supabase.table("blog_posts").select("id").eq("slug", article_data['slug']).execute()
                
                if existing.data:
                    print(f"  Already exists, skipping...")
                    continue
                
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
                    "published": True
                }
                
                try:
                    # Try to insert without RLS constraints
                    response = supabase.table("blog_posts").insert(data).execute()
                    if response.data:
                        print(f"  SUCCESS: Posted successfully")
                    else:
                        print(f"  ERROR: No data returned")
                except Exception as e:
                    print(f"  ERROR: {e}")
                    # Print the data structure for debugging
                    print(f"  Data structure: {list(data.keys())}")

if __name__ == "__main__":
    main()