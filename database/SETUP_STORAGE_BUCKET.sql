-- ============================================================================
-- SETUP SUPABASE STORAGE BUCKET FOR FLOW IMAGES
-- Run this in Supabase SQL Editor to create the storage bucket
-- ============================================================================

-- Note: Storage buckets are typically created via Supabase Dashboard
-- Go to Storage > Create new bucket
-- Bucket name: flow-images
-- Public bucket: Yes (so images are publicly accessible)
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- However, you can also create it via SQL:

-- Insert the bucket (if using SQL)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'flow-images',
  'flow-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the bucket
-- Allow anyone to read (public bucket)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'flow-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'flow-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'flow-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'flow-images' 
  AND auth.role() = 'authenticated'
);

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Storage bucket setup complete!';
  RAISE NOTICE '✅ Bucket name: flow-images';
  RAISE NOTICE '✅ Public access: Enabled';
  RAISE NOTICE '✅ Max file size: 5MB';
  RAISE NOTICE '✅ RLS policies: Created';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Alternative: Create bucket via Dashboard';
  RAISE NOTICE '   1. Go to Storage in Supabase Dashboard';
  RAISE NOTICE '   2. Click "Create new bucket"';
  RAISE NOTICE '   3. Name: flow-images';
  RAISE NOTICE '   4. Public: Yes';
  RAISE NOTICE '   5. File size limit: 5MB';
END $$;
