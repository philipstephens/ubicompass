-- Simple migration to add 'data-accuracy' category to feedback table
-- For PostgreSQL 12+ compatibility

-- Drop the existing constraint
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_category_check;

-- Add the new constraint with 'data-accuracy' category
ALTER TABLE feedback ADD CONSTRAINT feedback_category_check 
  CHECK (category IN ('bug', 'feature', 'ui', 'performance', 'data', 'data-accuracy', 'usability', 'general'));

-- Simple verification - this should return 1 row if successful
SELECT COUNT(*) as constraint_exists 
FROM pg_constraint 
WHERE conrelid = 'feedback'::regclass 
  AND conname = 'feedback_category_check';
