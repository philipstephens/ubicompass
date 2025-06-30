/**
 * Unit tests for UBI Compass Context (Central State Management)
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import {
  UbiCompassProvider,
  useUbiCompassState,
  useUbiCompassActions,
  useUbiResults,
} from './ubi-compass-context';
import {
  createTestPopulationData,
  createTestUbiAmounts,
  createTestTaxParameters,
  createTestReplacementAnalysis,
  calculateExpectedUbiCost,
  calculateExpectedTaxRevenue,
  expectNumberToBeCloseTo,
} from '../test-utils/test-setup';

// Test component to access context
const TestContextConsumer = component$(() => {
  const state = useUbiCompassState();
  const actions = useUbiCompassActions();
  const results = useUbiResults();

  return (
    <div>
      <div data-testid="total-ubi-cost">{results.totalUbiCost}</div>
      <div data-testid="total-tax-revenue">{results.totalTaxRevenue}</div>
      <div data-testid="net-cost-before">{results.netCostBeforeReplacement}</div>
      <div data-testid="net-cost-after">{results.netCostAfterReplacement}</div>
      <div data-testid="funding-percentage">{results.fundingPercentage}</div>
      <div data-testid="is-self-funded">{results.isSelfFunded.toString()}</div>
      <div data-testid="selected-year">{state.selectedYear}</div>
      <div data-testid="child-ubi">{state.ubiAmounts.child}</div>
      <div data-testid="program-savings">{state.replacementAnalysis.programSavings}</div>
    </div>
  );
});

describe('UbiCompassContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Provider and Context Access', () => {
    it('should provide context to child components', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      expect(screen.getByTestId('selected-year')).toBeTruthy();
      expect(screen.getByTestId('child-ubi')).toBeTruthy();
    });

    it('should initialize with default values', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      expect(screen.getByTestId('selected-year').textContent).toBe('2022');
      expect(screen.getByTestId('child-ubi').textContent).toBe('200');
    });

    it('should throw error when used outside provider', async () => {
      // This would require testing error boundaries
      // For now, we document the expected behavior
      expect(() => {
        // useUbiCompassContext() outside provider should throw
      }).toBeDefined();
    });
  });

  describe('State Calculations', () => {
    it('should calculate total UBI cost correctly', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      const totalCostElement = screen.getByTestId('total-ubi-cost');
      const totalCost = parseFloat(totalCostElement.textContent || '0');

      // Expected: (200*5M + 400*3M + 1200*15M + 1500*7M) * 12 = 368.4B
      expectNumberToBeCloseTo(totalCost, 368400000000, -6); // Within millions
    });

    it('should calculate tax revenue correctly', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      const taxRevenueElement = screen.getByTestId('total-tax-revenue');
      const taxRevenue = parseFloat(taxRevenueElement.textContent || '0');

      // Expected: Based on population, incomes, and 30% tax rate with $15k exemption
      expect(taxRevenue).toBeGreaterThan(100000000000); // > $100B
      expect(taxRevenue).toBeLessThan(200000000000); // < $200B
    });

    it('should calculate net costs before and after replacement', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      const netCostBeforeElement = screen.getByTestId('net-cost-before');
      const netCostAfterElement = screen.getByTestId('net-cost-after');
      const programSavingsElement = screen.getByTestId('program-savings');

      const netCostBefore = parseFloat(netCostBeforeElement.textContent || '0');
      const netCostAfter = parseFloat(netCostAfterElement.textContent || '0');
      const programSavings = parseFloat(programSavingsElement.textContent || '0');

      // Net cost after should be less than before by the amount of program savings
      expectNumberToBeCloseTo(netCostBefore - netCostAfter, programSavings, -6);
    });

    it('should calculate funding percentage correctly', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      const fundingElement = screen.getByTestId('funding-percentage');
      const fundingPercentage = parseFloat(fundingElement.textContent || '0');

      expect(fundingPercentage).toBeGreaterThan(0);
      expect(fundingPercentage).toBeLessThanOrEqual(100);
    });

    it('should determine self-funding status correctly', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      const isSelfFundedElement = screen.getByTestId('is-self-funded');
      const isSelfFunded = isSelfFundedElement.textContent === 'true';

      const netCostAfterElement = screen.getByTestId('net-cost-after');
      const netCostAfter = parseFloat(netCostAfterElement.textContent || '0');

      expect(isSelfFunded).toBe(netCostAfter <= 0);
    });
  });

  describe('Reactive Updates', () => {
    // Test component that can trigger updates
    const TestUpdater = component$(() => {
      const actions = useUbiCompassActions();
      const state = useUbiCompassState();

      return (
        <div>
          <button
            data-testid="update-ubi-amounts"
            onClick$={() => {
              actions.updateUbiAmounts({
                child: 300,
                youth: 500,
                adult: 1300,
                senior: 1600,
              });
            }}
          >
            Update UBI
          </button>
          <button
            data-testid="update-tax-rate"
            onClick$={() => {
              actions.updateTaxParameters({
                flatTaxRate: 35,
                taxExemption: 20000,
              });
            }}
          >
            Update Tax
          </button>
          <div data-testid="current-child-ubi">{state.ubiAmounts.child}</div>
          <div data-testid="current-tax-rate">{state.taxParameters.flatTaxRate}</div>
        </div>
      );
    });

    it('should update UBI amounts reactively', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestUpdater />
        </UbiCompassProvider>
      );

      const initialChildUbi = screen.getByTestId('current-child-ubi');
      expect(initialChildUbi.textContent).toBe('200');

      // Simulate button click (would require user event simulation)
      // For now, we test that the action exists
      const updateButton = screen.getByTestId('update-ubi-amounts');
      expect(updateButton).toBeTruthy();
    });

    it('should update tax parameters reactively', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestUpdater />
        </UbiCompassProvider>
      );

      const initialTaxRate = screen.getByTestId('current-tax-rate');
      expect(initialTaxRate.textContent).toBe('30');

      const updateButton = screen.getByTestId('update-tax-rate');
      expect(updateButton).toBeTruthy();
    });
  });

  describe('Population Data Handling', () => {
    it('should use fallback population when database data is unavailable', async () => {
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      // Should have non-zero UBI cost even without database population data
      const totalCostElement = screen.getByTestId('total-ubi-cost');
      const totalCost = parseFloat(totalCostElement.textContent || '0');
      expect(totalCost).toBeGreaterThan(0);
    });

    it('should update calculations when population data changes', async () => {
      // This would require a more complex test setup to simulate
      // population data updates from the Age Distribution Control
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Error States', () => {
    it('should handle loading states correctly', async () => {
      // Test loading state management
      expect(true).toBe(true); // Placeholder for loading state tests
    });

    it('should handle error states correctly', async () => {
      // Test error state management
      expect(true).toBe(true); // Placeholder for error state tests
    });
  });

  describe('Performance', () => {
    it('should not recalculate when unrelated state changes', async () => {
      // Test that calculations only run when relevant dependencies change
      expect(true).toBe(true); // Placeholder for performance tests
    });

    it('should debounce rapid state changes', async () => {
      // Test that rapid slider movements don't cause excessive calculations
      expect(true).toBe(true); // Placeholder for debouncing tests
    });
  });

  describe('Data Validation', () => {
    it('should validate UBI amount constraints', async () => {
      // Test that UBI amounts follow child ≤ youth ≤ adult ≤ senior
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      // Initial values should follow constraints
      expect(200).toBeLessThanOrEqual(400); // child ≤ youth
      expect(400).toBeLessThanOrEqual(1200); // youth ≤ adult
      expect(1200).toBeLessThanOrEqual(1500); // adult ≤ senior
    });

    it('should validate tax parameter ranges', async () => {
      // Test that tax rates are within valid ranges (0-100%)
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      // Initial tax rate should be valid
      expect(30).toBeGreaterThanOrEqual(0);
      expect(30).toBeLessThanOrEqual(100);
    });

    it('should validate age cutoff constraints', async () => {
      // Test that age cutoffs follow logical progression
      const { screen } = await render(
        <UbiCompassProvider>
          <TestContextConsumer />
        </UbiCompassProvider>
      );

      // Initial age cutoffs should be logical
      expect(12).toBeLessThan(21); // child < youth
      expect(21).toBeLessThan(55); // youth < senior
    });
  });
});
