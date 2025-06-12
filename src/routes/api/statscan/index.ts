/**
 * Statistics Canada API Endpoints
 * Provides real Canadian economic data for UBI analysis
 */

import type { RequestHandler } from '@builder.io/qwik-city';

/**
 * GET /api/statscan/years
 * Returns available years with Statistics Canada data
 */
export const onGet: RequestHandler = async ({ json }) => {
  try {
    // For now, return hardcoded years based on your data coverage analysis
    const years = [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008];
    json(200, { years });
  } catch (error) {
    console.error('Statistics Canada API error:', error);
    json(500, { error: 'Internal server error' });
  }
};
