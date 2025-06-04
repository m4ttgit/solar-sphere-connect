# Option 1: Supabase `name_slug` Column Fix

This document outlines the steps to implement Option 1 for resolving the "not found" error for individual business pages. This solution involves adding a `name_slug` column to your `solar_contacts` table in Supabase and populating it with slugified versions of the company names.

## Steps:

### 1. Add `name_slug` Column to Supabase Table

1.  **Log in to your Supabase project.**
2.  Navigate to the **Table Editor** (usually found in the left sidebar).
3.  Select the `solar_contacts` table.
4.  Click on **"Add column"** or a similar option to add a new column.
5.  Configure the new column with the following details:
    *   **Name:** `name_slug`
    *   **Type:** `text` (or `varchar` with a suitable length, e.g., 255)
    *   **Nullable:** `Yes` (initially, you can change this later once all data is populated)
    *   **Default Value:** Leave empty or `NULL`
6.  Save the changes to your table.

### 2. Populate `name_slug` Column

After adding the column, you need to populate it with slugified versions of your existing company names. This can be done in several ways:

#### a. Using a Supabase SQL Query (Recommended for existing data)

You can run an SQL query directly in Supabase to update the `name_slug` column for all existing rows. You'll need a function to slugify the names. Supabase allows you to create custom SQL functions.

**Example SQL (Conceptual - you might need to adapt for your specific Supabase setup and a slugify function):**

First, you might need a `slugify` function in your Supabase database. If you don't have one, you'd need to create a PostgreSQL function. Here's a conceptual example of how you might create and use one (this requires `unaccent` extension for better slugification):

-- Enable unaccent extension if not already enabled
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create a slugify function (example, may vary based on PostgreSQL version and requirements)
CREATE OR REPLACE FUNCTION slugify(value TEXT) RETURNS TEXT AS $$
  SELECT lower(regexp_replace(unaccent(value), '[^a-z0-9]+', '-', 'g'))
$$ LANGUAGE plpgsql STRICT IMMUTABLE;

-- Update the name_slug column for existing entries
UPDATE solar_contacts
SET name_slug = slugify(name)
WHERE name_slug IS NULL OR name_slug = '';