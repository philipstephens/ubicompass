/**
 * Economic Context API
 * Provides comprehensive economic data for a given year
 */

import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ json, url }) => {
  try {
    const searchParams = url.searchParams;
    const year = parseInt(searchParams.get('year') || '2022');

    console.log(`Getting economic context for ${year}`);

    // Simplified context data - TODO: Replace with real database queries
    const context = {
      year,
      gdp: year >= 2020 ? 2700000000000 : 2400000000000,
      federalRevenue: 400000000000,
      federalExpenditure: 450000000000,
      provincialRevenue: 350000000000,
      provincialExpenditure: 380000000000,
      inflationRate: year >= 2020 ? 3.5 : 2.1,
      population: 37500000
    };

    json(200, {
      success: true,
      data: context
    });

  } catch (error) {
    console.error('Economic context error:', error);
    json(500, {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get economic context'
    });
  }
};
