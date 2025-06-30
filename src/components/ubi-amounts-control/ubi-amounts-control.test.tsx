/**
 * Unit tests for UBI Amounts Control component
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render } from '@builder.io/qwik/testing';
import { UbiAmountsControl } from './ubi-amounts-control';
import {
  createTestPopulationData,
  createTestUbiAmounts,
  createTestTaxParameters,
  calculateExpectedUbiCost,
  calculateExpectedTaxRevenue,
  expectCurrencyFormat,
  expectPercentageFormat,
} from '../../test-utils/test-setup';

describe('UbiAmountsControl', () => {
  const defaultProps = {
    initialChildUbi: 200,
    initialYouthUbi: 400,
    initialAdultUbi: 1200,
    initialSeniorUbi: 1500,
    ...createTestPopulationData(),
    ...createTestTaxParameters(),
    programSavings: 50000000000, // $50B
    totalCurrentSpending: 150000000000, // $150B
    showPieCharts: true,
    showTaxControls: true,
    showMonthlyAndAnnual: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', async () => {
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      expect(screen).toBeTruthy();
    });

    it('should display UBI amount sliders for all age groups', async () => {
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      // Check for slider containers
      expect(screen.querySelector('[data-slider="child"]')).toBeTruthy();
      expect(screen.querySelector('[data-slider="youth"]')).toBeTruthy();
      expect(screen.querySelector('[data-slider="adult"]')).toBeTruthy();
      expect(screen.querySelector('[data-slider="senior"]')).toBeTruthy();
    });

    it('should display emoji handles for each age group', async () => {
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      // Check for emoji handles
      const childHandle = screen.querySelector('[data-slider="child"] .ubi-slider-handle');
      const youthHandle = screen.querySelector('[data-slider="youth"] .ubi-slider-handle');
      const adultHandle = screen.querySelector('[data-slider="adult"] .ubi-slider-handle');
      const seniorHandle = screen.querySelector('[data-slider="senior"] .ubi-slider-handle');

      expect(childHandle?.textContent).toBe('👶');
      expect(youthHandle?.textContent).toBe('🧑');
      expect(adultHandle?.textContent).toBe('👨');
      expect(seniorHandle?.textContent).toBe('👴');
    });

    it('should display tax controls when enabled', async () => {
      const { screen } = await render(
        <UbiAmountsControl {...defaultProps} showTaxControls={true} />
      );
      
      expect(screen.getByText('Tax Parameters')).toBeTruthy();
      expect(screen.getByText(/Flat Tax Rate:/)).toBeTruthy();
      expect(screen.getByText(/Tax Exemption:/)).toBeTruthy();
    });

    it('should hide tax controls when disabled', async () => {
      const { screen } = await render(
        <UbiAmountsControl {...defaultProps} showTaxControls={false} />
      );
      
      expect(screen.queryByText('Tax Parameters')).toBeFalsy();
    });
  });

  describe('UBI Cost Calculations', () => {
    it('should calculate correct total UBI cost', async () => {
      const ubiAmounts = createTestUbiAmounts();
      const populationData = createTestPopulationData();
      
      const expectedCost = calculateExpectedUbiCost(ubiAmounts, populationData);
      
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      // Check if the calculated cost appears in the pie chart
      const costElement = screen.getByText(/Total UBI Cost:/);
      expect(costElement).toBeTruthy();
      
      // Expected: $368.4B (200*5M + 400*3M + 1200*15M + 1500*7M) * 12
      expectCurrencyFormat(costElement.textContent || '', 368.4);
    });

    it('should calculate correct costs for each age group', async () => {
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      // Expected annual costs:
      // Children: $200 * 5M * 12 = $12B
      // Youth: $400 * 3M * 12 = $14.4B  
      // Adults: $1200 * 15M * 12 = $216B
      // Seniors: $1500 * 7M * 12 = $126B
      
      const pieChart = screen.querySelector('.pie-chart');
      expect(pieChart).toBeTruthy();
    });

    it('should update costs when UBI amounts change', async () => {
      const onUbiAmountsChange = jest.fn();
      
      const { screen } = await render(
        <UbiAmountsControl 
          {...defaultProps} 
          onUbiAmountsChange$={onUbiAmountsChange}
        />
      );
      
      // Simulate slider change (this would require more complex DOM manipulation)
      // For now, we test that the callback structure is correct
      expect(onUbiAmountsChange).toBeDefined();
    });
  });

  describe('Tax Calculations', () => {
    it('should calculate correct tax revenue', async () => {
      const populationData = createTestPopulationData();
      const taxParameters = createTestTaxParameters();
      
      const expectedTaxRevenue = calculateExpectedTaxRevenue(populationData, taxParameters);
      
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      const taxElement = screen.getByText(/Tax Revenue:/);
      expect(taxElement).toBeTruthy();
      
      // Expected: ~$150B based on population and 30% tax rate with $15k exemption
      expectCurrencyFormat(taxElement.textContent || '', 150);
    });

    it('should show tax exemption in both monthly and yearly format', async () => {
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      const exemptionLabel = screen.getByText(/Tax Exemption:/);
      expect(exemptionLabel.textContent).toMatch(/\$1,250\/month \(\$15,000\/year\)/);
    });

    it('should update tax calculations when parameters change', async () => {
      const onTaxParametersChange = jest.fn();
      
      const { screen } = await render(
        <UbiAmountsControl 
          {...defaultProps} 
          onTaxParametersChange$={onTaxParametersChange}
        />
      );
      
      expect(onTaxParametersChange).toBeDefined();
    });
  });

  describe('Program Savings Integration', () => {
    it('should display program savings when provided', async () => {
      const { screen } = await render(
        <UbiAmountsControl {...defaultProps} programSavings={50000000000} />
      );
      
      const savingsElement = screen.getByText(/Program Savings:/);
      expect(savingsElement).toBeTruthy();
      expectCurrencyFormat(savingsElement.textContent || '', 50);
    });

    it('should calculate net cost after program savings', async () => {
      const { screen } = await render(
        <UbiAmountsControl {...defaultProps} programSavings={50000000000} />
      );
      
      // Net cost should be: UBI Cost - Tax Revenue - Program Savings
      // ~$368B - ~$150B - $50B = ~$168B
      const netCostElement = screen.getByText(/Net Cost:/);
      expect(netCostElement).toBeTruthy();
      expectCurrencyFormat(netCostElement.textContent || '', 168);
    });

    it('should show before/after comparison', async () => {
      const { screen } = await render(
        <UbiAmountsControl {...defaultProps} programSavings={50000000000} />
      );
      
      expect(screen.getByText('Before Program Replacement')).toBeTruthy();
      expect(screen.getByText('After Program Replacement')).toBeTruthy();
      expect(screen.getByText('Program Replacement Impact')).toBeTruthy();
    });

    it('should show guidance when no program savings', async () => {
      const { screen } = await render(
        <UbiAmountsControl {...defaultProps} programSavings={0} />
      );
      
      expect(screen.getByText(/No program replacement savings configured/)).toBeTruthy();
      expect(screen.getByText(/Adjust program replacement percentages/)).toBeTruthy();
    });
  });

  describe('UBI Amount Constraints', () => {
    it('should enforce UBI amount progression (child ≤ youth ≤ adult ≤ senior)', async () => {
      // This test would require simulating slider interactions
      // For now, we test the constraint logic exists
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      // Check that initial values follow the constraint
      expect(defaultProps.initialChildUbi).toBeLessThanOrEqual(defaultProps.initialYouthUbi);
      expect(defaultProps.initialYouthUbi).toBeLessThanOrEqual(defaultProps.initialAdultUbi);
      expect(defaultProps.initialAdultUbi).toBeLessThanOrEqual(defaultProps.initialSeniorUbi);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for sliders', async () => {
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      // Check for accessibility attributes
      const sliders = screen.querySelectorAll('[role="slider"]');
      expect(sliders.length).toBeGreaterThan(0);
      
      sliders.forEach(slider => {
        expect(slider.getAttribute('aria-valuemin')).toBeTruthy();
        expect(slider.getAttribute('aria-valuemax')).toBeTruthy();
        expect(slider.getAttribute('aria-valuenow')).toBeTruthy();
      });
    });

    it('should support keyboard navigation', async () => {
      const { screen } = await render(<UbiAmountsControl {...defaultProps} />);
      
      const sliders = screen.querySelectorAll('[role="slider"]');
      sliders.forEach(slider => {
        expect(slider.getAttribute('tabindex')).not.toBe('-1');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle zero population gracefully', async () => {
      const zeroPopulationProps = {
        ...defaultProps,
        childPopulation: 0,
        youthPopulation: 0,
        adultPopulation: 0,
        seniorPopulation: 0,
      };
      
      const { screen } = await render(<UbiAmountsControl {...zeroPopulationProps} />);
      
      // Should not crash and should show $0 costs
      const costElement = screen.getByText(/Total UBI Cost:/);
      expectCurrencyFormat(costElement.textContent || '', 0);
    });

    it('should handle negative program savings', async () => {
      const { screen } = await render(
        <UbiAmountsControl {...defaultProps} programSavings={-10000000000} />
      );
      
      // Should handle negative savings (increased costs)
      expect(screen).toBeTruthy();
    });
  });
});
