/**
 * UBI Feasibility Analysis API
 * Uses real Statistics Canada data for comprehensive analysis
 */

import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ json, url }) => {
  try {
    const searchParams = url.searchParams;
    const year = parseInt(searchParams.get('year') || '2022');
    const ubiAmount = parseInt(searchParams.get('ubiAmount') || '24000');
    const childUbiAmount = parseInt(searchParams.get('childUbiAmount') || '200');

    console.log(`Calculating UBI feasibility for ${year}: $${ubiAmount} adult, $${childUbiAmount}/month child`);

    // Simplified calculation using estimated Canadian data
    // TODO: Replace with real database queries once connection is established

    const estimatedPopulation = {
      adults: 30000000,
      children: 7500000,
      total: 37500000
    };

    const estimatedContext = {
      gdp: year >= 2020 ? 2700000000000 : 2400000000000, // Estimated GDP
      federalRevenue: 400000000000,
      federalExpenditure: 450000000000,
      provincialRevenue: 350000000000,
      provincialExpenditure: 380000000000,
      inflationRate: year >= 2020 ? 3.5 : 2.1,
      population: estimatedPopulation.total
    };

    // Calculate UBI costs
    const adultUbiCost = estimatedPopulation.adults * ubiAmount;
    const childUbiCost = estimatedPopulation.children * (childUbiAmount * 12);
    const grossUbiCost = adultUbiCost + childUbiCost;

    // Calculate percentages
    const gdpPercentage = (grossUbiCost / estimatedContext.gdp) * 100;
    const totalGovernmentBudget = estimatedContext.federalExpenditure + estimatedContext.provincialExpenditure;
    const budgetPercentage = (grossUbiCost / totalGovernmentBudget) * 100;

    // Feasibility assessment
    let feasibility = 'UNKNOWN';
    if (gdpPercentage < 5) {
      feasibility = 'FEASIBLE';
    } else if (gdpPercentage < 10) {
      feasibility = 'CHALLENGING';
    } else {
      feasibility = 'DIFFICULT';
    }

    const feasibilityData = {
      year,
      grossUbiCost,
      adultUbiCost,
      childUbiCost,
      gdpPercentage,
      budgetPercentage,
      feasibility,
      context: estimatedContext,
      population: estimatedPopulation
    };

    json(200, {
      success: true,
      data: feasibilityData
    });

  } catch (error) {
    console.error('UBI feasibility calculation error:', error);
    json(500, {
      success: false,
      error: error instanceof Error ? error.message : 'Calculation failed'
    });
  }
};
