// Database temporarily disabled for deployment
// import { Pool } from 'pg';

// Database connection pool - DISABLED
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL || 'postgresql://postgres:UBI_Compass_2024_Secure!@localhost:7000/UBIDatabase',
//   // For development
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// export { pool };

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

// Database functions temporarily disabled for deployment
// export async function getDecileDataForYear(year: number, beforeTax: boolean = true) {
//   const tableName = beforeTax ? 'yearstatsbefore' : 'yearstatsafter';
//   console.log(`Querying ${tableName} for year ${year}`);
//   const query = `...`;
//   const result = await pool.query(query, [year]);
//   return result.rows;
// }

// export async function getAvailableYears() {
//   const query = 'SELECT DISTINCT year FROM yearstatistics ORDER BY year';
//   const result = await pool.query(query);
//   return result.rows.map(row => row.year);
// }
