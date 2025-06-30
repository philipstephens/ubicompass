-- Create feedback table for storing user feedback with AI analysis
-- Run this in your PostgreSQL database (UBIDatabase on port 7000)

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text TEXT NOT NULL,
  original_language VARCHAR(10) NOT NULL DEFAULT 'en',
  english_text TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  page_url TEXT,
  ip_address INET,
  sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
  sentiment_label VARCHAR(20), -- positive, negative, neutral
  category VARCHAR(50), -- bug, feature, ui, performance, data, usability, general
  is_processed BOOLEAN DEFAULT FALSE,
  word_count INTEGER,
  was_translated BOOLEAN DEFAULT FALSE,
  
  -- Indexes for performance
  CONSTRAINT feedback_sentiment_score_check CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
  CONSTRAINT feedback_sentiment_label_check CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
  CONSTRAINT feedback_category_check CHECK (category IN ('bug', 'feature', 'ui', 'performance', 'data', 'data-accuracy', 'usability', 'general'))
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback (submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment_label ON feedback (sentiment_label);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback (category);
CREATE INDEX IF NOT EXISTS idx_feedback_is_processed ON feedback (is_processed);
CREATE INDEX IF NOT EXISTS idx_feedback_language ON feedback (original_language);
CREATE INDEX IF NOT EXISTS idx_feedback_was_translated ON feedback (was_translated);

-- Create a view for feedback analytics
CREATE OR REPLACE VIEW feedback_analytics AS
SELECT 
  DATE_TRUNC('day', submitted_at) as date,
  COUNT(*) as total_feedback,
  COUNT(*) FILTER (WHERE sentiment_label = 'positive') as positive_count,
  COUNT(*) FILTER (WHERE sentiment_label = 'negative') as negative_count,
  COUNT(*) FILTER (WHERE sentiment_label = 'neutral') as neutral_count,
  AVG(sentiment_score) as avg_sentiment_score,
  COUNT(*) FILTER (WHERE was_translated = true) as translated_count,
  COUNT(DISTINCT original_language) as unique_languages,
  COUNT(*) FILTER (WHERE category = 'bug') as bug_reports,
  COUNT(*) FILTER (WHERE category = 'feature') as feature_requests,
  COUNT(*) FILTER (WHERE category = 'ui') as ui_feedback,
  COUNT(*) FILTER (WHERE category = 'performance') as performance_feedback,
  COUNT(*) FILTER (WHERE category = 'data') as data_feedback,
  COUNT(*) FILTER (WHERE category = 'data-accuracy') as data_accuracy_feedback,
  COUNT(*) FILTER (WHERE category = 'usability') as usability_feedback,
  AVG(word_count) as avg_word_count
FROM feedback
GROUP BY DATE_TRUNC('day', submitted_at)
ORDER BY date DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON feedback TO your_app_user;
-- GRANT SELECT ON feedback_analytics TO your_app_user;

-- Sample queries for feedback analysis:
-- 
-- -- Recent feedback summary
-- SELECT sentiment_label, category, COUNT(*) 
-- FROM feedback 
-- WHERE submitted_at >= NOW() - INTERVAL '7 days'
-- GROUP BY sentiment_label, category
-- ORDER BY COUNT(*) DESC;
--
-- -- Most common feedback categories
-- SELECT category, COUNT(*), AVG(sentiment_score)
-- FROM feedback
-- GROUP BY category
-- ORDER BY COUNT(*) DESC;
--
-- -- Language distribution
-- SELECT original_language, COUNT(*), 
--        COUNT(*) FILTER (WHERE was_translated = true) as translated
-- FROM feedback
-- GROUP BY original_language
-- ORDER BY COUNT(*) DESC;
