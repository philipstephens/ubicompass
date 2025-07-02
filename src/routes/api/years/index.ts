import type { RequestHandler } from '@builder.io/qwik-city';
// Database temporarily disabled - using fallback data

export const onGet: RequestHandler = async ({ json }) => {
  try {
    console.log('API: Returning fallback available years');

    // Fallback available years
    const availableYears = [2000, 2005, 2010, 2015, 2020, 2022];
    console.log('API: Available years:', availableYears);

    json(200, {
      success: true,
      years: availableYears
    });

  } catch (error) {
    console.error('API error:', error);
    json(500, {
      error: 'Failed to fetch available years',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
