/**
 * Statistics Service for Qwik UBI Compass
 * Provides access to Statistics Canada data (database temporarily disabled)
 */
import { server$ } from '@builder.io/qwik-city';

// Population data interface
export interface PopulationData {
  totalPopulation: number;
  childPopulation: number;
  youthPopulation: number;
  adultPopulation: number;
  seniorPopulation: number;
}

// Economic data interface
export interface EconomicData {
  gdp: number;
  federalRevenue: number;
  federalExpenditure: number;
  inflationRate: number;
}

/**
 * Get available years with complete data
 */
export const getAvailableYears = server$(async (): Promise<number[]> => {
  // Database temporarily disabled - return fallback years
  return [2000, 2005, 2010, 2015, 2020, 2022];
});

/**
 * Get population data for a specific year
 */
export const getPopulationData = server$(async (
  year: number,
  childAgeCutoff: number = 18,
  youthAgeCutoff: number = 24,
  seniorAgeCutoff: number = 65
): Promise<PopulationData> => {
  // Database temporarily disabled - return fallback data
  const fallbackData = {
    totalPopulation: 38000000,
    childPopulation: 7000000,
    youthPopulation: 4000000,
    adultPopulation: 20000000,
    seniorPopulation: 7000000
  };
  
  // Adjust fallback data based on year
  if (year <= 2005) {
    fallbackData.totalPopulation = 32000000;
  } else if (year <= 2010) {
    fallbackData.totalPopulation = 34000000;
  } else if (year <= 2015) {
    fallbackData.totalPopulation = 36000000;
  } else if (year <= 2020) {
    fallbackData.totalPopulation = 37500000;
  }

  return fallbackData;
});

/**
 * Get economic data for a specific year
 */
export const getEconomicData = server$(async (year: number): Promise<EconomicData> => {
  // Database temporarily disabled - return fallback data
  const fallbackData = {
    gdp: 2000000000000, // $2 trillion
    federalRevenue: 350000000000, // $350 billion
    federalExpenditure: 400000000000, // $400 billion
    inflationRate: 2.0 // 2%
  };
  
  // Adjust fallback data based on year
  if (year <= 2005) {
    fallbackData.gdp = 1200000000000; // $1.2 trillion
    fallbackData.federalRevenue = 200000000000; // $200 billion
  } else if (year <= 2010) {
    fallbackData.gdp = 1500000000000; // $1.5 trillion
    fallbackData.federalRevenue = 250000000000; // $250 billion
  } else if (year <= 2015) {
    fallbackData.gdp = 1800000000000; // $1.8 trillion
    fallbackData.federalRevenue = 300000000000; // $300 billion
  }
  
  // Adjust inflation based on year
  if (year >= 2021) {
    fallbackData.inflationRate = 3.4; // Higher inflation in recent years
  }
  
  return fallbackData;
});
