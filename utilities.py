/**
 * UBI Compass Database Initialization Script
 * Creates necessary tables for Statistics Canada data
 */
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:UBI_Compass_2024_Secure!@localhost:7000/UBIDatabase',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database initialization...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Create tables if they don't exist
    
    // Year Stats table (maps years to internal IDs)
    await client.query(`
      CREATE TABLE IF NOT EXISTS year_stats (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL UNIQUE,
        description TEXT
      )
    `);
    
    // Population data by age
    await client.query(`
      CREATE TABLE IF NOT EXISTS populations (
        id SERIAL PRIMARY KEY,
        "yearStatsId" INTEGER REFERENCES year_stats(id),
        age INTEGER NOT NULL,
        population INTEGER NOT NULL,
        sex VARCHAR(20) DEFAULT 'Both sexes',
        UNIQUE("yearStatsId", age, sex)
      )
    `);
    
    // GDP data
    await client.query(`
      CREATE TABLE IF NOT EXISTS gdp_data (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        geography VARCHAR(100) NOT NULL,
        gdp_component VARCHAR(255) NOT NULL,
        value NUMERIC(20, 2) NOT NULL,
        UNIQUE(year, geography, gdp_component)
      )
    `);
    
    // Federal finance data
    await client.query(`
      CREATE TABLE IF NOT EXISTS federal_finance (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        category VARCHAR(255) NOT NULL,
        value NUMERIC(20, 2) NOT NULL,
        UNIQUE(year, category)
      )
    `);
    
    // Provincial finance data
    await client.query(`
      CREATE TABLE IF NOT EXISTS provincial_finance (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        province VARCHAR(100) NOT NULL,
        category VARCHAR(255) NOT NULL,
        value NUMERIC(20, 2) NOT NULL,
        UNIQUE(year, province, category)
      )
    `);
    
    // Economic indicators
    await client.query(`
      CREATE TABLE IF NOT EXISTS economic_indicators (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        indicator VARCHAR(100) NOT NULL,
        value NUMERIC(20, 4) NOT NULL,
        UNIQUE(year, indicator)
      )
    `);
    
    // Income distribution
    await client.query(`
      CREATE TABLE IF NOT EXISTS income_distribution (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        income_source VARCHAR(100) NOT NULL,
        income_group VARCHAR(100) NOT NULL,
        sex VARCHAR(20) NOT NULL,
        value NUMERIC(20, 2) NOT NULL,
        UNIQUE(year, income_source, income_group, sex)
      )
    `);
    
    // Insert years from 2000 to 2023 if they don't exist
    for (let year = 2000; year <= 2023; year++) {
      await client.query(`
        INSERT INTO year_stats (year, description)
        VALUES ($1, $2)
        ON CONFLICT (year) DO NOTHING
      `, [year, `Canadian economic data for ${year}`]);
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database initialization completed successfully!');
    console.log('Tables created:');
    console.log('- year_stats');
    console.log('- populations');
    console.log('- gdp_data');
    console.log('- federal_finance');
    console.log('- provincial_finance');
    console.log('- economic_indicators');
    console.log('- income_distribution');
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    // Release client
    client.release();
  }
}

// Run initialization
initDatabase()
  .then(() => {
    console.log('Database setup complete. You can now import your Statistics Canada data.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

