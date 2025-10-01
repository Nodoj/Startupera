-- ============================================================================
-- FIX: Infinite Recursion in RLS Policies
-- ============================================================================
-- This script fixes the "infinite recursion detected in policy" error
-- by removing problematic policies and creating non-recursive ones

-- Step 1: Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Step 2: Create non-recursive policies for profiles
-- These policies don't query the profiles table within themselves

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Step 3: Create a security definer function to check admin role
-- This function runs with elevated privileges and avoids recursion
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

-- Step 4: Create admin policy using the function
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE 
  USING (public.is_admin());

-- Step 5: Fix other tables that have similar issues
-- Drop and recreate flows policies
DROP POLICY IF EXISTS "Admins can manage all flows" ON flows;

CREATE POLICY "Admins can manage all flows" ON flows
  FOR ALL 
  USING (public.is_admin());

-- Drop and recreate demo_bookings policies
DROP POLICY IF EXISTS "Admins can view all demo bookings" ON demo_bookings;
DROP POLICY IF EXISTS "Admins can update demo bookings" ON demo_bookings;

CREATE POLICY "Admins can view all demo bookings" ON demo_bookings
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update demo bookings" ON demo_bookings
  FOR UPDATE 
  USING (public.is_admin());

-- Drop and recreate contact_submissions policies
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;

CREATE POLICY "Admins can view all contact submissions" ON contact_submissions
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE 
  USING (public.is_admin());

-- Drop and recreate newsletter_subscriptions policies
DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON newsletter_subscriptions;

CREATE POLICY "Admins can view all newsletter subscriptions" ON newsletter_subscriptions
  FOR SELECT 
  USING (public.is_admin());

-- Drop and recreate page_views policies
DROP POLICY IF EXISTS "Admins can view all page views" ON page_views;

CREATE POLICY "Admins can view all page views" ON page_views
  FOR SELECT 
  USING (public.is_admin());

-- Drop and recreate flow_interactions policies
DROP POLICY IF EXISTS "Admins can view all interactions" ON flow_interactions;

CREATE POLICY "Admins can view all interactions" ON flow_interactions
  FOR SELECT 
  USING (public.is_admin());

-- Step 6: Verify the fix
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles'
ORDER BY tablename, policyname;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE 'RLS policies fixed successfully! Infinite recursion issue resolved.';
END $$;
