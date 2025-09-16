from supabase import create_client, Client

SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjYzOTcyNCwiZXhwIjoyMDU4MjE1NzI0fQ.WQKOtOyXKrIiIJK4T4xJRAhCEs6qOpU2DhBMX9NorRc"

def main():
    supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
    
    # Check the specific post
    response = supabase.table("blog_posts").select("*").eq("slug", "solar-energy-storage-batteries-and-beyond").execute()
    
    if response.data:
        post = response.data[0]
        print(f"Title: {post['title']}")
        print(f"Published: {post['published']}")
        print(f"Content length: {len(post['content']) if post['content'] else 0}")
        print(f"Content preview: {post['content'][:200] if post['content'] else 'NO CONTENT'}...")
    else:
        print("Post not found")

if __name__ == "__main__":
    main()