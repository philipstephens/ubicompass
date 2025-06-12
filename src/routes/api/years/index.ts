import type { RequestHandler } from '@builder.io/qwik-city';
import { getAvailableYears } from '~/lib/db';

export const onGet: RequestHandler = async ({ json }) => {
  try {
    console.log('API: Fetching available years');
    
    const availableYears = await getAvailableYears();
    console.log('API: Available years:', availableYears);
    
    json(200, {
      success: true,
      years: availableYears
    });
    
  } catch (error) {
    console.error('Database error:', error);
    json(500, { 
      error: 'Failed to fetch available years',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
