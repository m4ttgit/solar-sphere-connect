# Using the Blog Post Form UI to Post the Solar Products Article

This guide provides step-by-step instructions for posting the "Essential Solar Products for Sustainable Living" article using the admin UI in Solar Sphere Connect.

## Prerequisites

1. Admin access to the Solar Sphere Connect website
2. Login credentials with permission to create blog posts

## Step-by-Step Instructions

### 1. Access the Admin Dashboard

1. Log in to the Solar Sphere Connect website with your admin credentials
2. Navigate to the Admin Dashboard (typically at `/admin`)
3. From the dashboard, click on "Blog Posts" or "Manage Posts"

### 2. Create a New Blog Post

1. On the Blog Posts management page, click the "Create New Post" button
2. This will take you to the Blog Post Form at `/admin/posts/new`

### 3. Fill in the Blog Post Form

Complete the form with the following information:

#### Basic Information

- **Post Title**: Essential Solar Products for Sustainable Living: A Comprehensive Guide
- **Featured Image URL**: `/images/eco-worthy-panel.jpg`
- **Category**: Solar Products
- **Excerpt**: Discover our curated selection of high-quality solar products that can help you embrace sustainable living, reduce your carbon footprint, and save on energy costs.

#### Content

Paste the HTML content from the `post_solar_products_article.py` file or convert the Markdown content from `md/solar_products_article.md` to HTML.

> **Note**: The content field supports HTML formatting, so make sure all the affiliate links and formatting are preserved when pasting.

#### Author Information

- **Author Name**: Solar Energy Expert
- **Author Title**: Sustainable Living Specialist (optional)
- **Read Time**: 8 min read
- **Author Image URL**: (Leave blank or add a URL to an author profile image if available)

#### Publication Settings

- **Publish this post**: Check this box to make the post visible immediately

### 4. Save and Publish

1. Review all the information to ensure it's correct
2. Click the "Save and Publish" button at the top right of the form
3. You should see a success message indicating that the blog post was created successfully

### 5. Verify Publication

1. Navigate to the blog section of the website (typically at `/blog` or `/articles`)
2. Confirm that your new article appears in the list of published posts
3. Click on the article to verify that all content, images, and affiliate links are displaying correctly

## Troubleshooting

### Common Issues

1. **Image Not Displaying**: Ensure the image path is correct and the image file exists in the specified location
2. **Formatting Problems**: If the HTML content doesn't render correctly, check for any unclosed tags or formatting issues
3. **Missing Affiliate Links**: Verify that all Amazon affiliate links are properly formatted with the correct attributes

### Form Validation Errors

The form has built-in validation that requires:
- Title to be at least 5 characters
- Excerpt to be at least 20 characters
- Content to be at least 50 characters
- Author name to be at least 2 characters
- Read time to be provided
- Category to be provided
- Image URL to be a valid URL

If you encounter validation errors, review the error messages and adjust your input accordingly.

## HTML Content Format

When pasting the HTML content, ensure it follows this structure:

```html
<h2>Essential Solar Products for Sustainable Living: A Comprehensive Guide</h2>

<p>As the world increasingly embraces renewable energy...</p>

<!-- Product sections with affiliate links -->
<h3>1. ECO-WORTHY 200 Watts Solar Panel Kit: Power Your Off-Grid Adventures</h3>

<p>For those seeking energy independence... <a href="https://amzn.to/4eyX5t3" target="_blank" rel="noopener noreferrer sponsored">ECO-WORTHY 200 Watts Solar Panel Kit</a> offers an excellent solution...</p>

<!-- Additional content... -->
```

Ensure all affiliate links include the attributes `target="_blank" rel="noopener noreferrer sponsored"` for proper tracking and compliance.

## Notes

- The blog post will be automatically assigned a slug based on the title
- The creation date will be automatically set to the current date
- You can edit the post later if needed by navigating to the post management page and clicking "Edit"

For any additional assistance, refer to the developer documentation or contact the website administrator.