-- ============================================================================
-- TORAFLOW COMPLETE DATABASE SETUP
-- Run this script in Supabase SQL Editor to set up everything
-- ============================================================================

-- Step 1: Create your profile first (BEFORE enabling RLS)
-- Replace the email with your actual email
INSERT INTO profiles (id, email, role, full_name)
SELECT 
  id, 
  email, 
  'admin' as role,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)) as full_name
FROM auth.users
WHERE email = 'nodo.itspec@gmail.com'  -- CHANGE THIS TO YOUR EMAIL
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Step 2: Create the is_admin() function (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Drop ALL existing policies to start fresh
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
      r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Step 4: Create NON-RECURSIVE policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (public.is_admin());

-- Step 5: Create policies for flows
CREATE POLICY "Anyone can view published flows" ON flows
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own flows" ON flows
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authors can create flows" ON flows
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own flows" ON flows
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all flows" ON flows
  FOR ALL USING (public.is_admin());

-- Step 6: Create policies for demo_bookings
CREATE POLICY "Anyone can create demo bookings" ON demo_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all demo bookings" ON demo_bookings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update demo bookings" ON demo_bookings
  FOR UPDATE USING (public.is_admin());

-- Step 7: Create policies for contact_submissions
CREATE POLICY "Anyone can create contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions" ON contact_submissions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE USING (public.is_admin());

-- Step 8: Create policies for newsletter_subscriptions
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all newsletter subscriptions" ON newsletter_subscriptions
  FOR SELECT USING (public.is_admin());

-- Step 9: Create policies for page_views
CREATE POLICY "Anyone can create page views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all page views" ON page_views
  FOR SELECT USING (public.is_admin());

-- Step 10: Create policies for flow_interactions
CREATE POLICY "Anyone can create flow interactions" ON flow_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own interactions" ON flow_interactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all interactions" ON flow_interactions
  FOR SELECT USING (public.is_admin());

-- Step 11: Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Step 12: Verify everything is set up correctly
SELECT 
  'Profile Check' as check_type,
  email,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ Admin role set correctly'
    ELSE '❌ Role is not admin'
  END as status
FROM profiles
WHERE email = 'nodo.itspec@gmail.com';  -- CHANGE THIS TO YOUR EMAIL

-- Step 13: List all policies
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '✅ RLS policies created without recursion';
  RAISE NOTICE '✅ Admin user configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Verify your profile has admin role above';
  RAISE NOTICE '2. Sign in to your app';
  RAISE NOTICE '3. Try accessing /admin';
END $$;
