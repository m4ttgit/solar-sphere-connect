// This is a Supabase function. Deploy to Supabase to run correctly.
import { serve } from 'https://deno.land/std@0.217.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Create a Supabase client
    const supabase = createClient(
      // Supabase API URL - Expose via env var
      process.env.SUPABASE_URL ?? '',
      // Supabase API ANON KEY - Expose via env var
      process.env.SUPABASE_ANON_KEY ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the user from the JWT
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // For now, let's assume only a specific admin user can submit blog posts
    // You might want to implement a more robust role-based access control system
    const ADMIN_USER_ID = process.env.ADMIN_USER_ID // Store this in your Supabase project's environment variables
    if (user.id !== ADMIN_USER_ID) {
        return new Response(JSON.stringify({ error: 'Forbidden: User is not authorized to submit blog posts' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    // Parse the request body
    const { title, content, author, tags, category, slug, is_published, main_image_url } = await req.json()

    // Validate the input (basic validation)
    if (!title || !content || !slug) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title, content, and slug are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Insert the blog post into the 'blog_posts' table
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title,
          content,
          author: author || user.email, // Default to the authenticated user's email if author is not provided
          tags: tags || [],
          category,
          slug,
          is_published: is_published !== undefined ? is_published : false, // Default to false if not provided
          main_image_url,
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: 'Blog post submitted successfully', data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Error processing request:', e)
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
