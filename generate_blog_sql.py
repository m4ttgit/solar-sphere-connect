import os
import re
from datetime import datetime

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

def escape_sql_string(text):
    """Escape single quotes for SQL."""
    return text.replace("'", "''")

def main():
    """Generate SQL INSERT statements for all blog articles."""
    blog_posts_dir = "D:\\Projects\\solar-sphere-connect\\blog_posts"
    
    sql_statements = []
    
    for filename in sorted(os.listdir(blog_posts_dir)):
        if filename.endswith('.md'):
            file_path = os.path.join(blog_posts_dir, filename)
            article_data = parse_markdown_file(file_path)
            
            if article_data:
                sql = f"""INSERT INTO blog_posts (title, excerpt, content, author, read_time, category, image, slug, published, created_at, updated_at)
VALUES (
    '{escape_sql_string(article_data['title'])}',
    '{escape_sql_string(article_data['excerpt'])}',
    '{escape_sql_string(article_data['content'])}',
    '{escape_sql_string(article_data['author'])}',
    '{escape_sql_string(article_data['read_time'])}',
    '{escape_sql_string(article_data['category'])}',
    '{escape_sql_string(article_data['image'])}',
    '{escape_sql_string(article_data['slug'])}',
    true,
    NOW(),
    NOW()
);"""
                sql_statements.append(sql)
    
    # Write to file
    with open('blog_posts_insert.sql', 'w', encoding='utf-8') as f:
        f.write("-- SQL statements to insert blog posts\n")
        f.write("-- Run these in your Supabase SQL editor\n\n")
        f.write('\n\n'.join(sql_statements))
    
    print(f"Generated SQL file: blog_posts_insert.sql")
    print(f"Contains {len(sql_statements)} INSERT statements")
    print("\nTo use:")
    print("1. Open your Supabase dashboard")
    print("2. Go to SQL Editor")
    print("3. Copy and paste the contents of blog_posts_insert.sql")
    print("4. Run the SQL")

if __name__ == "__main__":
    main()