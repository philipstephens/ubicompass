// Service for fetching taxation data from the backend

import { TaxationModelData } from '../models/taxation';
import { type TaxationModel, TAXATION_MODELS, getTaxationModelData } from '../models/taxation-models';

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchTaxationModels(): Promise<TaxationModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/taxation/models`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch taxation models:', error);
    // Return empty array in case of error
    return [];
  }
}

export async function fetchTaxationModelData(modelId: number, ubiId: number): Promise<TaxationModelData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/taxation/data/${modelId}/${ubiId}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch taxation model data for model ${modelId}, UBI ID ${ubiId}:`, error);
    // Return null in case of error
    return null;
  }
}

// Mock data for testing when backend is not available
export function getMockTaxationModels(): TaxationModel[] {
  return TAXATION_MODELS.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description
  }));
}

export function getMockTaxationModelData(modelId: number, ubiId: number): TaxationModelData {
  // Use the getTaxationModelData function from our new models
  return getTaxationModelData(modelId, ubiId);
}
