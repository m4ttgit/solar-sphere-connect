import os
from supabase import create_client, Client
import uuid
from datetime import datetime
from getpass import getpass # For secure password input

# Supabase credentials - Replace with your actual project URL and anon key
# It's recommended to use environment variables for sensitive information
SUPABASE_URL = "https://vtjpbsfogcwqvgbllsqe.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Mzk3MjQsImV4cCI6MjA1ODIxNTcyNH0.5bU4C32vLSlHW-mmVcXIg1vMZb_o3_k-u5OIdpUxNLk"

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
                "updated_at": datetime.now().isoformat()
            }

            response = supabase.table("blog_posts").insert(data).execute()

            if response.data:
                print(f"Successfully posted article: '{title}'")
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
    article_title = "Understanding Solar Panel Efficiency"
    article_excerpt = "A deep dive into what makes solar panels efficient and how to maximize their performance."
    article_content = """
    ### Maximizing Your Solar Panel Efficiency

    Solar panel efficiency is a key factor in how much electricity your system will generate. It refers to the percentage of sunlight that hits the panel and is converted into usable electricity.

    **Factors Affecting Efficiency:**
    *   **Panel Type:** Monocrystalline panels are generally more efficient than polycrystalline or thin-film panels.
    *   **Temperature:** Solar panels perform best in cooler temperatures. High temperatures can reduce efficiency.
    *   **Shading:** Even partial shading can significantly reduce the output of an entire string of panels.
    *   **Orientation and Tilt:** Panels facing true south (in the Northern Hemisphere) with an optimal tilt angle will capture the most sunlight.
    *   **Cleanliness:** Dust, dirt, and debris on the panels can block sunlight and reduce efficiency. Regular cleaning is recommended.

    **Tips for Maximizing Efficiency:**
    1.  **Regular Cleaning:** Keep your panels free from dirt, dust, and bird droppings.
    2.  **Optimal Placement:** Ensure panels are installed in a location with maximum sun exposure throughout the day.
    3.  **Shade Mitigation:** Trim trees or remove obstructions that might cast shadows on your panels.
    4.  **Monitoring System:** Use a monitoring system to track your panel's performance and identify any issues quickly.
    5.  **Professional Maintenance:** Schedule periodic inspections and maintenance with a qualified solar technician.
    """
    article_author = "Solar Energy Expert"
    article_read_time = "5 min read"
    article_category = "Technology"
    article_image_url = "https://unsplash.com/photos/solar-panels-on-a-roof-during-daytime-d_y_S_9_Y_g"

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
