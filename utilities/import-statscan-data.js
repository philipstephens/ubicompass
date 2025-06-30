/**
 * UBI Compass - Statistics Canada Data Importer
 * Imports CSV data from the ubi-backend/db/statscan_data directory into PostgreSQL
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import csvParser from 'csv-parser';

const { Pool } = pg;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:UBI_Compass_2024_Secure!@localhost:7000/UBIDatabase',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Path to CSV files
const dataDir = path.join(__dirname, '..', 'ubi-backend', 'db', 'statscan_data');

// Import mappings
const importMappings = [
  {
    name: 'Population Data',
    filePattern: /income_by_age_11100239\.csv$/i,
    importFunction: importPopulationData
  },
  {
    name: 'GDP Data',
    filePattern: /gdp_canada_36100014\.csv$/i,
    importFunction: importGdpData
  },
  {
    name: 'Federal Finance',
    filePattern: /federal_finance_10100005\.csv$/i,
    importFunction: importFederalFinanceData
  },
  {
    name: 'Provincial Finance',
    filePattern: /provincial_finance_10100020\.csv$/i,
    importFunction: importProvincialFinanceData
  },
  {
    name: 'CPI/Inflation',
    filePattern: /cpi_inflation_18100005\.csv$/i,
    importFunction: importInflationData
  },
  {
    name: 'Tax Filers',
    filePattern: /tax_filers_11100008\.csv$/i,
    importFunction: importIncomeTaxData
  }
];

// Main function
async function importAllData() {
  console.log('🧭 UBI Compass - Statistics Canada Data Importer');
  console.log('='.repeat(60));
  
  try {
    // Check if data directory exists
    if (!fs.existsSync(dataDir)) {
      console.error(`❌ Data directory not found: ${dataDir}`);
      console.log('Please ensure the ubi-backend/db/statscan_data directory exists with CSV files.');
      return;
    }
    
    // Get list of CSV files
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));
    
    if (files.length === 0) {
      console.log('⚠️ No CSV files found in the data directory.');
      console.log('Please download Statistics Canada data files first.');
      return;
    }
    
    console.log(`📊 Found ${files.length} CSV files to process.`);
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      
      // Find matching import mapping
      const mapping = importMappings.find(m => m.filePattern.test(file));
      
      if (mapping) {
        console.log(`\n📄 Processing ${mapping.name}: ${file}`);
        await mapping.importFunction(filePath);
      } else {
        console.log(`⚠️ No import mapping found for: ${file}`);
      }
    }
    
    console.log('\n✅ Data import completed!');
    
  } catch (error) {
    console.error('❌ Error during data import:', error);
  } finally {
    // Close pool
    await pool.end();
  }
}

// Import population data
async function importPopulationData(filePath) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const rows = [];
    
    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Extract year, age, and population
          if (row.REF_DATE && row.Age && row.VALUE) {
            const year = parseInt(row.REF_DATE);
            const age = row.Age === 'Total, all ages' ? 0 : parseInt(row.Age);
            const population = parseInt(row.VALUE);
            
            if (!isNaN(year) && !isNaN(age) && !isNaN(population)) {
              rows.push({ year, age, population });
            }
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} population records`);
    
    // Insert data
    let inserted = 0;
    for (const row of rows) {
      // Get yearStatsId
      const yearResult = await client.query(
        'SELECT id FROM year_stats WHERE year = $1',
        [row.year]
      );
      
      if (yearResult.rows.length > 0) {
        const yearStatsId = yearResult.rows[0].id;
        
        // Insert population data
        await client.query(
          `INSERT INTO populations ("yearStatsId", age, population)
           VALUES ($1, $2, $3)
           ON CONFLICT ("yearStatsId", age, sex) DO UPDATE
           SET population = $3`,
          [yearStatsId, row.age, row.population]
        );
        
        inserted++;
      }
    }
    
    await client.query('COMMIT');
    console.log(`✅ Inserted ${inserted} population records`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importing population data:', error);
  } finally {
    client.release();
  }
}

// Import GDP data
async function importGdpData(filePath) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const rows = [];
    
    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Extract year, geography, component, and value
          if (row.REF_DATE && row.GEO && row.VALUE) {
            const year = parseInt(row.REF_DATE);
            const geography = row.GEO;
            const gdpComponent = row.North_American_Industry_Classification_System_NAICS || 'Total GDP';
            const value = parseFloat(row.VALUE);
            
            if (!isNaN(year) && !isNaN(value)) {
              rows.push({ year, geography, gdpComponent, value });
            }
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} GDP records`);
    
    // Insert data
    let inserted = 0;
    for (const row of rows) {
      // Insert GDP data
      await client.query(
        `INSERT INTO gdp_data (year, geography, gdp_component, value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (year, geography, gdp_component) DO UPDATE
         SET value = $4`,
        [row.year, row.geography, row.gdpComponent, row.value]
      );
      
      inserted++;
    }
    
    await client.query('COMMIT');
    console.log(`✅ Inserted ${inserted} GDP records`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importing GDP data:', error);
  } finally {
    client.release();
  }
}

// Import federal finance data
async function importFederalFinanceData(filePath) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const rows = [];
    
    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Extract year, category, and value
          if (row.REF_DATE && row.Financial_flows && row.VALUE) {
            const year = parseInt(row.REF_DATE);
            const category = row.Financial_flows;
            const value = parseFloat(row.VALUE);
            
            if (!isNaN(year) && !isNaN(value)) {
              rows.push({ year, category, value });
            }
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} federal finance records`);
    
    // Insert data
    let inserted = 0;
    for (const row of rows) {
      // Insert federal finance data
      await client.query(
        `INSERT INTO federal_finance (year, category, value)
         VALUES ($1, $2, $3)
         ON CONFLICT (year, category) DO UPDATE
         SET value = $3`,
        [row.year, row.category, row.value]
      );
      
      inserted++;
    }
    
    await client.query('COMMIT');
    console.log(`✅ Inserted ${inserted} federal finance records`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importing federal finance data:', error);
  } finally {
    client.release();
  }
}

// Import provincial finance data
async function importProvincialFinanceData(filePath) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const rows = [];
    
    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Extract year, province, category, and value
          if (row.REF_DATE && row.GEO && row.Financial_flows && row.VALUE) {
            const year = parseInt(row.REF_DATE);
            const province = row.GEO;
            const category = row.Financial_flows;
            const value = parseFloat(row.VALUE);
            
            if (!isNaN(year) && !isNaN(value)) {
              rows.push({ year, province, category, value });
            }
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} provincial finance records`);
    
    // Insert data
    let inserted = 0;
    for (const row of rows) {
      // Insert provincial finance data
      await client.query(
        `INSERT INTO provincial_finance (year, province, category, value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (year, province, category) DO UPDATE
         SET value = $4`,
        [row.year, row.province, row.category, row.value]
      );
      
      inserted++;
    }
    
    await client.query('COMMIT');
    console.log(`✅ Inserted ${inserted} provincial finance records`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importing provincial finance data:', error);
  } finally {
    client.release();
  }
}

// Import inflation data
async function importInflationData(filePath) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const rows = [];
    
    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Extract year and inflation rate
          if (row.REF_DATE && row.Products_and_product_groups && row.VALUE) {
            const year = parseInt(row.REF_DATE);
            const indicator = row.Products_and_product_groups === 'All-items' ? 'Inflation Rate' : row.Products_and_product_groups;
            const value = parseFloat(row.VALUE);
            
            if (!isNaN(year) && !isNaN(value)) {
              rows.push({ year, indicator, value });
            }
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} inflation records`);
    
    // Insert data
    let inserted = 0;
    for (const row of rows) {
      // Insert inflation data
      await client.query(
        `INSERT INTO economic_indicators (year, indicator, value)
         VALUES ($1, $2, $3)
         ON CONFLICT (year, indicator) DO UPDATE
         SET value = $3`,
        [row.year, row.indicator, row.value]
      );
      
      inserted++;
    }
    
    await client.query('COMMIT');
    console.log(`✅ Inserted ${inserted} inflation records`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importing inflation data:', error);
  } finally {
    client.release();
  }
}

// Import income tax data
async function importIncomeTaxData(filePath) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const rows = [];
    
    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Extract year, income source, income group, sex, and value
          if (row.REF_DATE && row.Income_source && row.Income_group && row.Sex && row.VALUE) {
            const year = parseInt(row.REF_DATE);
            const incomeSource = row.Income_source;
            const incomeGroup = row.Income_group;
            const sex = row.Sex;
            const value = parseFloat(row.VALUE);
            
            if (!isNaN(year) && !isNaN(value)) {
              rows.push({ year, incomeSource, incomeGroup, sex, value });
            }
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} income distribution records`);
    
    // Insert data
    let inserted = 0;
    for (const row of rows) {
      // Insert income distribution data
      await client.query(
        `INSERT INTO income_distribution (year, income_source, income_group, sex, value)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (year, income_source, income_group, sex) DO UPDATE
         SET value = $5`,
        [row.year, row.incomeSource, row.incomeGroup, row.sex, row.value]
      );
      
      inserted++;
    }
    
    await client.query('COMMIT');
    console.log(`✅ Inserted ${inserted} income distribution records`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error importing income tax data:', error);
  } finally {
    client.release();
  }
}

