import { createContextId } from "@builder.io/qwik";

// Define the constraints interface
export interface OptimizationConstraints {
  maxTaxRate: number;
  maxGdpPercentage: number;
  minAdultUbi: number;
  maxAdultUbi: number;
  minChildUbi: number;
  maxChildUbi: number;
  isOptimizationEnabled: boolean;
}

// Create a context ID for the constraints
export const ConstraintsContext = createContextId<OptimizationConstraints>(
  "ubi-optimization-constraints"
);

// Default constraints values
export const defaultConstraints: OptimizationConstraints = {
  maxTaxRate: 40,
  maxGdpPercentage: 10,
  minAdultUbi: 12000,
  maxAdultUbi: 36000,
  minChildUbi: 200,
  maxChildUbi: 1000,
  isOptimizationEnabled: false
};