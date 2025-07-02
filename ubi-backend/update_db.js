// Script to update the database schema and add sample data
// TEMPORARILY DISABLED FOR DEPLOYMENT
require('dotenv').config();
const fs = require('fs');
const path = require('path');
// const { pool } = require('./db'); // TEMPORARILY DISABLED FOR DEPLOYMENT

async function updateDatabase() {
  console.log('Starting database update...');
  
  try {
    // Read the schema update SQL file
    const schemaUpdateSQL = fs.readFileSync(
      path.join(__dirname, 'db', 'schema_update.sql'),
      'utf8'
    );
    
    // Execute the schema update
    console.log('Updating database schema...');
    await pool.query(schemaUpdateSQL);
    console.log('Schema update completed successfully.');
    
    // Read the sample data SQL file
    const sampleDataSQL = fs.readFileSync(
      path.join(__dirname, 'db', 'sample_data.sql'),
      'utf8'
    );
    
    // Execute the sample data insert
    console.log('Inserting sample data...');
    await pool.query(sampleDataSQL);
    console.log('Sample data inserted successfully.');
    
    console.log('Database update completed successfully!');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the update
updateDatabase();
