/**
 * Database connection utility for UBI Compass
 * Supports both Vercel Postgres and fallback mode
 */
import { sql } from '@vercel/postgres';

// Database connection status
let isDbAvailable = false;

// Test database connection
async function testConnection() {
  try {
    if (!process.env.POSTGRES_URL) {
      console.log('📊 No POSTGRES_URL found - using fallback mode');
      return false;
    }

    await sql`SELECT 1`;
    console.log('✅ Database connection successful');
    isDbAvailable = true;
    return true;
  } catch (error) {
    console.log('❌ Database connection failed, using fallback mode:', error);
    isDbAvailable = false;
    return false;
  }
}

// Initialize connection test
testConnection();

// Types for your database schema
export interface YearStatistics {
  yearStatsId: number;
  year: number;
  taxPayers: number;
  countryId: number;
}

export interface DecileData {
  decile: number;
  upperIncomeLimit: number;
  shareOfIncome: number;
  averageIncome: number;
  yearStatsId: number;
}

export interface Metadata {
  countryID: number;
  country: string;
  referenceYear: number;
  incomeCitation: string;
  numTaxPayersCitation: string;
}

/**
 * Get decile data for a specific year
 */
export async function getDecileDataForYear(year: number, beforeTax: boolean = true) {
  if (!isDbAvailable) {
    // Return fallback decile data
    return [
      { decile: 1, upperIncomeLimit: 15000, averageIncome: 8000, shareOfIncome: 2.1, taxPayers: 2800000 },
      { decile: 2, upperIncomeLimit: 25000, averageIncome: 20000, shareOfIncome: 3.8, taxPayers: 2800000 },
      { decile: 3, upperIncomeLimit: 35000, averageIncome: 30000, shareOfIncome: 5.2, taxPayers: 2800000 },
      { decile: 4, upperIncomeLimit: 45000, averageIncome: 40000, shareOfIncome: 6.4, taxPayers: 2800000 },
      { decile: 5, upperIncomeLimit: 55000, averageIncome: 50000, shareOfIncome: 7.6, taxPayers: 2800000 },
      { decile: 6, upperIncomeLimit: 68000, averageIncome: 61500, shareOfIncome: 9.1, taxPayers: 2800000 },
      { decile: 7, upperIncomeLimit: 85000, averageIncome: 76500, shareOfIncome: 11.2, taxPayers: 2800000 },
      { decile: 8, upperIncomeLimit: 110000, averageIncome: 97500, shareOfIncome: 14.1, taxPayers: 2800000 },
      { decile: 9, upperIncomeLimit: 155000, averageIncome: 132500, shareOfIncome: 18.8, taxPayers: 2800000 },
      { decile: 10, upperIncomeLimit: 500000, averageIncome: 225000, shareOfIncome: 21.7, taxPayers: 2800000 }
    ];
  }

  try {
    // Query real database
    const result = await sql`
      SELECT
        decile,
        upper_income_limit as "upperIncomeLimit",
        average_income as "averageIncome",
        share_of_income as "shareOfIncome",
        tax_payers as "taxPayers"
      FROM income_deciles
      WHERE year = ${year} AND before_tax = ${beforeTax}
      ORDER BY decile
    `;

    return result.rows;
  } catch (error) {
    console.error('Database query failed, using fallback:', error);
    // Return fallback data on error
    return [
      { decile: 1, upperIncomeLimit: 15000, averageIncome: 8000, shareOfIncome: 2.1, taxPayers: 2800000 },
      { decile: 2, upperIncomeLimit: 25000, averageIncome: 20000, shareOfIncome: 3.8, taxPayers: 2800000 },
      { decile: 3, upperIncomeLimit: 35000, averageIncome: 30000, shareOfIncome: 5.2, taxPayers: 2800000 },
      { decile: 4, upperIncomeLimit: 45000, averageIncome: 40000, shareOfIncome: 6.4, taxPayers: 2800000 },
      { decile: 5, upperIncomeLimit: 55000, averageIncome: 50000, shareOfIncome: 7.6, taxPayers: 2800000 },
      { decile: 6, upperIncomeLimit: 68000, averageIncome: 61500, shareOfIncome: 9.1, taxPayers: 2800000 },
      { decile: 7, upperIncomeLimit: 85000, averageIncome: 76500, shareOfIncome: 11.2, taxPayers: 2800000 },
      { decile: 8, upperIncomeLimit: 110000, averageIncome: 97500, shareOfIncome: 14.1, taxPayers: 2800000 },
      { decile: 9, upperIncomeLimit: 155000, averageIncome: 132500, shareOfIncome: 18.8, taxPayers: 2800000 },
      { decile: 10, upperIncomeLimit: 500000, averageIncome: 225000, shareOfIncome: 21.7, taxPayers: 2800000 }
    ];
  }
}

/**
 * Get available years with data
 */
export async function getAvailableYears() {
  if (!isDbAvailable) {
    return [2000, 2005, 2010, 2015, 2020, 2022];
  }

  try {
    const result = await sql`
      SELECT DISTINCT year
      FROM income_deciles
      ORDER BY year DESC
    `;

    return result.rows.map(row => row.year);
  } catch (error) {
    console.error('Database query failed, using fallback years:', error);
    return [2000, 2005, 2010, 2015, 2020, 2022];
  }
}

/**
 * Get population by age for a specific year
 */
export async function getPopulationByAge(year: number): Promise<number[]> {
  if (!isDbAvailable) {
    // Return fallback population by age array (ages 1-100)
    return [
      // Ages 1-10
      355000, 365000, 377000, 390000, 402000, 407000, 410000, 417000, 419000, 421000,
      // Ages 11-20
      429000, 431000, 429000, 416000, 405000, 398000, 392000, 387000, 383000, 380000,
      // Ages 21-30
      378000, 376000, 375000, 374000, 373000, 372000, 371000, 370000, 369000, 368000,
      // Ages 31-40
      367000, 366000, 365000, 364000, 363000, 362000, 361000, 360000, 359000, 358000,
      // Ages 41-50
      357000, 356000, 355000, 354000, 353000, 352000, 351000, 350000, 349000, 348000,
      // Ages 51-60
      347000, 346000, 345000, 344000, 343000, 342000, 341000, 340000, 339000, 338000,
      // Ages 61-70
      337000, 336000, 335000, 334000, 333000, 332000, 331000, 330000, 329000, 328000,
      // Ages 71-80
      327000, 326000, 325000, 324000, 323000, 322000, 321000, 320000, 319000, 318000,
      // Ages 81-90
      317000, 316000, 315000, 314000, 313000, 312000, 311000, 310000, 309000, 308000,
      // Ages 91-100
      307000, 306000, 305000, 304000, 303000, 302000, 301000, 300000, 299000, 298000
    ];
  }

  try {
    const result = await sql`
      SELECT age, population
      FROM population_by_age
      WHERE year = ${year} AND age BETWEEN 1 AND 100
      ORDER BY age
    `;

    // Convert to array indexed by age (1-100)
    const populationArray = new Array(100).fill(0);
    result.rows.forEach(row => {
      if (row.age >= 1 && row.age <= 100) {
        populationArray[row.age - 1] = row.population;
      }
    });

    return populationArray;
  } catch (error) {
    console.error('Database query failed, using fallback population:', error);
    // Return fallback data on error
    return [
      // Ages 1-10
      355000, 365000, 377000, 390000, 402000, 407000, 410000, 417000, 419000, 421000,
      // Ages 11-20
      429000, 431000, 429000, 416000, 405000, 398000, 392000, 387000, 383000, 380000,
      // Ages 21-30
      378000, 376000, 375000, 374000, 373000, 372000, 371000, 370000, 369000, 368000,
      // Ages 31-40
      367000, 366000, 365000, 364000, 363000, 362000, 361000, 360000, 359000, 358000,
      // Ages 41-50
      357000, 356000, 355000, 354000, 353000, 352000, 351000, 350000, 349000, 348000,
      // Ages 51-60
      347000, 346000, 345000, 344000, 343000, 342000, 341000, 340000, 339000, 338000,
      // Ages 61-70
      337000, 336000, 335000, 334000, 333000, 332000, 331000, 330000, 329000, 328000,
      // Ages 71-80
      327000, 326000, 325000, 324000, 323000, 322000, 321000, 320000, 319000, 318000,
      // Ages 81-90
      317000, 316000, 315000, 314000, 313000, 312000, 311000, 310000, 309000, 308000,
      // Ages 91-100
      307000, 306000, 305000, 304000, 303000, 302000, 301000, 300000, 299000, 298000
    ];
  }
}

// Export database status for other modules
export { isDbAvailable };
