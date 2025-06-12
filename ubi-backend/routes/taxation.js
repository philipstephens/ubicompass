// API routes for taxation models

const express = require('express');
const router = express.Router();
const taxationModel = require('../models/taxation');

// Get all taxation models
router.get('/models', async (req, res) => {
  try {
    const models = await taxationModel.getTaxationModels();
    res.json(models);
  } catch (error) {
    console.error('Error in GET /api/taxation/models:', error);
    res.status(500).json({ error: 'Failed to fetch taxation models' });
  }
});

// Get taxation model by ID
router.get('/models/:modelId', async (req, res) => {
  try {
    const modelId = req.params.modelId;
    const model = await taxationModel.getTaxationModelById(modelId);
    
    if (!model) {
      return res.status(404).json({ error: 'Taxation model not found' });
    }
    
    res.json(model);
  } catch (error) {
    console.error(`Error in GET /api/taxation/models/${req.params.modelId}:`, error);
    res.status(500).json({ error: 'Failed to fetch taxation model' });
  }
});

// Get tax model parameters for a specific model and UBI year
router.get('/parameters/:modelId/:ubiId', async (req, res) => {
  try {
    const { modelId, ubiId } = req.params;
    const parameters = await taxationModel.getTaxModelParameters(modelId, ubiId);
    res.json(parameters);
  } catch (error) {
    console.error(`Error in GET /api/taxation/parameters/${req.params.modelId}/${req.params.ubiId}:`, error);
    res.status(500).json({ error: 'Failed to fetch tax model parameters' });
  }
});

// Get tax brackets for a specific model and UBI year
router.get('/brackets/:modelId/:ubiId', async (req, res) => {
  try {
    const { modelId, ubiId } = req.params;
    const brackets = await taxationModel.getTaxBrackets(modelId, ubiId);
    res.json(brackets);
  } catch (error) {
    console.error(`Error in GET /api/taxation/brackets/${req.params.modelId}/${req.params.ubiId}:`, error);
    res.status(500).json({ error: 'Failed to fetch tax brackets' });
  }
});

// Get income percentiles for a specific UBI year
router.get('/percentiles/:ubiId', async (req, res) => {
  try {
    const ubiId = req.params.ubiId;
    const percentiles = await taxationModel.getIncomePercentiles(ubiId);
    res.json(percentiles);
  } catch (error) {
    console.error(`Error in GET /api/taxation/percentiles/${req.params.ubiId}:`, error);
    res.status(500).json({ error: 'Failed to fetch income percentiles' });
  }
});

// Get all data needed for a specific taxation model and UBI year
router.get('/data/:modelId/:ubiId', async (req, res) => {
  try {
    const { modelId, ubiId } = req.params;
    const data = await taxationModel.getTaxationModelData(modelId, ubiId);
    res.json(data);
  } catch (error) {
    console.error(`Error in GET /api/taxation/data/${req.params.modelId}/${req.params.ubiId}:`, error);
    res.status(500).json({ error: 'Failed to fetch taxation model data' });
  }
});

module.exports = router;
