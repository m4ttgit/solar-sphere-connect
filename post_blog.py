import os
from supabase import create_client, Client
import uuid
from datetime import datetime
import re
from getpass import getpass # For secure password input

# Supabase credentials - Replace with your actual project URL and anon key
# It's recommended to use environment variables for sensitive information
SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Mzk3MjQsImV4cCI6MjA1ODIxNTcyNH0.5bU4C32vLSlHW-mmVcXIg1vMZb_o3_k-u5OIdpUxNLk"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)  # Remove all non-word chars
    text = re.sub(r'[\s_-]+', '-', text)  # Replace spaces and underscores with a single dash
    text = text.strip('-') # Remove leading/trailing dashes
    return text

def post_article(title: str, excerpt: str, content: str, author: str, read_time: str, category: str, image_url: str, email: str, password: str, published: bool = True):
    """
    Posts a new article to the Supabase blog_posts table after authenticating the user.

    Args:
        title (str): The title of the blog post.
        excerpt (str): A brief summary of the blog post.
        content (str): The full content of the blog post.
        author (str): The author of the blog post.
        read_time (str): Estimated read time (e.g., '5 min read').
        category (str): The category of the blog post.
        image_url (str): URL of the main image for the blog post.
        email (str): User's email for authentication.
        password (str): User's password for authentication.
        published (bool, optional): Whether the blog post should be published immediately. Defaults to True.
    """
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

        # Authenticate user
        auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})

        if auth_response.user:
            print(f"User '{auth_response.user.email}' authenticated successfully.")
            # The client is automatically updated with the session
            
            # Generate slug
            article_slug = slugify(title)

            data = {
                "title": title,
                "excerpt": excerpt,
                "content": content,
                "author": author,
                "read_time": read_time,
                "category": category,
                "image": image_url,
                "published": published,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "slug": article_slug # Add the generated slug
            }

            response = supabase.table("blog_posts").insert(data).execute()

            if response.data:
                print(f"Successfully posted article: '{title}' with slug: '{article_slug}'")
                print("Response data:", response.data)
            else:
                print(f"Failed to post article: '{title}'")
                print("Error:", response.error)
        else:
            print("Authentication failed.")
            print("Error:", auth_response.error)

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Example usage:
    # You can replace these with dynamic content generation or user input
    article_title = "Benefits of Residential Solar Power"
    article_excerpt = "Discover the environmental and financial advantages of installing solar panels at home."
    article_content = """
    ### Why Go Solar at Home?

    Residential solar power offers numerous advantages for homeowners looking to reduce their carbon footprint and save on electricity bills.

    **Key Benefits:**
    *   **Reduced Electricity Bills:** Generate your own power and significantly lower or even eliminate your monthly electricity costs.
    *   **Environmental Impact:** Reduce reliance on fossil fuels, contributing to a cleaner environment and combating climate change.
    *   **Increased Home Value:** Homes with solar panels often sell faster and at a premium.
    *   **Energy Independence:** Lessen your dependence on the grid and protect yourself from rising energy prices.
    *   **Government Incentives:** Take advantage of tax credits, rebates, and other incentives that make solar more affordable.

    **Getting Started:**
    1.  **Assess Your Needs:** Determine your energy consumption and roof suitability.
    2.  **Get Quotes:** Contact multiple solar installers for competitive bids.
    3.  **Understand Financing:** Explore options like cash purchase, solar loans, or leases.
    4.  **Installation:** Professional installation ensures optimal performance and safety.
    5.  **Monitor Performance:** Track your system's output to ensure it's meeting your energy goals.
    """
    article_author = "SolarHub Team"
    article_read_time = "7 min read"
    article_category = "Home Improvement"
    article_image_url = "https://images.unsplash.com/photo-1508919801863-f7014a811008?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    # Prompt for user credentials
    user_email = input("Enter your Supabase registered email: ")
    user_password = getpass("Enter your Supabase password: ")

    post_article(
        title=article_title,
        excerpt=article_excerpt,
        content=article_content,
        author=article_author,
        read_time=article_read_time,
        category=article_category,
        image_url=article_image_url,
        email=user_email,
        password=user_password,
        published=True
    )
