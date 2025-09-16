import os
import re
from datetime import datetime
from supabase import create_client, Client

SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjYzOTcyNCwiZXhwIjoyMDU4MjE1NzI0fQ.WQKOtOyXKrIiIJK4T4xJRAhCEs6qOpU2DhBMX9NorRc"

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
    
    markdown_content = parts[2].strip()
    return markdown_content

def main():
    supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
    blog_posts_dir = "D:\\Projects\\solar-sphere-connect\\blog_posts"
    
    for filename in sorted(os.listdir(blog_posts_dir)):
        if filename.endswith('.md') and filename in SLUG_MAP:
            file_path = os.path.join(blog_posts_dir, filename)
            markdown_content = parse_markdown_file(file_path)
            original_slug = SLUG_MAP[filename]
            
            if markdown_content:
                try:
                    response = supabase.table("blog_posts").update({
                        "content": markdown_content,
                        "updated_at": datetime.now().isoformat()
                    }).eq("slug", original_slug).execute()
                    
                    print(f"UPDATED: {filename}")
                except Exception as e:
                    print(f"ERROR updating {filename}: {e}")

if __name__ == "__main__":
    main()