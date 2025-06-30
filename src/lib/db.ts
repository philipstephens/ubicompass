import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:UBI_Compass_2024_Secure!@localhost:7000/UBIDatabase',
  // For development
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export { pool };

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

// Helper function to get decile data for a specific year
export async function getDecileDataForYear(year: number, beforeTax: boolean = true) {
  const tableName = beforeTax ? 'yearstatsbefore' : 'yearstatsafter';

  console.log(`Querying ${tableName} for year ${year}`);

  const query = `
    SELECT
      ysb.decile,
      ysb."upperIncomeLimit",
      ysb."shareOfIncome",
      ysb."averageIncome",
      ys."taxPayers",
      ys.year
    FROM ${tableName} ysb
    JOIN yearstatistics ys ON ysb."yearStatsId" = ys."yearStatsId"
    WHERE ys.year = $1 AND ysb.decile <= 10
    ORDER BY ysb.decile
  `;

  console.log('Executing query:', query);
  console.log('With parameters:', [year]);

  const result = await pool.query(query, [year]);
  console.log('Query result:', result.rows);
  return result.rows;
}

// Helper function to get available years
export async function getAvailableYears() {
  const query = 'SELECT DISTINCT year FROM yearstatistics ORDER BY year';
  const result = await pool.query(query);
  return result.rows.map(row => row.year);
}
