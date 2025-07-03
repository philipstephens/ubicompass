/**
 * Statistics Service for Qwik UBI Compass
 * Provides access to Statistics Canada data with database support
 */
import { server$ } from '@builder.io/qwik-city';
import { getPopulationByAge, isDbAvailable } from '~/lib/db';

// Population data interface with arrays for ages
export interface PopulationData {
  year: number;
  total: number;
  ages: number[];  // Array of 101 elements (ages 0-100)
  // Simplified age distribution for calculations
  children: number;    // 0-17
  youth: number;       // 18-24
  adults: number;      // 25-64
  seniors: number;     // 65+
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
  childAgeCutoff: number = 17,  // Updated to match new interface (0-17)
  youthAgeCutoff: number = 24,  // Updated to match new interface (18-24)
  seniorAgeCutoff: number = 65  // Updated to match new interface (65+)
): Promise<PopulationData> => {
  console.log(`📊 Getting population data for year ${year}, DB available: ${isDbAvailable}`);

  // Get population by age array from database (with fallback)
  const populationByAge = await getPopulationByAge(year);

  // Ensure we have a complete array (ages 0-100)
  const completeAges = new Array(101).fill(0);
  for (let i = 0; i < Math.min(populationByAge.length, 101); i++) {
    completeAges[i] = populationByAge[i] || 0;
  }

  // Calculate population distribution from age array
  let childPop = 0;   // 0-17
  let youthPop = 0;   // 18-24
  let adultPop = 0;   // 25-64
  let seniorPop = 0;  // 65+

  // Sum population by age ranges (ages 0-100)
  for (let age = 0; age <= 100; age++) {
    const population = completeAges[age] || 0;

    if (age <= 17) {
      childPop += population;
    } else if (age <= 24) {
      youthPop += population;
    } else if (age <= 64) {
      adultPop += population;
    } else {
      seniorPop += population;
    }
  }

  const totalPop = childPop + youthPop + adultPop + seniorPop;

  return {
    year: year,
    total: totalPop,
    ages: completeAges,
    children: childPop,
    youth: youthPop,
    adults: adultPop,
    seniors: seniorPop
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
