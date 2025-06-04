// This is a Supabase function. Deploy to Supabase to run correctly.
import { serve } from "https://deno.land/std@0.217.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import unidecode from "npm:unidecode"; // Import unidecode for slugify

// Slugify function (copied from src/lib/utils.ts and adapted for Deno)
function slugify(str: string): string {
  if (!str) return ""; // Handle empty or null string
  const strWithoutDiacritics = unidecode(str);
  return strWithoutDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim() // Trim leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

serve(async (req) => {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Create a Supabase client
    const supabase = createClient(
      // Supabase API URL - Expose via env var
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - Expose via env var
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the user from the JWT
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // For now, let's assume only a specific admin user can submit blog posts
    // You might want to implement a more robust role-based access control system
    const ADMIN_USER_ID = Deno.env.get("ADMIN_USER_ID"); // Store this in your Supabase project's environment variables
    if (user.id !== ADMIN_USER_ID) {
      return new Response(
        JSON.stringify({
          error: "Forbidden: User is not authorized to submit blog posts",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body - slug is removed as it will be generated
    const {
      title,
      content,
      author,
      tags,
      category,
      is_published,
      main_image_url,
    } = await req.json();

    // Generate slug from title
    const generatedSlug = slugify(title);

    // Validate the input (basic validation) - now checks generatedSlug
    if (!title || !content || !generatedSlug) {
      const missingFields: string[] = [];
      if (!title) missingFields.push("title");
      if (!content) missingFields.push("content");
      if (!generatedSlug && title)
        missingFields.push("slug (could not be generated from title)");
      else if (!generatedSlug) missingFields.push("slug (title was missing)");

      return new Response(
        JSON.stringify({
          error: `Missing required fields: ${missingFields.join(", ")}.`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Insert the blog post into the 'blog_posts' table
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title,
          content,
          author: author || user.email, // Default to the authenticated user's email if author is not provided
          tags: tags || [],
          category,
          slug: generatedSlug, // Use the auto-generated slug
          is_published: is_published !== undefined ? is_published : false, // Default to false if not provided
          main_image_url,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      // Check for unique constraint violation on slug (error code 23505 for PostgreSQL)
      if (
        error.code === "23505" &&
        error.message.includes("blog_posts_slug_key")
      ) {
        return new Response(
          JSON.stringify({
            error:
              "A blog post with this title (resulting in the same slug) already exists.",
          }),
          {
            status: 409, // Conflict
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Blog post submitted successfully", data, slug: generatedSlug }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Error processing request:", e);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: e.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
