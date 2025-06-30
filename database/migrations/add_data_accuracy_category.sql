-- Migration to add 'data-accuracy' category to feedback table
-- Run this on your existing UBIDatabase to update the constraint

-- Drop the existing constraint
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_category_check;

-- Add the new constraint with 'data-accuracy' category
ALTER TABLE feedback ADD CONSTRAINT feedback_category_check 
  CHECK (category IN ('bug', 'feature', 'ui', 'performance', 'data', 'data-accuracy', 'usability', 'general'));

-- Verify the constraint was added (PostgreSQL 12+ compatible)
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'feedback'::regclass
  AND conname = 'feedback_category_check';

-- Test the new category (optional)
-- INSERT INTO feedback (original_text, english_text, category) 
-- VALUES ('Test data accuracy feedback', 'Test data accuracy feedback', 'data-accuracy');
