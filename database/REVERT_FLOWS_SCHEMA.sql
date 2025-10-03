-- ============================================================================
-- REVERT FLOWS TABLE SCHEMA CHANGES
-- Run this to revert back to original schema
-- ============================================================================

-- Drop indexes that were added
DROP INDEX IF EXISTS idx_flows_tags;
DROP INDEX IF EXISTS idx_flows_technologies;
DROP INDEX IF EXISTS idx_flows_status;
DROP INDEX IF EXISTS idx_flows_category;
DROP INDEX IF EXISTS idx_flows_complexity;
DROP INDEX IF EXISTS idx_flows_created_at;

-- Drop the trigger (but keep the function as it's used by other tables)
DROP TRIGGER IF EXISTS update_flows_updated_at ON flows;

-- NOTE: We keep the update_updated_at_column() function because it's used by:
-- - profiles table
-- - demo_bookings table  
-- - user_preferences table

-- Remove columns that were added
ALTER TABLE flows 
DROP COLUMN IF EXISTS tags;

ALTER TABLE flows 
DROP COLUMN IF EXISTS featured;

ALTER TABLE flows 
DROP COLUMN IF EXISTS views;

-- Rename flow_diagram back to flow_data
ALTER TABLE flows 
RENAME COLUMN flow_diagram TO flow_data;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'flows' 
ORDER BY ordinal_position;

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Flows table schema reverted successfully!';
  RAISE NOTICE '✅ Removed: tags, featured, views columns';
  RAISE NOTICE '✅ Renamed: flow_diagram → flow_data';
  RAISE NOTICE '✅ Dropped: All performance indexes';
  RAISE NOTICE '✅ Dropped: Auto-update trigger';
END $$;
