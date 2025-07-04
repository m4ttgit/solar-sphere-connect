
-- Supabase RLS Policies
-- Make sure to apply these to your Supabase project via the SQL Editor
-- or by ensuring this file is UTF-8 encoded and used in migrations.

-- Enable RLS on tables if not already enabled
ALTER TABLE public.solar_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_businesses ENABLE ROW LEVEL SECURITY;

-- solar_contacts policies
DROP POLICY IF EXISTS solar_contacts_read_policy ON public.solar_contacts;
CREATE POLICY solar_contacts_read_policy ON public.solar_contacts
FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS solar_contacts_insert_policy ON public.solar_contacts;
CREATE POLICY solar_contacts_insert_policy ON public.solar_contacts
FOR INSERT TO authenticated WITH CHECK (TRUE);

-- Admin-only insert policy
DROP POLICY IF EXISTS solar_contacts_admin_insert_policy ON public.solar_contacts;
CREATE POLICY solar_contacts_admin_insert_policy ON public.solar_contacts
FOR INSERT TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- admins policies
DROP POLICY IF EXISTS admins_read_policy ON public.admins;
CREATE POLICY admins_read_policy ON public.admins
FOR SELECT TO authenticated USING (id = auth.uid());

-- blog_posts policies
DROP POLICY IF EXISTS blog_posts_read_policy ON public.blog_posts;
CREATE POLICY blog_posts_read_policy ON public.blog_posts
FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS blog_posts_insert_policy ON public.blog_posts;
CREATE POLICY blog_posts_insert_policy ON public.blog_posts
FOR INSERT TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

DROP POLICY IF EXISTS blog_posts_update_policy ON public.blog_posts;
CREATE POLICY blog_posts_update_policy ON public.blog_posts
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

DROP POLICY IF EXISTS blog_posts_delete_policy ON public.blog_posts;
CREATE POLICY blog_posts_delete_policy ON public.blog_posts
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- business_categories policies
DROP POLICY IF EXISTS business_categories_read_policy ON public.business_categories;
CREATE POLICY business_categories_read_policy ON public.business_categories
FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS business_categories_insert_policy ON public.business_categories;
CREATE POLICY business_categories_insert_policy ON public.business_categories
FOR INSERT TO authenticated WITH CHECK (TRUE); -- Assuming any authenticated user can insert, adjust if only admins

-- solar_businesses policies
DROP POLICY IF EXISTS solar_businesses_read_policy ON public.solar_businesses;
CREATE POLICY solar_businesses_read_policy ON public.solar_businesses
FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS solar_businesses_insert_policy ON public.solar_businesses;
CREATE POLICY solar_businesses_insert_policy ON public.solar_businesses
FOR INSERT TO authenticated WITH CHECK (TRUE); -- Assuming any authenticated user can insert, adjust if only admins

-- Note: If you have other operations (UPDATE, DELETE) for business_categories or solar_businesses,
-- you'll need to add policies for those as well, likely checking for admin status.
