import { serve } from "https://deno.land/std@0.217.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for handling preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Handle POST requests for form submissions
  if (req.method === "POST") {
    try {
      // Create a Supabase client with service role key to bypass RLS
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      );

      // Parse the request body
      let requestBody;
      try {
        requestBody = await req.json();
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Invalid JSON in request body" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const {
        name,
        email,
        subject,
        message,
        phone,
        company,
        address,
        city,
        state,
        zip_code,
        website
      } = requestBody;

      // Validate the input (basic validation)
      if (!name || !email || !message) {
        const missingFields: string[] = [];
        if (!name) missingFields.push("name");
        if (!email) missingFields.push("email");
        if (!message) missingFields.push("message");

        return new Response(
          JSON.stringify({
            error: `Missing required fields: ${missingFields.join(", ")}.`,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Generate a UUID for the contact entry
      const contactId = crypto.randomUUID();

      // Insert the contact form data into the 'solar_contacts' table
      const { data, error } = await supabase
        .from("solar_contacts")
        .insert([
          {
            name,
            email,
            description: message,
            phone: phone || null,
            address: address || null,
            city: city || null,
            state: state || null,
            zip_code: zip_code || null,
            website: website || null,
            uuid_id: contactId,
            services: subject ? [subject] : null,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Send email notification after successful database insertion
      try {
        const emailApiKey = Deno.env.get("RESEND_API_KEY");
        const notificationEmail = Deno.env.get("NOTIFICATION_EMAIL") || "topsolarspecialist@gmail.com";

        if (emailApiKey) {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${emailApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Solar Sphere Connect <noreply@solarhub.top>",
              to: [notificationEmail],
              subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #f59e0b;">New Contact Form Submission</h2>
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                    ${address ? `<p><strong>Address:</strong> ${address}${city ? ', ' + city : ''}${state ? ', ' + state : ''}${zip_code ? ' ' + zip_code : ''}</p>` : ''}
                    ${website ? `<p><strong>Website:</strong> ${website}</p>` : ''}
                  </div>
                  <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #92400e; margin-top: 0;">Message:</h3>
                    <p style="color: #78350f; white-space: pre-wrap;">${message}</p>
                  </div>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                  <p style="color: #6b7280; font-size: 14px;">
                    This inquiry was submitted through the Solar Sphere Connect contact form.
                  </p>
                </div>
              `,
            }),
          });

          if (!emailResponse.ok) {
            console.error("Failed to send email:", await emailResponse.text());
          } else {
            console.log("Email notification sent successfully");
          }
        } else {
          console.log("Email API key not configured, skipping email notification");
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the request if email fails
      }

      return new Response(
        JSON.stringify({
          message: "Contact form submitted successfully",
          data,
          id: contactId
        }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (e) {
      console.error("Error processing request:", e);
      return new Response(
        JSON.stringify({ error: "Internal Server Error", details: e.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // Handle DELETE requests for deleting inquiries
  if (req.method === "DELETE") {
    try {
      const url = new URL(req.url);
      const uuid_id = url.searchParams.get("uuid_id");

      if (!uuid_id) {
        return new Response(
          JSON.stringify({ error: "UUID ID is required for deletion" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Create a Supabase client with service role key to bypass RLS
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      );

      const { error } = await supabase
        .from("solar_contacts")
        .delete()
        .eq("uuid_id", uuid_id);

      if (error) {
        console.error("Supabase delete error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ message: "Inquiry deleted successfully" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error", details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // Method not allowed
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});