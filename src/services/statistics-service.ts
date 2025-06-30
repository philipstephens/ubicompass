/**
 * Statistics Service for Qwik UBI Compass
 * Provides access to Statistics Canada data from the database
 */
import { server$ } from '@builder.io/qwik-city';
import type { Pool, PoolClient } from 'pg';

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

// Create a database connection pool (server-side only)
const createPool = server$(async () => {
  try {
    const { Pool } = await import('pg');
    return new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:UBI_Compass_2024_Secure!@localhost:7000/UBIDatabase',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      // Add connection timeout
      connectionTimeoutMillis: 5000,
    });
  } catch (error) {
    console.error('Failed to create database pool:', error);
    throw new Error('Database connection failed');
  }
});

/**
 * Get available years with complete data
 */
export const getAvailableYears = server$(async (): Promise<number[]> => {
  let pool: Pool | null = null;
  let client: PoolClient | null = null;
  
  try {
    pool = await createPool();
    client = await pool.connect();
    
    // Query years with population data
    const result = await client.query(`
      SELECT DISTINCT year 
      FROM year_stats 
      WHERE id IN (SELECT DISTINCT "yearstatsid" FROM populations)
      ORDER BY year
    `);
    
    if (result.rows.length > 0) {
      return result.rows.map(row => row.year);
    }
    
    // If no data found, return fallback years
    console.log('No years found in database, using fallback years');
    return [2000, 2005, 2010, 2015, 2020, 2022];
  } catch (error) {
    console.error('Error fetching available years:', error);
    // Return fallback years
    return [2000, 2005, 2010, 2015, 2020, 2022];
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error ending pool:', e);
      }
    }
  }
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
  // Fallback data based on Canadian demographics
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
  
  let pool: Pool | null = null;
  let client: PoolClient | null = null;
  
  try {
    pool = await createPool();
    client = await pool.connect();
    
    // Get year stats ID
    const yearResult = await client.query(
      'SELECT id FROM year_stats WHERE year = $1',
      [year]
    );
    
    if (yearResult.rows.length === 0) {
      console.log(`No data available for year ${year}, using fallback data`);
      return fallbackData;
    }
    
    const yearStatsId = yearResult.rows[0].id;
    
    // Get population data by age
    const populationResult = await client.query(
      'SELECT age, population FROM populations WHERE "yearstatsid" = $1',
      [yearStatsId]
    );
    
    if (populationResult.rows.length === 0) {
      console.log(`No population data for year ${year}, using fallback data`);
      return fallbackData;
    }
   
        // Calculate population segments
    let totalPopulation = 0;
    let childPopulation = 0;
    let youthPopulation = 0;
    let adultPopulation = 0;
    let seniorPopulation = 0;
    
    populationResult.rows.forEach(row => {
      const age = row.age;
      const population = row.population;
      
      if (age === 0) return;
    
      totalPopulation += population;
      
      if (age <= childAgeCutoff) {
        childPopulation += population;
      } else if (age <= youthAgeCutoff) {
        youthPopulation += population;
      } else if (age < seniorAgeCutoff) {
        adultPopulation += population;
      } else {
        seniorPopulation += population;
      }
    });
      
    return {
      totalPopulation,
      childPopulation,
      youthPopulation,
      adultPopulation,
      seniorPopulation
    };
  } catch (error) {
    console.error(`Error fetching population data for year ${year}:`, error);
    return fallbackData;
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error ending pool:', e);
      }
    }
  }
});
 

/**
 * Get economic data for a specific year
 */
export const getEconomicData = server$(async (year: number): Promise<EconomicData> => {
  // Fallback data based on Canadian economy
  const fallbackData = {
    gdp: 2000000000000, // $2 trillion
    federalRevenue: 350000000000, // $350 billion
    federalExpenditure: 400000000000, // $400 billion
    inflationRate: 2.0 // 2.0%
  };
  
  // Adjust fallback data based on year
  if (year <= 2005) {
    fallbackData.gdp = 1200000000000; // $1.2 trillion
    fallbackData.federalRevenue = 200000000000;
    fallbackData.federalExpenditure = 220000000000;
  } else if (year <= 2010) {
    fallbackData.gdp = 1500000000000; // $1.5 trillion
    fallbackData.federalRevenue = 250000000000;
    fallbackData.federalExpenditure = 280000000000;
  } else if (year <= 2015) {
    fallbackData.gdp = 1800000000000; // $1.8 trillion
    fallbackData.federalRevenue = 300000000000;
    fallbackData.federalExpenditure = 320000000000;
  } else if (year <= 2020) {
    fallbackData.gdp = 1900000000000; // $1.9 trillion
    fallbackData.federalRevenue = 330000000000;
    fallbackData.federalExpenditure = 360000000000;
  }
  
  // Adjust inflation based on year
  if (year >= 2021) {
    fallbackData.inflationRate = 3.4; // Higher inflation in recent years
  }
  
  let pool: Pool | null = null;
  let client: PoolClient | null = null;
  
  try {
    pool = await createPool();
    client = await pool.connect();
    
    // Get GDP data
    const gdpResult = await client.query(
      `SELECT SUM(value) as total_gdp 
       FROM gdp_data 
       WHERE year = $1 AND geography = 'Canada' AND gdp_component = 'Total GDP'`,
      [year]
    );
    
    // Get federal finance data
    const revenueResult = await client.query(
      `SELECT SUM(value) as total_revenue 
       FROM federal_finance 
       WHERE year = $1 AND category LIKE '%revenue%'`,
      [year]
    );
    
    const expenditureResult = await client.query(
      `SELECT SUM(value) as total_expenditure 
       FROM federal_finance 
       WHERE year = $1 AND category LIKE '%expenditure%'`,
      [year]
    );
    
    // Get inflation rate
    const inflationResult = await client.query(
      `SELECT value 
       FROM economic_indicators 
       WHERE year = $1 AND indicator = 'Inflation Rate'`,
      [year]
    );
    
    // Check if we got real data
    const hasGdpData = gdpResult.rows.length > 0 && gdpResult.rows[0].total_gdp !== null;
    const hasRevenueData = revenueResult.rows.length > 0 && revenueResult.rows[0].total_revenue !== null;
    const hasExpenditureData = expenditureResult.rows.length > 0 && expenditureResult.rows[0].total_expenditure !== null;
    const hasInflationData = inflationResult.rows.length > 0 && inflationResult.rows[0].value !== null;
    
    // If we have real data, use it; otherwise, use fallback
    return {
      gdp: hasGdpData ? gdpResult.rows[0].total_gdp : fallbackData.gdp,
      federalRevenue: hasRevenueData ? revenueResult.rows[0].total_revenue : fallbackData.federalRevenue,
      federalExpenditure: hasExpenditureData ? expenditureResult.rows[0].total_expenditure : fallbackData.federalExpenditure,
      inflationRate: hasInflationData ? inflationResult.rows[0].value : fallbackData.inflationRate
    };
  } catch (error) {
    console.error(`Error fetching economic data for year ${year}:`, error);
    return fallbackData;
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error ending pool:', e);
      }
    }
  }
});
