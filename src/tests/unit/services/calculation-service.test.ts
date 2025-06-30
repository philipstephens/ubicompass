/**
 * Unit tests for calculation service
 * Tests core UBI calculation logic and feasibility assessment
 */

import { describe, it, expect } from 'vitest';
import {
  calculateUBICosts,
  calculateTaxRevenue,
  calculateUBIFeasibility,
  assessFeasibility,
  formatCurrency,
  formatPercentage,
  validateParameters,
  type UBIParameters,
  type PopulationBreakdown,
  type EconomicContext
} from '../../../services/calculation-service';

describe('Calculation Service', () => {
  // Test data
  const mockPopulation: PopulationBreakdown = {
    children: 6800000,   // 6.8M children
    youth: 2600000,      // 2.6M youth
    adults: 23800000,    // 23.8M adults
    seniors: 4800000,    // 4.8M seniors
    total: 38000000      // 38M total
  };

  const mockEconomics: EconomicContext = {
    gdp: 2740000000000,              // $2.74T GDP
    federalExpenditure: 450000000000, // $450B federal
    provincialExpenditure: 380000000000, // $380B provincial
    totalGovernmentBudget: 830000000000, // $830B total
    inflationRate: 6.8,
    averageIncome: 52000
  };

  const mockParameters: UBIParameters = {
    year: 2022,
    adultUbiAmount: 24000,    // $24k/year
    childUbiAmount: 500,      // $500/month
    youthUbiAmount: 800,      // $800/month
    seniorBonus: 300,         // $300/month
    childAgeCutoff: 17,       // Children under 18
    adultAgeCutoff: 18,       // Adults 18+
    seniorAgeCutoff: 65,      // Seniors 65+
    taxPercentage: 30,        // 30% flat tax
    exemptionAmount: 24000    // $24k exemption
  };

  describe('calculateUBICosts', () => {
    it('should calculate child UBI costs correctly', () => {
      const costs = calculateUBICosts(mockParameters, mockPopulation);
      
      // Child UBI: 6.8M children × $500/month × 12 months = $40.8B
      const expectedChildCost = 6800000 * 500 * 12;
      expect(costs.childUbiCost).toBe(expectedChildCost);
    });

    it('should calculate youth UBI costs correctly', () => {
      const costs = calculateUBICosts(mockParameters, mockPopulation);
      
      // Youth UBI: 2.6M youth × $800/month × 12 months = $24.96B
      const expectedYouthCost = 2600000 * 800 * 12;
      expect(costs.youthUbiCost).toBe(expectedYouthCost);
    });

    it('should calculate adult UBI costs correctly', () => {
      const costs = calculateUBICosts(mockParameters, mockPopulation);
      
      // Adult UBI: (23.8M adults + 4.8M seniors) × $24k/year = $684B
      const expectedAdultCost = (23800000 + 4800000) * 24000;
      expect(costs.adultUbiCost).toBe(expectedAdultCost);
    });

    it('should calculate senior bonus costs correctly', () => {
      const costs = calculateUBICosts(mockParameters, mockPopulation);
      
      // Senior bonus: 4.8M seniors × $300/month × 12 months = $17.28B
      const expectedSeniorBonus = 4800000 * 300 * 12;
      expect(costs.seniorBonusCost).toBe(expectedSeniorBonus);
    });

    it('should calculate gross UBI cost correctly', () => {
      const costs = calculateUBICosts(mockParameters, mockPopulation);
      
      const expectedGross = costs.childUbiCost + costs.youthUbiCost + 
                           costs.adultUbiCost + costs.seniorBonusCost;
      expect(costs.grossUbiCost).toBe(expectedGross);
    });

    it('should handle zero population gracefully', () => {
      const zeroPopulation: PopulationBreakdown = {
        children: 0, youth: 0, adults: 0, seniors: 0, total: 0
      };
      
      const costs = calculateUBICosts(mockParameters, zeroPopulation);
      expect(costs.grossUbiCost).toBe(0);
    });
  });

  describe('calculateTaxRevenue', () => {
    it('should calculate tax revenue correctly', () => {
      const taxation = calculateTaxRevenue(mockParameters, mockPopulation, mockEconomics.averageIncome);
      
      // Taxpaying population: 23.8M adults + 4.8M seniors = 28.6M
      const taxpayers = 23800000 + 4800000;
      
      // Total income with UBI: $52k + $24k = $76k
      expect(taxation.totalIncomeWithUbi).toBe(76000);
      
      // Taxable amount: $76k - $24k exemption = $52k
      expect(taxation.taxableAmount).toBe(52000);
      
      // Tax per person: $52k × 30% = $15.6k
      expect(taxation.taxPerPerson).toBe(15600);
      
      // Total tax revenue: 28.6M × $15.6k = $446.16B
      expect(taxation.totalTaxRevenue).toBe(taxpayers * 15600);
    });

    it('should handle exemption larger than income', () => {
      const highExemptionParams = { ...mockParameters, exemptionAmount: 100000 };
      const taxation = calculateTaxRevenue(highExemptionParams, mockPopulation, mockEconomics.averageIncome);
      
      // Taxable amount should be 0 when exemption > total income
      expect(taxation.taxableAmount).toBe(0);
      expect(taxation.taxPerPerson).toBe(0);
      expect(taxation.totalTaxRevenue).toBe(0);
    });

    it('should handle zero tax rate', () => {
      const zeroTaxParams = { ...mockParameters, taxPercentage: 0 };
      const taxation = calculateTaxRevenue(zeroTaxParams, mockPopulation, mockEconomics.averageIncome);
      
      expect(taxation.taxPerPerson).toBe(0);
      expect(taxation.totalTaxRevenue).toBe(0);
    });

    it('should only tax adults and seniors', () => {
      const adultOnlyPopulation: PopulationBreakdown = {
        children: 1000000, youth: 1000000, adults: 1000000, seniors: 1000000, total: 4000000
      };
      
      const taxation = calculateTaxRevenue(mockParameters, adultOnlyPopulation, mockEconomics.averageIncome);
      
      // Only 2M taxpayers (1M adults + 1M seniors), not 4M total
      const expectedRevenue = 2000000 * 15600; // 2M × $15.6k tax per person
      expect(taxation.totalTaxRevenue).toBe(expectedRevenue);
    });
  });

  describe('assessFeasibility', () => {
    it('should assess SURPLUS for negative or zero GDP percentage', () => {
      expect(assessFeasibility(-5.0)).toBe('SURPLUS');  // Negative GDP impact = surplus
      expect(assessFeasibility(-0.1)).toBe('SURPLUS');  // Small negative = surplus
      expect(assessFeasibility(0)).toBe('SURPLUS');     // Zero GDP impact = surplus
    });

    it('should assess FEASIBLE for low GDP percentage', () => {
      expect(assessFeasibility(0.1)).toBe('FEASIBLE');  // Just above 0% = feasible
      expect(assessFeasibility(3.5)).toBe('FEASIBLE');
      expect(assessFeasibility(4.9)).toBe('FEASIBLE');
    });

    it('should assess CHALLENGING for medium GDP percentage', () => {
      expect(assessFeasibility(5.0)).toBe('CHALLENGING');
      expect(assessFeasibility(7.5)).toBe('CHALLENGING');
      expect(assessFeasibility(9.9)).toBe('CHALLENGING');
    });

    it('should assess DIFFICULT for high GDP percentage', () => {
      expect(assessFeasibility(10.0)).toBe('DIFFICULT');
      expect(assessFeasibility(15.0)).toBe('DIFFICULT');
    });

    it('should handle edge cases', () => {
      expect(assessFeasibility(0)).toBe('SURPLUS');        // 0% GDP impact = surplus
      expect(assessFeasibility(4.999)).toBe('FEASIBLE');   // Just under 5% = feasible
      expect(assessFeasibility(5.001)).toBe('CHALLENGING'); // Just over 5% = challenging
      expect(assessFeasibility(9.999)).toBe('CHALLENGING');
      expect(assessFeasibility(10.001)).toBe('DIFFICULT');
    });
  });

  describe('calculateUBIFeasibility', () => {
    it('should perform complete feasibility calculation', () => {
      const result = calculateUBIFeasibility(mockParameters, mockPopulation, mockEconomics);
      
      // Verify all components are present
      expect(result.parameters).toEqual(mockParameters);
      expect(result.population).toEqual(mockPopulation);
      expect(result.economics).toEqual(mockEconomics);
      
      // Verify calculations
      expect(result.costs.grossUbiCost).toBeGreaterThan(0);
      expect(result.taxation.totalTaxRevenue).toBeGreaterThan(0);
      expect(result.netUbiCost).toBe(result.costs.grossUbiCost - result.taxation.totalTaxRevenue);
      
      // Verify percentages
      expect(result.gdpPercentage).toBe((result.netUbiCost / mockEconomics.gdp) * 100);
      expect(result.budgetPercentage).toBe((result.netUbiCost / mockEconomics.totalGovernmentBudget) * 100);
      
      // Verify feasibility assessment
      expect(['SURPLUS', 'FEASIBLE', 'CHALLENGING', 'DIFFICULT']).toContain(result.feasibility);
    });

    it('should handle realistic UBI scenario', () => {
      // Test with realistic $18k UBI and 25% tax
      const realisticParams = { ...mockParameters, adultUbiAmount: 18000, taxPercentage: 25 };
      const result = calculateUBIFeasibility(realisticParams, mockPopulation, mockEconomics);
      
      // Should be challenging but not impossible
      expect(result.gdpPercentage).toBeLessThan(15);
      expect(result.feasibility).not.toBe('DIFFICULT');
    });
  });

  describe('formatCurrency', () => {
    it('should format large amounts with T suffix', () => {
      expect(formatCurrency(2740000000000)).toBe('$2.7T');
      expect(formatCurrency(1500000000000)).toBe('$1.5T');
    });

    it('should format billions with B suffix', () => {
      expect(formatCurrency(450000000000)).toBe('$450.0B');
      expect(formatCurrency(1200000000)).toBe('$1.2B');
    });

    it('should format millions with M suffix', () => {
      expect(formatCurrency(24000000)).toBe('$24.0M');
      expect(formatCurrency(1500000)).toBe('$1.5M');
    });

    it('should format thousands with K suffix', () => {
      expect(formatCurrency(24000)).toBe('$24.0K');
      expect(formatCurrency(1500)).toBe('$1.5K');
    });

    it('should format small amounts without suffix', () => {
      expect(formatCurrency(500)).toBe('$500');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-24000)).toBe('-$24.0K');
      expect(formatCurrency(-1500000000)).toBe('-$1.5B');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages with one decimal place', () => {
      expect(formatPercentage(5.67)).toBe('5.7%');
      expect(formatPercentage(10.0)).toBe('10.0%');
      expect(formatPercentage(0.123)).toBe('0.1%');
    });
  });

  describe('validateParameters', () => {
    it('should accept valid parameters', () => {
      const errors = validateParameters(mockParameters);
      expect(errors).toHaveLength(0);
    });

    it('should reject negative UBI amounts', () => {
      const invalidParams = { ...mockParameters, adultUbiAmount: -1000 };
      const errors = validateParameters(invalidParams);
      expect(errors).toContain('Adult UBI amount must be positive');
    });

    it('should reject invalid age cutoffs', () => {
      const invalidParams = { ...mockParameters, childAgeCutoff: 25, adultAgeCutoff: 20 };
      const errors = validateParameters(invalidParams);
      expect(errors).toContain('Adult age cutoff must be greater than child age cutoff');
    });

    it('should reject invalid tax percentage', () => {
      const invalidParams = { ...mockParameters, taxPercentage: 150 };
      const errors = validateParameters(invalidParams);
      expect(errors).toContain('Tax percentage must be between 0 and 100');
    });

    it('should reject negative exemption amount', () => {
      const invalidParams = { ...mockParameters, exemptionAmount: -5000 };
      const errors = validateParameters(invalidParams);
      expect(errors).toContain('Tax exemption amount must be positive');
    });
  });
});
