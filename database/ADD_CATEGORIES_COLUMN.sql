-- Add categories column to flows table for multi-select support
-- This allows flows to have multiple categories while maintaining backward compatibility

ALTER TABLE flows 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Migrate existing category data to categories array
UPDATE flows 
SET categories = ARRAY[category]
WHERE category IS NOT NULL AND categories = '{}';

-- Create index for better performance on categories queries
CREATE INDEX IF NOT EXISTS idx_flows_categories ON flows USING GIN (categories);

-- Note: We're keeping the 'category' column for backward compatibility
-- The application will use categories[0] as the primary category
