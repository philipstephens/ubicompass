/**
 * Statistics Service for Qwik UBI Compass
 * Provides access to Statistics Canada data with database support
 */
import { server$ } from '@builder.io/qwik-city';
import { getPopulationByAge, isDbAvailable } from '~/lib/db';

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
  console.log(`📊 Getting population data for year ${year}, DB available: ${isDbAvailable}`);

  // Get population by age array from database (with fallback)
  const populationByAge = await getPopulationByAge(year);

  // Calculate population distribution from age array
  let childPop = 0;
  let youthPop = 0;
  let adultPop = 0;
  let seniorPop = 0;

  // Sum population by age ranges (ages 1-100, array is 0-indexed)
  for (let age = 1; age <= 100; age++) {
    const population = populationByAge[age - 1] || 0;

    if (age <= childAgeCutoff) {
      childPop += population;
    } else if (age <= youthAgeCutoff) {
      youthPop += population;
    } else if (age >= seniorAgeCutoff) {
      seniorPop += population;
    } else {
      adultPop += population;
    }
  }

  const totalPop = childPop + youthPop + adultPop + seniorPop;

  return {
    totalPopulation: totalPop,
    childPopulation: childPop,
    youthPopulation: youthPop,
    adultPopulation: adultPop,
    seniorPopulation: seniorPop
  };
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
