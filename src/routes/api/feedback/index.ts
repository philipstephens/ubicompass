import type { RequestHandler } from "@builder.io/qwik-city";
import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  host: 'localhost',
  port: 7000,
  database: 'UBIDatabase',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'UBI_Compass_2024_Secure!',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input sanitization function
function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data URLs
    .replace(/vbscript:/gi, '') // Remove vbscript
    .trim();
}

// Rate limiting function
function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const maxRequests = 3; // Max 3 requests per minute

  const record = rateLimitStore.get(clientId);
  
  if (!record || now > record.resetTime) {
    // New window or expired window
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  record.count++;
  return true;
}

// Simple language detection function
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();

  // French indicators
  if (lowerText.includes('je ') || lowerText.includes('le ') || lowerText.includes('la ') ||
      lowerText.includes('les ') || lowerText.includes('est ') || lowerText.includes('sont ') ||
      lowerText.includes('très ') || lowerText.includes('avec ') || lowerText.includes('pour ') ||
      lowerText.includes('dans ') || lowerText.includes('sur ') || lowerText.includes('une ') ||
      lowerText.includes('des ') || lowerText.includes('cette ') || lowerText.includes('merci') ||
      lowerText.includes('bonjour') || lowerText.includes('bonsoir') || lowerText.includes('salut')) {
    return 'fr';
  }

  // Spanish indicators
  if (lowerText.includes('el ') || lowerText.includes('la ') || lowerText.includes('los ') ||
      lowerText.includes('las ') || lowerText.includes('es ') || lowerText.includes('son ') ||
      lowerText.includes('muy ') || lowerText.includes('con ') || lowerText.includes('para ') ||
      lowerText.includes('en ') || lowerText.includes('de ') || lowerText.includes('una ') ||
      lowerText.includes('esta ') || lowerText.includes('gracias') || lowerText.includes('hola') ||
      lowerText.includes('buenas')) {
    return 'es';
  }

  // German indicators
  if (lowerText.includes('der ') || lowerText.includes('die ') || lowerText.includes('das ') ||
      lowerText.includes('ist ') || lowerText.includes('sind ') || lowerText.includes('sehr ') ||
      lowerText.includes('mit ') || lowerText.includes('für ') || lowerText.includes('in ') ||
      lowerText.includes('auf ') || lowerText.includes('eine ') || lowerText.includes('einen ') ||
      lowerText.includes('danke') || lowerText.includes('hallo') || lowerText.includes('guten')) {
    return 'de';
  }

  // Default to English if no clear indicators
  return 'en';
}

// Google Translate function
async function translateToEnglish(text: string, sourceLanguage: string): Promise<string> {
  // Skip translation if already in English
  if (sourceLanguage === 'en') {
    return text;
  }

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Google Translate API key not found, storing original text');
      return text;
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: 'en',
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    console.log(`🌐 Translated feedback from ${sourceLanguage} to English`);
    return translatedText;

  } catch (error) {
    console.error('❌ Translation failed:', error);
    console.log('📝 Storing original text due to translation failure');
    return text;
  }
}

// Google Natural Language AI - Sentiment Analysis
async function analyzeGoogleSentiment(text: string): Promise<{ score: number; magnitude: number; label: string }> {
  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY; // Reuse the same API key
    if (!apiKey) {
      console.warn('⚠️ Google AI API key not found, using basic sentiment analysis');
      return analyzeBasicSentiment(text);
    }

    console.log(`🔍 Testing Google Natural Language API with key: ${apiKey.substring(0, 10)}...`);

    const response = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: {
            content: text,
            type: 'PLAIN_TEXT'
          },
          encodingType: 'UTF8'
        })
      }
    );

    console.log(`📡 Google AI Response Status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log(`❌ Google AI Error Body: ${errorBody}`);
      throw new Error(`Google AI API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    const sentiment = data.documentSentiment;

    // Convert Google's score (-1 to 1) to our label system
    let label = 'neutral';
    if (sentiment.score > 0.25) label = 'positive';
    else if (sentiment.score < -0.25) label = 'negative';

    console.log(`🤖 Google AI Sentiment: ${label} (score: ${sentiment.score}, magnitude: ${sentiment.magnitude})`);

    return {
      score: sentiment.score,
      magnitude: sentiment.magnitude,
      label: label
    };

  } catch (error) {
    console.error('❌ Google AI sentiment analysis failed:', error);
    console.log('📝 Falling back to basic sentiment analysis');
    return analyzeBasicSentiment(text);
  }
}

// Enhanced Content Classification (combines Google AI + custom rules)
async function classifyFeedback(text: string): Promise<{ categories: Array<{ name: string; confidence: number }> }> {
  // Try Google AI first, but don't fail if it's not available
  let googleCategories: Array<{ name: string; confidence: number }> = [];

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (apiKey) {
      const response = await fetch(
        `https://language.googleapis.com/v1/documents:classifyText?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document: {
              content: text,
              type: 'PLAIN_TEXT'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        googleCategories = data.categories || [];
        console.log(`🏷️ Google AI Classification: ${googleCategories.length} categories found`);
      }
    }
  } catch (error) {
    // Silently fall back to custom classification
    console.log('📝 Using custom classification (Google AI not available)');
  }

  // Custom UBI Compass-specific classification
  const customCategories = classifyUBIFeedback(text);

  // Combine Google categories with custom categories
  const allCategories = [...googleCategories, ...customCategories];

  return { categories: allCategories };
}

// Custom classification for UBI Compass feedback
function classifyUBIFeedback(text: string): Array<{ name: string; confidence: number }> {
  const lowerText = text.toLowerCase();
  const categories: Array<{ name: string; confidence: number }> = [];

  // UBI-specific categories
  if (lowerText.includes('ubi') || lowerText.includes('basic income') || lowerText.includes('amount')) {
    categories.push({ name: 'UBI/Amount Feedback', confidence: 0.9 });
  }

  if (lowerText.includes('tax') || lowerText.includes('calculation') || lowerText.includes('math')) {
    categories.push({ name: 'Tax/Calculation Feedback', confidence: 0.9 });
  }

  if (lowerText.includes('data') || lowerText.includes('accuracy') || lowerText.includes('year') || lowerText.includes('statistics')) {
    categories.push({ name: 'Data Accuracy Feedback', confidence: 0.9 });
  }

  if (lowerText.includes('color') || lowerText.includes('design') || lowerText.includes('ui') || lowerText.includes('interface') || lowerText.includes('look')) {
    categories.push({ name: 'UI/Design Feedback', confidence: 0.8 });
  }

  if (lowerText.includes('bug') || lowerText.includes('error') || lowerText.includes('broken') || lowerText.includes('not working')) {
    categories.push({ name: 'Bug Report', confidence: 0.9 });
  }

  if (lowerText.includes('feature') || lowerText.includes('add') || lowerText.includes('would like') || lowerText.includes('suggestion')) {
    categories.push({ name: 'Feature Request', confidence: 0.8 });
  }

  if (lowerText.includes('chart') || lowerText.includes('graph') || lowerText.includes('visualization')) {
    categories.push({ name: 'Chart/Visualization Feedback', confidence: 0.8 });
  }

  // Default category if nothing specific found
  if (categories.length === 0) {
    categories.push({ name: 'General Feedback', confidence: 0.5 });
  }

  return categories;
}

// Fallback: Basic sentiment analysis (original implementation)
function analyzeBasicSentiment(text: string): { score: number; magnitude: number; label: string } {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'awesome', 'fantastic', 'wonderful', 'helpful', 'useful', 'easy', 'intuitive', 'clear'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'broken', 'confusing', 'difficult', 'slow', 'bug', 'error', 'problem', 'issue', 'frustrating', 'annoying'];

  const words = text.toLowerCase().split(/\s+/);
  let score = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  // Normalize to -1 to 1 scale
  const normalizedScore = Math.max(-1, Math.min(1, score / Math.max(1, words.length / 10)));
  
  let label = 'neutral';
  if (normalizedScore > 0.2) label = 'positive';
  else if (normalizedScore < -0.2) label = 'negative';
  
  return { score: normalizedScore, magnitude: Math.abs(normalizedScore), label };
}

// Content categorization
function categorizeContent(text: string): string {
  const categories = {
    bug: ['bug', 'error', 'broken', 'crash', 'issue', 'problem', 'not working', 'fails'],
    feature: ['feature', 'add', 'suggestion', 'would like', 'could you', 'please add', 'enhancement'],
    ui: ['interface', 'design', 'layout', 'button', 'menu', 'color', 'font', 'style'],
    performance: ['slow', 'fast', 'speed', 'performance', 'loading', 'lag', 'responsive'],
    data: ['data', 'calculation', 'result', 'number', 'incorrect', 'wrong', 'accurate'],
    'data-accuracy': ['accuracy', 'historical', 'estimate', 'fallback', 'year', 'program', 'spending', 'missing', 'inaccurate', 'outdated'],
    usability: ['confusing', 'hard to use', 'difficult', 'unclear', 'user experience', 'navigation'],
    general: []
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (category === 'general') continue;
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
}

// Store feedback in database
async function storeFeedbackInDatabase(feedbackRecord: any): Promise<boolean> {
  try {
    const query = `
      INSERT INTO feedback (
        id, original_text, original_language, english_text, submitted_at,
        user_agent, page_url, ip_address, sentiment_score, sentiment_label,
        category, word_count, was_translated
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
    `;

    const values = [
      feedbackRecord.id,
      feedbackRecord.original_text,
      feedbackRecord.original_language,
      feedbackRecord.english_text,
      feedbackRecord.submitted_at,
      feedbackRecord.user_agent,
      feedbackRecord.page_url,
      feedbackRecord.ip_address,
      feedbackRecord.sentiment_score,
      feedbackRecord.sentiment_label,
      feedbackRecord.category,
      feedbackRecord.word_count,
      feedbackRecord.was_translated
    ];

    await pool.query(query, values);
    console.log('✅ Feedback stored in database successfully');
    return true;

  } catch (error) {
    console.error('❌ Database storage failed:', error);
    return false;
  }
}

export const onPost: RequestHandler = async ({ request, clientConn, send }) => {
  try {
    // Get client identifier for rate limiting
    const clientId = clientConn.ip || 'unknown';

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      send(new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait before submitting more feedback.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      ));
      return;
    }
    
    // Parse request body
    const body = await request.json();
    const { feedback, userAgent, url, language = 'en', uiLanguage = 'en' } = body;

    // Detect the actual language of the feedback text
    const detectedLanguage = detectLanguage(feedback);
    const actualLanguage = detectedLanguage !== 'en' ? detectedLanguage : language;
    
    // Input validation
    if (!feedback || typeof feedback !== 'string') {
      send(new Response(
        JSON.stringify({ error: 'Feedback is required and must be a string.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ));
      return;
    }

    if (feedback.trim().length === 0) {
      send(new Response(
        JSON.stringify({ error: 'Feedback cannot be empty.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ));
      return;
    }

    if (feedback.length > 2000) {
      send(new Response(
        JSON.stringify({ error: 'Feedback must be less than 2000 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ));
      return;
    }
    
    // Sanitize input
    const sanitizedFeedback = sanitizeInput(feedback);

    if (sanitizedFeedback.length === 0) {
      send(new Response(
        JSON.stringify({ error: 'Feedback contains only invalid characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ));
      return;
    }

    // Translate to English for consistent analysis using detected language
    const englishFeedback = await translateToEnglish(sanitizedFeedback, actualLanguage);

    // AI Analysis using Google Natural Language AI (performed on English text)
    const sentiment = await analyzeGoogleSentiment(englishFeedback);
    const classification = await classifyFeedback(englishFeedback);
    const category = categorizeContent(englishFeedback);
    
    // Create feedback record with enhanced AI analysis
    const feedbackRecord = {
      id: crypto.randomUUID(),
      original_text: sanitizedFeedback,
      original_language: actualLanguage,
      english_text: englishFeedback,
      submitted_at: new Date().toISOString(),
      user_agent: userAgent || 'unknown',
      page_url: url || 'unknown',
      ip_address: clientId,
      sentiment_score: sentiment.score,
      sentiment_magnitude: sentiment.magnitude,
      sentiment_label: sentiment.label,
      category: category,
      google_categories: classification.categories.map(cat => ({
        name: cat.name,
        confidence: cat.confidence
      })),
      is_processed: false,
      word_count: englishFeedback.split(/\s+/).length,
      was_translated: actualLanguage !== 'en',
      ai_analysis_version: 'google-nlp-v1'
    };
    
    // Store in database
    console.log('📝 FEEDBACK RECEIVED:', JSON.stringify(feedbackRecord, null, 2));

    const stored = await storeFeedbackInDatabase(feedbackRecord);
    if (!stored) {
      console.warn('⚠️ Feedback logged to console but database storage failed');
    }
    
    send(new Response(
      JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully!',
        analysis: {
          sentiment: sentiment.label,
          sentimentScore: sentiment.score,
          sentimentMagnitude: sentiment.magnitude,
          category: category,
          googleCategories: classification.categories,
          wordCount: feedbackRecord.word_count,
          wasTranslated: feedbackRecord.was_translated,
          originalLanguage: actualLanguage,
          detectedLanguage: detectedLanguage
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    ));
    
  } catch (error) {
    console.error('❌ Feedback API Error:', error);
    send(new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    ));
  }
};
