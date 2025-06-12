// simple-proxy.js
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const port = 8002;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*'
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.status(200).end();
});

// Simple proxy function
function proxyRequest(req, res, targetPath) {
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: targetPath,
    method: 'GET'
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = '';
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // Copy status code
    res.statusCode = proxyRes.statusCode;
    
    // Copy content type
    res.setHeader('Content-Type', proxyRes.headers['content-type']);
    
    proxyRes.on('data', (chunk) => {
      data += chunk;
    });
    
    proxyRes.on('end', () => {
      res.end(data);
    });
  });
  
  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Proxy error' }));
  });
  
  proxyReq.end();
}

// Year meta data endpoint
app.get('/api/year-meta-data', (req, res) => {
  proxyRequest(req, res, '/api/year-meta-data');
});

// Tax entries endpoint
app.get('/api/tax-entries/:ubiId', (req, res) => {
  proxyRequest(req, res, `/api/tax-entries/${req.params.ubiId}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Simple proxy server running on http://localhost:${port}`);
});
