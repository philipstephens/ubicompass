/**
 * GET /api/statscan/years
 * Returns available years with Statistics Canada data
 */

import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ json }) => {
  try {
    console.log('API: Getting available years');
    
    // Return years based on your data coverage analysis
    // These are the years where you have good data coverage
    const years = [
      2022, 2021, 2020, // Complete coverage
      2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008 // Good coverage
    ];
    
    console.log('API: Returning years:', years);
    
    json(200, { 
      success: true,
      years: years 
    });
    
  } catch (error) {
    console.error('Years API error:', error);
    json(500, { 
      success: false,
      error: 'Failed to load available years' 
    });
  }
};
