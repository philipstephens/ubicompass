"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const cors_1 = __importDefault(require("cors"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Database connection
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});
// Test database connection
pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    }
    else {
        console.log('Database connected successfully');
    }
});
// API Routes
app.get('/api/year-meta-data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM YearMetaData ORDER BY TaxYear DESC');
        res.json(result.rows);
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/tax-entries/:ubiId', async (req, res) => {
    try {
        const ubiId = parseInt(req.params.ubiId);
        const result = await pool.query('SELECT * FROM TaxEntries WHERE UBIId = $1 ORDER BY Quintile', [ubiId]);
        res.json(result.rows);
    }
    catch (error) {
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
        const result = await pool.query('INSERT INTO YearMetaData (TaxYear, UBIAmount, TaxPayersPerQuintile, FlatTaxPercentage) VALUES ($1, $2, $3, $4) RETURNING *', [taxYear, ubiAmount, taxPayersPerQuintile, flatTaxPercentage]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
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
        const result = await pool.query('INSERT INTO TaxEntries (Quintile, AverageTaxableIncome, MedianTax, UBIId) VALUES ($1, $2, $3, $4) RETURNING *', [quintile, averageTaxableIncome, medianTax, ubiId]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Start server
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
