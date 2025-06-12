// Models for taxation-related data

const { pool } = require('../db');

// Get all taxation models
async function getTaxationModels() {
  try {
    const result = await pool.query('SELECT * FROM TaxationModels ORDER BY model_id');
    return result.rows;
  } catch (error) {
    console.error('Error fetching taxation models:', error);
    throw error;
  }
}

// Get taxation model by ID
async function getTaxationModelById(modelId) {
  try {
    const result = await pool.query('SELECT * FROM TaxationModels WHERE model_id = $1', [modelId]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching taxation model with ID ${modelId}:`, error);
    throw error;
  }
}

// Get tax model parameters for a specific model and UBI year
async function getTaxModelParameters(modelId, ubiId) {
  try {
    const result = await pool.query(
      'SELECT * FROM TaxModelParameters WHERE model_id = $1 AND ubiid = $2',
      [modelId, ubiId]
    );
    return result.rows;
  } catch (error) {
    console.error(`Error fetching tax model parameters for model ${modelId}, UBI ID ${ubiId}:`, error);
    throw error;
  }
}

// Get tax brackets for a specific model and UBI year
async function getTaxBrackets(modelId, ubiId) {
  try {
    const result = await pool.query(
      'SELECT * FROM TaxBrackets WHERE model_id = $1 AND ubiid = $2 ORDER BY lower_bound',
      [modelId, ubiId]
    );
    return result.rows;
  } catch (error) {
    console.error(`Error fetching tax brackets for model ${modelId}, UBI ID ${ubiId}:`, error);
    throw error;
  }
}

// Get income percentiles for a specific UBI year
async function getIncomePercentiles(ubiId) {
  try {
    const result = await pool.query(
      'SELECT * FROM IncomePercentiles WHERE ubiid = $1 ORDER BY percentile',
      [ubiId]
    );
    return result.rows;
  } catch (error) {
    console.error(`Error fetching income percentiles for UBI ID ${ubiId}:`, error);
    throw error;
  }
}

// Get all data needed for a specific taxation model and UBI year
async function getTaxationModelData(modelId, ubiId) {
  try {
    // Get the model details
    const model = await getTaxationModelById(modelId);
    
    // Get the parameters
    const parameters = await getTaxModelParameters(modelId, ubiId);
    
    // Convert parameters to a more usable format
    const paramMap = {};
    parameters.forEach(param => {
      paramMap[param.parameter_name] = param.parameter_value;
    });
    
    // Get tax brackets if it's a progressive model
    let brackets = [];
    if (model.model_name === 'Progressive Tax') {
      brackets = await getTaxBrackets(modelId, ubiId);
    }
    
    // Get income percentiles if it's a bell curve model
    let percentiles = [];
    if (model.model_name === 'Bell Curve') {
      percentiles = await getIncomePercentiles(ubiId);
    }
    
    return {
      model,
      parameters: paramMap,
      brackets,
      percentiles
    };
  } catch (error) {
    console.error(`Error fetching taxation model data for model ${modelId}, UBI ID ${ubiId}:`, error);
    throw error;
  }
}

module.exports = {
  getTaxationModels,
  getTaxationModelById,
  getTaxModelParameters,
  getTaxBrackets,
  getIncomePercentiles,
  getTaxationModelData
};
