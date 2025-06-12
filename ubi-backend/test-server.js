// test-server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8001;

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

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test server is running correctly' });
});

// Start server
app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
});
