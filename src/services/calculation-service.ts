/**
 * Core UBI calculation service
 * Handles all mathematical calculations for UBI feasibility analysis
 */

export interface UBIParameters {
  year: number;
  adultUbiAmount: number;      // Annual amount
  childUbiAmount: number;      // Monthly amount
  youthUbiAmount: number;      // Monthly amount
  seniorBonus: number;         // Monthly bonus (added to adult UBI)
  childAgeCutoff: number;      // Age when child UBI stops
  adultAgeCutoff: number;      // Age when adult UBI starts
  seniorAgeCutoff: number;     // Age when senior bonus starts
  taxPercentage: number;       // Flat tax percentage
  exemptionAmount: number;     // Tax exemption amount
}

export interface PopulationBreakdown {
  children: number;
  youth: number;
  adults: number;
  seniors: number;
  total: number;
}

export interface UBICosts {
  childUbiCost: number;
  youthUbiCost: number;
  adultUbiCost: number;
  seniorBonusCost: number;
  grossUbiCost: number;
}

export interface TaxCalculation {
  averageIncome: number;
  totalIncomeWithUbi: number;
  taxableAmount: number;
  taxPerPerson: number;
  totalTaxRevenue: number;
}

export interface EconomicContext {
  gdp: number;
  federalExpenditure: number;
  provincialExpenditure: number;
  totalGovernmentBudget: number;
  inflationRate: number;
  averageIncome: number;
}

export interface FeasibilityResult {
  parameters: UBIParameters;
  population: PopulationBreakdown;
  costs: UBICosts;
  taxation: TaxCalculation;
  economics: EconomicContext;
  netUbiCost: number;
  gdpPercentage: number;
  budgetPercentage: number;
  feasibility: "FEASIBLE" | "CHALLENGING" | "DIFFICULT";
}

/**
 * Calculate UBI costs for all age groups
 */
export const calculateUBICosts = (
  parameters: UBIParameters,
  population: PopulationBreakdown
): UBICosts => {
  const childUbiCost = population.children * (parameters.childUbiAmount * 12);
  const youthUbiCost = population.youth * (parameters.youthUbiAmount * 12);
  const adultUbiCost = population.adults * parameters.adultUbiAmount;
  const seniorBonusCost = population.seniors * (parameters.seniorBonus * 12);
  
  // Seniors get adult UBI + senior bonus
  const seniorUbiCost = population.seniors * parameters.adultUbiAmount;
  const totalAdultUbiCost = adultUbiCost + seniorUbiCost;
  
  const grossUbiCost = childUbiCost + youthUbiCost + totalAdultUbiCost + seniorBonusCost;

  return {
    childUbiCost,
    youthUbiCost,
    adultUbiCost: totalAdultUbiCost,
    seniorBonusCost,
    grossUbiCost
  };
};

/**
 * Calculate tax revenue from UBI implementation
 */
export const calculateTaxRevenue = (
  parameters: UBIParameters,
  population: PopulationBreakdown,
  averageIncome: number
): TaxCalculation => {
  // Only adults and seniors pay taxes
  const taxpayingPopulation = population.adults + population.seniors;
  
  // Calculate total income including UBI
  const totalIncomeWithUbi = averageIncome + parameters.adultUbiAmount;
  
  // Calculate taxable amount after exemption
  const taxableAmount = Math.max(0, totalIncomeWithUbi - parameters.exemptionAmount);
  
  // Calculate tax per person
  const taxPerPerson = taxableAmount * (parameters.taxPercentage / 100);
  
  // Calculate total tax revenue
  const totalTaxRevenue = taxPerPerson * taxpayingPopulation;

  return {
    averageIncome,
    totalIncomeWithUbi,
    taxableAmount,
    taxPerPerson,
    totalTaxRevenue
  };
};

/**
 * Assess feasibility based on GDP percentage
 */
export const assessFeasibility = (gdpPercentage: number): "SURPLUS" | "FEASIBLE" | "CHALLENGING" | "DIFFICULT" => {
  if (gdpPercentage <= 0) return "SURPLUS";     // Negative or zero GDP impact means a surplus
  if (gdpPercentage < 5) return "FEASIBLE";     // 0-5% of GDP is feasible
  if (gdpPercentage < 10) return "CHALLENGING"; // 5-10% is challenging
  return "DIFFICULT";                           // >10% is difficult
};

/**
 * Main calculation function that combines all calculations
 */
export const calculateUBIFeasibility = (
  parameters: UBIParameters,
  population: PopulationBreakdown,
  economics: EconomicContext
): FeasibilityResult => {
  // Calculate UBI costs
  const costs = calculateUBICosts(parameters, population);
  
  // Calculate tax revenue
  const taxation = calculateTaxRevenue(parameters, population, economics.averageIncome);
  
  // Calculate net cost
  const netUbiCost = costs.grossUbiCost - taxation.totalTaxRevenue;
  
  // Calculate percentages
  const gdpPercentage = (netUbiCost / economics.gdp) * 100;
  const budgetPercentage = (netUbiCost / economics.totalGovernmentBudget) * 100;
  
  // Assess feasibility
  const feasibility = assessFeasibility(gdpPercentage);

  return {
    parameters,
    population,
    costs,
    taxation,
    economics,
    netUbiCost,
    gdpPercentage,
    budgetPercentage,
    feasibility
  };
};

/**
 * Format currency values for display
 */
export const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (absAmount >= 1e12) return `${sign}$${(absAmount / 1e12).toFixed(1)}T`;
  if (absAmount >= 1e9) return `${sign}$${(absAmount / 1e9).toFixed(1)}B`;
  if (absAmount >= 1e6) return `${sign}$${(absAmount / 1e6).toFixed(1)}M`;
  if (absAmount >= 1e3) return `${sign}$${(absAmount / 1e3).toFixed(1)}K`;
  return `${sign}$${absAmount.toFixed(0)}`;
};

/**
 * Format population numbers for display
 */
export const formatPopulation = (population: number): string => {
  if (population >= 1e6) return `${(population / 1e6).toFixed(1)}M`;
  if (population >= 1e3) return `${(population / 1e3).toFixed(0)}K`;
  return population.toFixed(0);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Validate UBI parameters
 */
export const validateParameters = (parameters: UBIParameters): string[] => {
  const errors: string[] = [];

  if (parameters.adultUbiAmount < 0) errors.push("Adult UBI amount must be positive");
  if (parameters.childUbiAmount < 0) errors.push("Child UBI amount must be positive");
  if (parameters.youthUbiAmount < 0) errors.push("Youth UBI amount must be positive");
  if (parameters.seniorBonus < 0) errors.push("Senior bonus must be positive");
  
  if (parameters.childAgeCutoff < 0 || parameters.childAgeCutoff > 25) {
    errors.push("Child age cutoff must be between 0 and 25");
  }
  
  if (parameters.adultAgeCutoff <= parameters.childAgeCutoff) {
    errors.push("Adult age cutoff must be greater than child age cutoff");
  }
  
  if (parameters.seniorAgeCutoff <= parameters.adultAgeCutoff) {
    errors.push("Senior age cutoff must be greater than adult age cutoff");
  }
  
  if (parameters.taxPercentage < 0 || parameters.taxPercentage > 100) {
    errors.push("Tax percentage must be between 0 and 100");
  }
  
  if (parameters.exemptionAmount < 0) {
    errors.push("Tax exemption amount must be positive");
  }

  return errors;
};

