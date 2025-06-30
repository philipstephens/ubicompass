/**
 * Unit tests for Genetic Algorithm Optimizer
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  generateRandomGenome,
  validateGenome,
  repairGenome,
  crossover,
  mutate,
  calculateFitness,
  tournamentSelection,
  optimizeForScenario,
  DEFAULT_OBJECTIVES,
  DEFAULT_CONSTRAINTS,
  type UbiGenome,
  type OptimizationResult,
} from './genetic-optimizer';

describe('Genetic Optimizer', () => {
  const mockPopulationData = {
    childPopulation: 5000000,
    youthPopulation: 3000000,
    adultPopulation: 15000000,
    seniorPopulation: 7000000,
  };

  const mockEconomicData = {
    gdp: 2500000000000, // $2.5T
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateRandomGenome', () => {
    it('should generate valid random genome', () => {
      const genome = generateRandomGenome();
      
      expect(genome.childUbi).toBeGreaterThanOrEqual(0);
      expect(genome.childUbi).toBeLessThanOrEqual(500);
      expect(genome.youthUbi).toBeGreaterThanOrEqual(genome.childUbi);
      expect(genome.adultUbi).toBeGreaterThanOrEqual(genome.youthUbi);
      expect(genome.seniorUbi).toBeGreaterThanOrEqual(genome.adultUbi);
      
      expect(genome.flatTaxRate).toBeGreaterThanOrEqual(0);
      expect(genome.flatTaxRate).toBeLessThanOrEqual(50);
      
      expect(genome.childAgeCutoff).toBeGreaterThanOrEqual(8);
      expect(genome.childAgeCutoff).toBeLessThanOrEqual(16);
      expect(genome.youthAgeCutoff).toBeGreaterThanOrEqual(18);
      expect(genome.youthAgeCutoff).toBeLessThanOrEqual(25);
      expect(genome.seniorAgeCutoff).toBeGreaterThanOrEqual(50);
      expect(genome.seniorAgeCutoff).toBeLessThanOrEqual(70);
    });

    it('should generate different genomes on multiple calls', () => {
      const genome1 = generateRandomGenome();
      const genome2 = generateRandomGenome();
      
      // Very unlikely to be identical
      expect(genome1).not.toEqual(genome2);
    });
  });

  describe('validateGenome', () => {
    it('should validate correct UBI progression', () => {
      const validGenome: UbiGenome = {
        childUbi: 200,
        youthUbi: 400,
        adultUbi: 1200,
        seniorUbi: 1500,
        flatTaxRate: 30,
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      expect(validateGenome(validGenome, DEFAULT_CONSTRAINTS)).toBe(true);
    });

    it('should reject invalid UBI progression', () => {
      const invalidGenome: UbiGenome = {
        childUbi: 500, // Higher than youth
        youthUbi: 400,
        adultUbi: 1200,
        seniorUbi: 1500,
        flatTaxRate: 30,
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      expect(validateGenome(invalidGenome, DEFAULT_CONSTRAINTS)).toBe(false);
    });

    it('should reject tax rate exceeding constraints', () => {
      const invalidGenome: UbiGenome = {
        childUbi: 200,
        youthUbi: 400,
        adultUbi: 1200,
        seniorUbi: 1500,
        flatTaxRate: 50, // Exceeds default max of 40%
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      expect(validateGenome(invalidGenome, DEFAULT_CONSTRAINTS)).toBe(false);
    });
  });

  describe('repairGenome', () => {
    it('should repair UBI progression', () => {
      const brokenGenome: UbiGenome = {
        childUbi: 500,
        youthUbi: 300, // Lower than child
        adultUbi: 200, // Lower than youth
        seniorUbi: 100, // Lower than adult
        flatTaxRate: 30,
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      const repaired = repairGenome(brokenGenome, DEFAULT_CONSTRAINTS);

      expect(repaired.childUbi).toBeLessThanOrEqual(repaired.youthUbi);
      expect(repaired.youthUbi).toBeLessThanOrEqual(repaired.adultUbi);
      expect(repaired.adultUbi).toBeLessThanOrEqual(repaired.seniorUbi);
    });

    it('should clamp values to valid ranges', () => {
      const extremeGenome: UbiGenome = {
        childUbi: -100, // Below minimum
        youthUbi: 1000, // Above maximum
        adultUbi: 3000, // Above maximum
        seniorUbi: 5000, // Above maximum
        flatTaxRate: 100, // Above maximum
        taxExemption: 100000, // Above maximum
        childAgeCutoff: 5, // Below minimum
        youthAgeCutoff: 30, // Above maximum
        seniorAgeCutoff: 80, // Above maximum
        oasReplacement: 150, // Above maximum
        ccbReplacement: -50, // Below minimum
        eiReplacement: 200, // Above maximum
        socialAssistanceReplacement: -100, // Below minimum
      };

      const repaired = repairGenome(extremeGenome, DEFAULT_CONSTRAINTS);

      expect(repaired.childUbi).toBeGreaterThanOrEqual(0);
      expect(repaired.childUbi).toBeLessThanOrEqual(500);
      expect(repaired.youthUbi).toBeLessThanOrEqual(800);
      expect(repaired.adultUbi).toBeLessThanOrEqual(2000);
      expect(repaired.seniorUbi).toBeLessThanOrEqual(2500);
      expect(repaired.flatTaxRate).toBeLessThanOrEqual(50);
      expect(repaired.taxExemption).toBeLessThanOrEqual(50000);
      expect(repaired.oasReplacement).toBeGreaterThanOrEqual(0);
      expect(repaired.oasReplacement).toBeLessThanOrEqual(100);
    });
  });

  describe('crossover', () => {
    it('should create two children from two parents', () => {
      const parent1: UbiGenome = {
        childUbi: 200,
        youthUbi: 400,
        adultUbi: 1200,
        seniorUbi: 1500,
        flatTaxRate: 30,
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      const parent2: UbiGenome = {
        childUbi: 300,
        youthUbi: 500,
        adultUbi: 1000,
        seniorUbi: 1300,
        flatTaxRate: 25,
        taxExemption: 20000,
        childAgeCutoff: 14,
        youthAgeCutoff: 23,
        seniorAgeCutoff: 60,
        oasReplacement: 70,
        ccbReplacement: 60,
        eiReplacement: 80,
        socialAssistanceReplacement: 40,
      };

      const [child1, child2] = crossover(parent1, parent2);

      // Children should be different from parents
      expect(child1).not.toEqual(parent1);
      expect(child1).not.toEqual(parent2);
      expect(child2).not.toEqual(parent1);
      expect(child2).not.toEqual(parent2);

      // Children should have values between parents (blend crossover)
      expect(child1.adultUbi).toBeGreaterThanOrEqual(Math.min(parent1.adultUbi, parent2.adultUbi));
      expect(child1.adultUbi).toBeLessThanOrEqual(Math.max(parent1.adultUbi, parent2.adultUbi));
    });
  });

  describe('mutate', () => {
    it('should potentially modify genome parameters', () => {
      const originalGenome: UbiGenome = {
        childUbi: 200,
        youthUbi: 400,
        adultUbi: 1200,
        seniorUbi: 1500,
        flatTaxRate: 30,
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      // High mutation rate should cause changes
      const mutated = mutate(originalGenome, 1.0);

      // At least some parameters should be different
      const differences = Object.keys(originalGenome).filter(
        key => (originalGenome as any)[key] !== (mutated as any)[key]
      );

      expect(differences.length).toBeGreaterThan(0);
    });

    it('should not modify genome with zero mutation rate', () => {
      const originalGenome: UbiGenome = {
        childUbi: 200,
        youthUbi: 400,
        adultUbi: 1200,
        seniorUbi: 1500,
        flatTaxRate: 30,
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      const mutated = mutate(originalGenome, 0.0);

      expect(mutated).toEqual(originalGenome);
    });
  });

  describe('calculateFitness', () => {
    it('should calculate fitness score for valid genome', async () => {
      const genome: UbiGenome = {
        childUbi: 200,
        youthUbi: 400,
        adultUbi: 1200,
        seniorUbi: 1500,
        flatTaxRate: 30,
        taxExemption: 15000,
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      const result = await calculateFitness(
        genome,
        DEFAULT_OBJECTIVES,
        DEFAULT_CONSTRAINTS,
        mockPopulationData,
        mockEconomicData
      );

      expect(result.fitness).toBeGreaterThan(0);
      expect(result.fitness).toBeLessThanOrEqual(1);
      expect(result.genome).toEqual(genome);
      expect(result.feasibility.totalUbiCost).toBeGreaterThan(0);
      expect(result.feasibility.totalTaxRevenue).toBeGreaterThan(0);
      expect(result.objectives.benefitScore).toBeGreaterThanOrEqual(0);
      expect(result.objectives.benefitScore).toBeLessThanOrEqual(1);
    });

    it('should penalize infeasible solutions', async () => {
      const infeasibleGenome: UbiGenome = {
        childUbi: 500,
        youthUbi: 800,
        adultUbi: 2000,
        seniorUbi: 2500,
        flatTaxRate: 10, // Very low tax rate
        taxExemption: 50000, // Very high exemption
        childAgeCutoff: 12,
        youthAgeCutoff: 21,
        seniorAgeCutoff: 55,
        oasReplacement: 0, // No program replacement
        ccbReplacement: 0,
        eiReplacement: 0,
        socialAssistanceReplacement: 0,
      };

      const result = await calculateFitness(
        infeasibleGenome,
        DEFAULT_OBJECTIVES,
        DEFAULT_CONSTRAINTS,
        mockPopulationData,
        mockEconomicData
      );

      expect(result.feasibility.isFeasible).toBe(false);
      expect(result.objectives.politicalScore).toBeLessThan(0.5); // Should be penalized
    });
  });

  describe('tournamentSelection', () => {
    it('should select fittest individual from tournament', () => {
      const population: OptimizationResult[] = [
        { fitness: 0.3 } as OptimizationResult,
        { fitness: 0.8 } as OptimizationResult,
        { fitness: 0.5 } as OptimizationResult,
        { fitness: 0.9 } as OptimizationResult,
        { fitness: 0.2 } as OptimizationResult,
      ];

      const selected = tournamentSelection(population, 3);

      // Should select one of the individuals
      expect(population).toContain(selected);
      
      // With tournament size 3, should have good chance of selecting high fitness
      expect(selected.fitness).toBeGreaterThan(0);
    });
  });

  describe('optimizeForScenario', () => {
    it('should optimize for maximize benefits scenario', async () => {
      const result = await optimizeForScenario(
        'maximize_benefits',
        mockPopulationData,
        mockEconomicData
      );

      expect(result.fitness).toBeGreaterThan(0);
      expect(result.genome.adultUbi).toBeGreaterThan(0);
      expect(result.feasibility.totalUbiCost).toBeGreaterThan(0);
      
      // Should prioritize higher UBI amounts
      expect(result.objectives.benefitScore).toBeGreaterThan(0);
    }, 30000); // Longer timeout for optimization

    it('should optimize for minimize taxes scenario', async () => {
      const result = await optimizeForScenario(
        'minimize_taxes',
        mockPopulationData,
        mockEconomicData
      );

      expect(result.fitness).toBeGreaterThan(0);
      
      // Should prioritize lower tax rates
      expect(result.genome.flatTaxRate).toBeLessThan(40);
      expect(result.objectives.taxScore).toBeGreaterThan(0);
    }, 30000);

    it('should optimize for fiscal balance scenario', async () => {
      const result = await optimizeForScenario(
        'fiscal_balance',
        mockPopulationData,
        mockEconomicData
      );

      expect(result.fitness).toBeGreaterThan(0);
      
      // Should prioritize balanced budget
      expect(Math.abs(result.feasibility.netCost)).toBeLessThan(200000000000); // < $200B
      expect(result.objectives.fiscalScore).toBeGreaterThan(0);
    }, 30000);

    it('should optimize for political feasible scenario', async () => {
      const result = await optimizeForScenario(
        'political_feasible',
        mockPopulationData,
        mockEconomicData
      );

      expect(result.fitness).toBeGreaterThan(0);
      
      // Should have realistic parameters
      expect(result.genome.flatTaxRate).toBeLessThanOrEqual(30);
      expect(result.genome.adultUbi).toBeLessThanOrEqual(1500);
      expect(result.objectives.politicalScore).toBeGreaterThan(0.5);
    }, 30000);
  });
});
