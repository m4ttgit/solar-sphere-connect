# Developer Guide: Solar Sphere Connect - Blog Post Management

This document outlines the changes made to the Solar Sphere Connect application to implement slug-based URLs for blog posts, along with the necessary database migrations and troubleshooting steps encountered during the development process.

## 1. Codebase Modifications

The following files were modified to transition from `id`-based blog post fetching and updating to `slug`-based:

### `src/pages/admin/BlogPostForm.tsx`

- Updated to use `slug` from `useParams` for fetching and updating blog posts.
- Added `slug` as an optional field to the form schema.

### `src/App.tsx`

- Modified routing to use `slug` instead of `id` for blog post detail pages.

### `src/pages/BlogPostDetail.tsx`

- Updated to fetch blog post details using `slug` from the URL parameters.

### `src/pages/ArticlePage.tsx`

- Ensured that `BlogPostCard` components correctly use `post.slug` for navigation.
- Verified that the `ArticlePage` component fetches blog posts, expecting a `slug` property.

### `src/pages/admin/BlogPostsList.tsx`

- Updated to display and link to blog posts using their `slug`.

### `supabase/functions/submit-blog/index.ts`

- Modified the Supabase Edge Function to explicitly return the `generatedSlug` in the success response for newly created blog posts. This ensures that the client-side application receives the slug immediately upon post creation.

## 2. Database Migration for Slugs

To ensure existing blog posts have a `slug` and to add the `slug` column to the `blog_posts` table, a Supabase migration was created.

### Migration File: `supabase/migrations/20250604053007_populate_blog_post_slugs.sql`

This migration file contains SQL commands to:

1. Add a new `slug` column to the `blog_posts` table.
2. Populate the `slug` column for existing entries by generating slugs from their `title`.
3. Add a unique constraint to the `slug` column to prevent duplicate slugs.

**Note**: The exact SQL content for populating slugs was directly written to this file due to issues with `list_dir` not consistently showing newly created migration files.

## 3. Troubleshooting and Next Steps

During the process, several issues were encountered, primarily related to the Supabase CLI and local environment setup.

### Supabase CLI Issues:

- `supabase db diff --schema`: Initially failed due to incorrect flag usage. The `--schema` flag requires an argument.
- `supabase sql`: Failed as it's not a recognized command for direct SQL execution. Alternatives like `node-postgres` or Supabase client libraries with `RPC` and `VIEWS` are suggested for dynamic SQL.

### Database Migration Application Issues:

- `supabase db push`: Failed with "Cannot find project ref" error, suggesting `supabase link`.
- `supabase link`: Failed due to missing access token, suggesting `supabase login` or setting `SUPABASE_ACCESS_TOKEN`.
- `supabase start`: Failed because Docker Desktop was not running or accessible, which is a prerequisite for local Supabase services.

### Current Status and Resolution:

All necessary code changes for slug-based URLs have been implemented. However, the database migration to add and populate the `slug` column for existing blog posts has not been successfully applied to the local Supabase database due to the Docker Desktop dependency.

**To complete the database setup and resolve the `undefined` slug issue for existing posts, the next developer must:**

1.  **Ensure Docker Desktop is running.**
2.  **Run `supabase start`** in the project root directory to start local Supabase services.
3.  **Run `supabase db push`** in the project root directory to apply the pending database migration.

Once these steps are completed, existing blog posts should have their `slug` values populated, and the application should correctly display blog post details using the slug in the URL.
