/**
 * Test utilities and setup for UBI Compass components
 */
import { createDOM } from '@builder.io/qwik/testing';
import type { 
  UbiCompassState, 
  UbiCompassActions, 
  UbiCompassContext 
} from '../contexts/ubi-compass-context';

// Mock context for testing
export const createMockUbiCompassContext = (
  overrides: Partial<UbiCompassState> = {}
): UbiCompassContext => {
  const defaultState: UbiCompassState = {
    selectedYear: 2022,
    ageCutoffs: {
      child: 12,
      youth: 21,
      senior: 55,
    },
    ubiAmounts: {
      child: 200,
      youth: 400,
      adult: 1200,
      senior: 1500,
    },
    taxParameters: {
      flatTaxRate: 30,
      taxExemption: 15000,
    },
    populationData: {
      childPopulation: 5000000,
      youthPopulation: 3000000,
      adultPopulation: 15000000,
      seniorPopulation: 7000000,
      totalPopulation: 30000000,
    },
    governmentSpending: {
      federalTotal: 450000,
      federalSocial: 185000,
      provincialTotal: 380000,
      totalReplaceable: 95000,
    },
    replacementAnalysis: {
      totalCurrentSpending: 150000000000,
      programSavings: 50000000000,
      netUbiCost: 200000000000,
      replacementRate: 33,
    },
    results: {
      totalUbiCost: 368400000000,
      totalTaxRevenue: 150000000000,
      netCostBeforeReplacement: 218400000000,
      netCostAfterReplacement: 168400000000,
      fundingPercentage: 54.3,
      costReductionPercentage: 13.6,
      isSelfFunded: false,
    },
    isLoadingPopulation: false,
    isLoadingSpending: false,
    populationError: null,
    spendingError: null,
    ...overrides,
  };

  const mockActions: UbiCompassActions = {
    updateYear: jest.fn(),
    updateAgeCutoffs: jest.fn(),
    updateUbiAmounts: jest.fn(),
    updateTaxParameters: jest.fn(),
    updatePopulationData: jest.fn(),
    updateGovernmentSpending: jest.fn(),
    updateReplacementAnalysis: jest.fn(),
    setPopulationLoading: jest.fn(),
    setSpendingLoading: jest.fn(),
    setPopulationError: jest.fn(),
    setSpendingError: jest.fn(),
  };

  return {
    state: defaultState,
    actions: mockActions,
  };
};

// Test data factories
export const createTestPopulationData = (overrides = {}) => ({
  childPopulation: 5000000,
  youthPopulation: 3000000,
  adultPopulation: 15000000,
  seniorPopulation: 7000000,
  totalPopulation: 30000000,
  ...overrides,
});

export const createTestUbiAmounts = (overrides = {}) => ({
  child: 200,
  youth: 400,
  adult: 1200,
  senior: 1500,
  ...overrides,
});

export const createTestTaxParameters = (overrides = {}) => ({
  flatTaxRate: 30,
  taxExemption: 15000,
  ...overrides,
});

export const createTestReplacementAnalysis = (overrides = {}) => ({
  totalCurrentSpending: 150000000000,
  programSavings: 50000000000,
  netUbiCost: 200000000000,
  replacementRate: 33,
  ...overrides,
});

// Helper functions for calculations
export const calculateExpectedUbiCost = (
  ubiAmounts: any,
  populationData: any
) => {
  return (
    ubiAmounts.child * populationData.childPopulation * 12 +
    ubiAmounts.youth * populationData.youthPopulation * 12 +
    ubiAmounts.adult * populationData.adultPopulation * 12 +
    ubiAmounts.senior * populationData.seniorPopulation * 12
  );
};

export const calculateExpectedTaxRevenue = (
  populationData: any,
  taxParameters: any
) => {
  const avgIncomes = {
    youth: 25000,
    adult: 55000,
    senior: 35000,
  };

  const getTaxableIncome = (income: number) =>
    Math.max(0, income - taxParameters.taxExemption);
  const getTaxOwed = (income: number) =>
    getTaxableIncome(income) * (taxParameters.flatTaxRate / 100);

  return (
    populationData.youthPopulation * getTaxOwed(avgIncomes.youth) +
    populationData.adultPopulation * getTaxOwed(avgIncomes.adult) +
    populationData.seniorPopulation * getTaxOwed(avgIncomes.senior)
  );
};

// Mock service functions
export const mockGovernmentSpendingService = {
  getGovernmentSpendingSummary: jest.fn().mockResolvedValue({
    year: 2022,
    federalTotal: 450000,
    federalSocial: 185000,
    provincialTotal: 380000,
    totalReplaceable: 95000,
  }),
  getSpendingByCategory: jest.fn().mockResolvedValue([
    {
      categoryCode: 'SOCIAL',
      categoryName: 'Social Protection',
      amount: 185000,
      isReplaceable: true,
      replacementPercentage: 60,
      replaceableAmount: 111000,
    },
    {
      categoryCode: 'HEALTH',
      categoryName: 'Health',
      amount: 85000,
      isReplaceable: false,
      replacementPercentage: 0,
      replaceableAmount: 0,
    },
  ]),
  getSocialProgramsData: jest.fn().mockResolvedValue([
    {
      programCode: 'OAS',
      programName: 'Old Age Security',
      amount: 58000,
      beneficiaries: 6800000,
      averageBenefit: 8529,
      replacementScenario: 'partial',
      replacementPercentage: 50,
    },
    {
      programCode: 'CCB',
      programName: 'Canada Child Benefit',
      amount: 25000,
      beneficiaries: 3500000,
      averageBenefit: 7142,
      replacementScenario: 'partial',
      replacementPercentage: 80,
    },
  ]),
  calculateUbiReplacementAnalysis: jest.fn().mockResolvedValue({
    totalCurrentSpending: 150000000000,
    totalReplaceableSpending: 90000000000,
    programSavings: 54000000000,
    netUbiCost: 200000000000,
    replacementRate: 36,
  }),
};

// Mock statistics service
export const mockStatisticsService = {
  getPopulationData: jest.fn().mockResolvedValue({
    childPopulation: 5000000,
    youthPopulation: 3000000,
    adultPopulation: 15000000,
    seniorPopulation: 7000000,
    totalPopulation: 30000000,
  }),
};

// DOM testing utilities
export const createTestDOM = () => {
  return createDOM();
};

// Assertion helpers
export const expectNumberToBeCloseTo = (
  actual: number,
  expected: number,
  precision = 2
) => {
  expect(actual).toBeCloseTo(expected, precision);
};

export const expectCurrencyFormat = (value: string, expectedBillions: number) => {
  const match = value.match(/\$(\d+\.?\d*)B/);
  expect(match).toBeTruthy();
  if (match) {
    expect(parseFloat(match[1])).toBeCloseTo(expectedBillions, 1);
  }
};

export const expectPercentageFormat = (value: string, expectedPercent: number) => {
  const match = value.match(/(\d+\.?\d*)%/);
  expect(match).toBeTruthy();
  if (match) {
    expect(parseFloat(match[1])).toBeCloseTo(expectedPercent, 1);
  }
};
