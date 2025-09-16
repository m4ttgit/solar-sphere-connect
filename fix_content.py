from supabase import create_client, Client
from datetime import datetime

SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjYzOTcyNCwiZXhwIjoyMDU4MjE1NzI0fQ.WQKOtOyXKrIiIJK4T4xJRAhCEs6qOpU2DhBMX9NorRc"

def main():
    supabase: Client = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
    
    # Simple test content
    test_content = """# Solar Energy Storage: Complete Guide

Solar energy storage systems are essential for achieving energy independence. Here's what you need to know:

## Why Storage Matters

Energy storage allows you to:

- Store excess solar energy during the day
- Use power when the sun isn't shining
- Achieve energy independence
- Reduce electricity bills

## Types of Batteries

### Lithium-Ion Batteries
These are the most popular choice for home storage systems.

### Lead-Acid Batteries
A more affordable option with shorter lifespan.

## Conclusion

Solar storage is the future of home energy systems."""

    try:
        response = supabase.table("blog_posts").update({
            "content": test_content,
            "updated_at": datetime.now().isoformat()
        }).eq("slug", "solar-energy-storage-batteries-and-beyond").execute()
        
        print("SUCCESS: Updated with simple test content")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    main()