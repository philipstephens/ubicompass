// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taxationRoutes = require('./routes/taxation');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Extremely permissive CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});
app.use(express.json());

// Import database connection from db.js
const { pool } = require('./db');

// Test database connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Simple test endpoint
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Backend server is running correctly' });
});

// Use taxation routes
console.log('Registering taxation routes...');
app.use('/api/taxation', taxationRoutes);
console.log('Taxation routes registered');

// API Routes
app.get('/api/year-meta-data', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM YearMetaData ORDER BY TaxYear DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/year-meta-data/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const result = await pool.query('SELECT * FROM YearMetaData WHERE TaxYear = $1', [year]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Year not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tax-entries/:ubiId', async (req, res) => {
  try {
    const ubiId = parseInt(req.params.ubiId);
    const result = await pool.query(
      'SELECT * FROM TaxEntries WHERE UBIId = $1 ORDER BY Quintile',
      [ubiId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new year data
app.post('/api/year-meta-data', async (req, res) => {
  try {
    const { taxYear, ubiAmount, taxPayersPerQuintile, flatTaxPercentage } = req.body;

    // Validate input
    if (!taxYear || !ubiAmount || !taxPayersPerQuintile || !flatTaxPercentage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO YearMetaData (TaxYear, UBIAmount, TaxPayersPerQuintile, FlatTaxPercentage) VALUES ($1, $2, $3, $4) RETURNING *',
      [taxYear, ubiAmount, taxPayersPerQuintile, flatTaxPercentage]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new tax entry
app.post('/api/tax-entries', async (req, res) => {
  try {
    const { quintile, averageTaxableIncome, medianTax, ubiId } = req.body;

    // Validate input
    if (!quintile || !averageTaxableIncome || medianTax === undefined || !ubiId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO TaxEntries (Quintile, AverageTaxableIncome, MedianTax, UBIId) VALUES ($1, $2, $3, $4) RETURNING *',
      [quintile, averageTaxableIncome, medianTax, ubiId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
