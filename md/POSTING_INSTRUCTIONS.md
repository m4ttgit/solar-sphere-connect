# Instructions for Posting the Solar Products Article

This document provides instructions for posting the "Essential Solar Products for Sustainable Living" article to the Solar Sphere Connect blog. There are two methods available:

## Method 1: Using the Python Script (Recommended)

A Python script has been created to automate the posting process. This is the recommended method as it ensures all fields are correctly formatted and submitted.

### Steps:

1. Open a terminal or command prompt
2. Navigate to the project root directory:
   ```
   cd d:\Projects\solar-sphere-connect
   ```
3. Run the Python script:
   ```
   python post_solar_products_article.py
   ```
4. Follow the prompts to enter your email and password
5. Confirm the posting when prompted

### What the Script Does:

The script will:
- Connect to your Supabase database
- Authenticate using your credentials
- Create a slug from the article title
- Post the article with all required fields (title, excerpt, content, author, etc.)
- Set the article status to published

## Method 2: Manual Posting via the Blog Post Form

If you prefer to post the article manually or need to make edits before posting, you can use the blog post form in the admin interface.

### Steps:

1. Log in to the Solar Sphere Connect admin interface
2. Navigate to the blog management section
3. Click "Create New Post"
4. Fill in the form fields with the following information:
   - **Title**: Essential Solar Products for Sustainable Living: A Comprehensive Guide
   - **Excerpt**: Discover our curated selection of high-quality solar products that can help you embrace sustainable living, reduce your carbon footprint, and save on energy costs.
   - **Author**: Solar Energy Expert
   - **Read Time**: 8 min read
   - **Category**: Solar Products
   - **Image**: /images/eco-worthy-panel.jpg
   - **Content**: Copy the HTML content from the Python script or convert the Markdown content from `md/solar_products_article.md`
   - **Published**: Check this box to publish immediately
5. Click "Submit" to post the article

## Reference Files

The following files have been created for this article:

1. `post_solar_products_article.py` - Python script for automated posting
2. `md/solar_products_article.md` - Markdown version of the article (for reference and editing)

## Notes

- The article includes Amazon affiliate links for all six products
- The main image is set to use the ECO-WORTHY Solar Panel image
- The article is structured with proper HTML formatting for the blog
- All links include proper attributes for affiliate marketing compliance

## Troubleshooting

If you encounter issues with the Python script:

1. Ensure you have the required dependencies installed
2. Verify your Supabase credentials are correct
3. Check that the `post_blog.py` file is in the project root directory
4. Ensure you have proper permissions to post to the blog_posts table

If you need to make changes to the article content, edit the Markdown file first, then convert it to HTML before posting.