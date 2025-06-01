-- SQL script to add m4tthias@gmail.com back to the admins table

-- First, find the auth.uid() for m4tthias@gmail.com
-- You can find this in your Supabase dashboard under Authentication -> Users
-- Look for the user with email m4tthias@gmail.com and copy their ID

-- Then, insert that ID into the admins table along with the email
INSERT INTO public.admins (id, email) 
VALUES ('28552778-94e9-4b50-9362-7ff214a37478', 'm4tthias@gmail.com');
-- VALUES ('YOUR_AUTH_UID_HERE', 'm4tthias@gmail.com');
-- If you encounter permission errors due to RLS, you can temporarily disable it:
-- SET row_level_security.enabled = OFF;
-- INSERT INTO public.admins (id, email) VALUES ('YOUR_AUTH_UID_HERE', 'm4tthias@gmail.com');
-- SET row_level_security.enabled = ON;

-- After running this SQL command, both issues should be resolved:
-- 1. The unpublish/delete actions will work because the RLS policies will allow them
-- 2. The admin dashboard will persist on refresh because AdminProtectedRoute will correctly identify the user as an admin