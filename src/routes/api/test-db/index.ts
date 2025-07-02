import type { RequestHandler } from '@builder.io/qwik-city';
// Database temporarily disabled - returning test response

export const onGet: RequestHandler = async ({ json }) => {
  try {
    console.log('Database test - returning fallback response');

    // Return fallback test response
    json(200, {
      success: true,
      message: 'Database temporarily disabled for deployment',
      timestamp: new Date().toISOString(),
      tables: ['fallback_mode'],
      connection: 'disabled'
    });

  } catch (error) {
    console.error('Test API error:', error);
    json(500, {
      error: 'Test API failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
