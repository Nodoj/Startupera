-- ============================================================================
-- UPDATE FLOWS TABLE SCHEMA
-- Run this to match the new flow builder requirements
-- ============================================================================

-- Add tags column (array of text)
ALTER TABLE flows 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Rename flow_data to flow_diagram for clarity
ALTER TABLE flows 
RENAME COLUMN flow_data TO flow_diagram;

-- Add featured flag for highlighting important flows
ALTER TABLE flows 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add views counter for analytics
ALTER TABLE flows 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create index on tags for faster filtering
CREATE INDEX IF NOT EXISTS idx_flows_tags ON flows USING GIN(tags);

-- Create index on technologies for faster filtering
CREATE INDEX IF NOT EXISTS idx_flows_technologies ON flows USING GIN(technologies);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_flows_status ON flows(status);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_flows_category ON flows(category);

-- Create index on complexity for faster filtering
CREATE INDEX IF NOT EXISTS idx_flows_complexity ON flows(complexity);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_flows_created_at ON flows(created_at DESC);

-- Update the updated_at timestamp trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for flows table
DROP TRIGGER IF EXISTS update_flows_updated_at ON flows;
CREATE TRIGGER update_flows_updated_at 
    BEFORE UPDATE ON flows 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

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
  RAISE NOTICE '✅ Flows table schema updated successfully!';
  RAISE NOTICE '✅ Added: tags column';
  RAISE NOTICE '✅ Renamed: flow_data → flow_diagram';
  RAISE NOTICE '✅ Added: featured and views columns';
  RAISE NOTICE '✅ Created: Performance indexes';
  RAISE NOTICE '✅ Created: Auto-update trigger for updated_at';
END $$;
