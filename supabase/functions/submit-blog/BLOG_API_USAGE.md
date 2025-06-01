# Blog Post Submission API Usage Guide

This guide explains how to use the API endpoint to submit new blog posts.

## Endpoint Details

- **URL**: `[YOUR_SUPABASE_PROJECT_URL]/functions/v1/submit-blog`
  - Replace `[YOUR_SUPABASE_PROJECT_URL]` with your actual Supabase project URL (e.g., `https://xyz.supabase.co`).
- **Method**: `POST`
- **Authentication**: JWT (JSON Web Token) via Supabase Auth.

## Headers

- `Authorization`: `Bearer [YOUR_SUPABASE_JWT]`
  - Replace `[YOUR_SUPABASE_JWT]` with a valid JWT for an authenticated admin user.
- `Content-Type`: `application/json`

## Request Body (JSON)

The following fields are required in the JSON payload:

- `title` (string, required, max 255 chars): The title of the blog post.
- `content` (string, required): The main content of the blog post (in Markdown or HTML).
- `slug` (string, required, max 255 chars, unique): A URL-friendly slug for the blog post. Must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` (e.g., `my-awesome-post`).

Optional fields:

- `author` (string, optional, max 100 chars): The name of the author.
- `tags` (array of strings, optional): A list of tags for the blog post.
- `category` (string, optional, max 100 chars): The category of the blog post.
- `image_url` (string, optional, max 255 chars): A URL for a cover image for the blog post.
- `is_published` (boolean, optional, default: `false`): Set to `true` to publish immediately.
- `meta_description` (string, optional, max 160 chars): SEO meta description.
- `meta_keywords` (array of strings, optional): SEO meta keywords.

### Example JSON Payload:

```json
{
  "title": "My First Blog Post",
  "content": "# Hello World\n\nThis is the content of my first blog post.",
  "slug": "my-first-blog-post",
  "author": "Admin User",
  "tags": ["tech", "supabase", "deno"],
  "category": "Tutorials",
  "image_url": "https://example.com/images/first-post.jpg",
  "is_published": true,
  "meta_description": "A short summary of my first blog post for SEO.",
  "meta_keywords": ["blogging", "first post", "example"]
}
```

## `curl` Example

Replace placeholders with your actual data.

```bash
curl -X POST \
  '[YOUR_SUPABASE_PROJECT_URL]/functions/v1/submit-blog' \
  -H 'Authorization: Bearer [YOUR_SUPABASE_JWT]' \
  -H 'Content-Type: application/json' \
  -d '{
        "title": "My Awesome Blog Post via API",
        "content": "This is some amazing content submitted through the API.",
        "slug": "my-awesome-blog-post-api",
        "author": "API Master",
        "tags": ["api", "automation"],
        "category": "Development",
        "is_published": false
      }'
```

## Responses

- **201 Created**: Blog post created successfully. The response body will contain the newly created blog post data.
  ```json
  {
    "message": "Blog post created successfully",
    "data": {
      "id": "generated-uuid",
      "user_id": "admin-user-uuid",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "title": "My Awesome Blog Post via API",
      "content": "This is some amazing content submitted through the API.",
      "slug": "my-awesome-blog-post-api",
      "author": "API Master",
      "tags": ["api", "automation"],
      "category": "Development",
      "image_url": null,
      "is_published": false,
      "published_at": null,
      "meta_description": null,
      "meta_keywords": null
    }
  }
  ```
- **400 Bad Request**: Invalid input (e.g., missing required fields, invalid slug format). The response body will contain an error message.
  ```json
  {
    "error": "Invalid input: Title, content, and slug are required."
  }
  ```
  ```json
  {
    "error": "Invalid slug format. Slug must be lowercase alphanumeric with hyphens."
  }
  ```
- **401 Unauthorized**: Missing or invalid JWT.
  ```json
  {
    "error": "User not authenticated"
  }
  ```
- **403 Forbidden**: Authenticated user is not an admin.
  ```json
  {
    "error": "User is not authorized to perform this action"
  }
  ```
- **405 Method Not Allowed**: Request method is not `POST`.
  ```json
  {
    "error": "Method not allowed. Only POST requests are accepted."
  }
  ```
- **409 Conflict**: A blog post with the same slug already exists.
  ```json
  {
    "error": "A blog post with this slug already exists."
  }
  ```
- **500 Internal Server Error**: An unexpected error occurred on the server.
  ```json
  {
    "error": "Internal server error: [Specific error message]"
  }
  ```

## Local Development

To run the Supabase function locally, you need to use the Supabase CLI.

1.  **Install the Supabase CLI**: Follow the instructions on the Supabase website to install the CLI: <https://supabase.com/docs/guides/cli/getting-started>
2.  **Initialize your Supabase project**: Run `supabase init` in your project directory.
3.  **Start the Supabase local development environment**: Run `supabase start`. This will start all the Supabase services, including the database and functions.
4.  **Serve the function**: Run `supabase functions serve` in the `supabase/functions/submit-blog` directory. This will start a local server that will serve the function.

Now you can access the function at `http://localhost:8000`.

## Important Notes

1.  **Admin Privileges**: This endpoint requires the `ADMIN_USER_ID` environment variable to be set in your Supabase function's settings. The JWT provided in the `Authorization` header must belong to the user whose ID matches this environment variable.
2.  **Slug Uniqueness**: The `slug` must be unique across all blog posts.
3.  **Error Handling**: Ensure your client-side implementation handles these different HTTP status codes and error messages appropriately.

This documentation should help you integrate the blog submission API into your admin workflow.
