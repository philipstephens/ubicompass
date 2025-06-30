/**
 * Genetic Algorithm Optimizer for UBI Parameters
 * Uses evolutionary computation to find optimal UBI configurations
 */

import { validateUbiForGenetic, UbiAmounts, UbiLocks } from './ubi-constraints';

export interface UbiGenome {
  // UBI amounts (monthly)
  childUbi: number;    // $0-500
  youthUbi: number;    // $0-800
  adultUbi: number;    // $0-2000
  seniorUbi: number;   // $0-2500
  
  // Tax parameters
  flatTaxRate: number;     // 0-50%
  taxExemption: number;    // $0-50000
  
  // Age cutoffs (aligned with UI constraints)
  childAgeCutoff: number;  // 0-12
  youthAgeCutoff: number;  // 13-21
  seniorAgeCutoff: number; // 55-100
  
  // Program replacement rates (0-100%)
  oasReplacement: number;
  ccbReplacement: number;
  eiReplacement: number;
  socialAssistanceReplacement: number;
}

export interface OptimizationObjectives {
  // Weights for multi-objective optimization (0-1, sum should = 1)
  maximizeBenefits: number;      // Maximize UBI amounts
  minimizeTaxBurden: number;     // Minimize tax rates
  achieveFiscalBalance: number;  // Minimize net cost
  politicalFeasibility: number;  // Realistic/acceptable parameters
}

export interface OptimizationConstraints {
  maxNetCost: number;           // Maximum acceptable net cost (billions)
  maxTaxRate: number;           // Maximum acceptable tax rate (%)
  minUbiProgression: boolean;   // Enforce child ≤ youth ≤ adult ≤ senior
  maxGdpPercentage: number;     // Maximum % of GDP for UBI

  // Age group locks - prevent optimization of specific age groups
  lockChildAge?: boolean;       // Lock child age cutoff
  lockYouthAge?: boolean;       // Lock youth age cutoff
  lockAdultAge?: boolean;       // Lock adult age cutoff (derived from youth/senior)
  lockSeniorAge?: boolean;      // Lock senior age cutoff

  // UBI amount locks - prevent optimization of specific UBI amounts
  lockChildUbi?: boolean;       // Lock child UBI amount
  lockYouthUbi?: boolean;       // Lock youth UBI amount
  lockAdultUbi?: boolean;       // Lock adult UBI amount
  lockSeniorUbi?: boolean;      // Lock senior UBI amount

  // Tax parameter locks - prevent optimization of specific tax parameters
  lockFlatTaxRate?: boolean;    // Lock flat tax rate
  lockTaxExemption?: boolean;   // Lock tax exemption amount
}

export interface OptimizationResult {
  genome: UbiGenome;
  fitness: number;
  objectives: {
    benefitScore: number;
    taxScore: number;
    fiscalScore: number;
    politicalScore: number;
    totalScore: number;
  };
  feasibility: {
    totalUbiCost: number;
    totalTaxRevenue: number;
    programSavings: number;
    netCost: number;
    gdpPercentage: number;
    isFeasible: boolean;
  };
}

export interface GeneticAlgorithmConfig {
  populationSize: number;       // Number of individuals per generation
  generations: number;          // Number of generations to evolve
  mutationRate: number;         // Probability of mutation (0-1)
  crossoverRate: number;        // Probability of crossover (0-1)
  elitismRate: number;          // Percentage of best individuals to keep (0-1)
  tournamentSize: number;       // Size of tournament selection
}

// Default configuration
export const DEFAULT_GA_CONFIG: GeneticAlgorithmConfig = {
  populationSize: 100,
  generations: 50,
  mutationRate: 0.1,
  crossoverRate: 0.8,
  elitismRate: 0.1,
  tournamentSize: 5,
};

// Default objectives (equal weighting)
export const DEFAULT_OBJECTIVES: OptimizationObjectives = {
  maximizeBenefits: 0.25,
  minimizeTaxBurden: 0.25,
  achieveFiscalBalance: 0.25,
  politicalFeasibility: 0.25,
};

// Default constraints
export const DEFAULT_CONSTRAINTS: OptimizationConstraints = {
  maxNetCost: 200000000000,     // $200B max net cost
  maxTaxRate: 40,               // 40% max tax rate
  minUbiProgression: true,      // Enforce UBI progression
  maxGdpPercentage: 8,          // 8% of GDP max

  // Age locks (default: all unlocked)
  lockChildAge: false,
  lockYouthAge: false,
  lockAdultAge: false,
  lockSeniorAge: false,

  // UBI amount locks (default: all unlocked)
  lockChildUbi: false,
  lockYouthUbi: false,
  lockAdultUbi: false,
  lockSeniorUbi: false,
};

/**
 * Generate a random genome within valid parameter ranges
 */
export const generateRandomGenome = (
  constraints?: OptimizationConstraints,
  currentGenome?: Partial<UbiGenome>
): UbiGenome => {
  // Debug logging
  console.log('🧬 GENERATING GENOME:');
  console.log('  UBI Lock Constraints:', {
    lockChildUbi: constraints?.lockChildUbi,
    lockYouthUbi: constraints?.lockYouthUbi,
    lockAdultUbi: constraints?.lockAdultUbi,
    lockSeniorUbi: constraints?.lockSeniorUbi,
  });
  console.log('  Current UBI Values:', {
    childUbi: currentGenome?.childUbi,
    youthUbi: currentGenome?.youthUbi,
    adultUbi: currentGenome?.adultUbi,
    seniorUbi: currentGenome?.seniorUbi,
  });

  // Use current values for locked UBI amounts, random for unlocked
  const childUbiLocked = constraints?.lockChildUbi && currentGenome?.childUbi !== undefined;
  const childUbi = childUbiLocked ? currentGenome.childUbi! : Math.floor(Math.random() * 501);
  console.log(`  Child UBI: ${childUbiLocked ? 'LOCKED' : 'RANDOM'} = ${childUbi}`);

  const youthUbiLocked = constraints?.lockYouthUbi && currentGenome?.youthUbi !== undefined;
  const youthUbi = youthUbiLocked ? currentGenome.youthUbi! : Math.floor(Math.random() * 801);
  console.log(`  Youth UBI: ${youthUbiLocked ? 'LOCKED' : 'RANDOM'} = ${youthUbi}`);

  const adultUbiLocked = constraints?.lockAdultUbi && currentGenome?.adultUbi !== undefined;
  const adultUbi = adultUbiLocked ? currentGenome.adultUbi! : Math.floor(Math.random() * 2001);
  console.log(`  Adult UBI: ${adultUbiLocked ? 'LOCKED' : 'RANDOM'} = ${adultUbi}`);

  const seniorUbiLocked = constraints?.lockSeniorUbi && currentGenome?.seniorUbi !== undefined;
  const seniorUbi = seniorUbiLocked ? currentGenome.seniorUbi! : Math.floor(Math.random() * 2501);
  console.log(`  Senior UBI: ${seniorUbiLocked ? 'LOCKED' : 'RANDOM'} = ${seniorUbi}`);

  // Use current values for locked parameters, random for unlocked
  const childAgeCutoff = constraints?.lockChildAge && currentGenome?.childAgeCutoff !== undefined
    ? currentGenome.childAgeCutoff
    : 0 + Math.floor(Math.random() * 13);   // 0-12

  const youthAgeCutoff = constraints?.lockYouthAge && currentGenome?.youthAgeCutoff !== undefined
    ? currentGenome.youthAgeCutoff
    : 13 + Math.floor(Math.random() * 9);  // 13-21

  const seniorAgeCutoff = constraints?.lockSeniorAge && currentGenome?.seniorAgeCutoff !== undefined
    ? currentGenome.seniorAgeCutoff
    : 55 + Math.floor(Math.random() * 46); // 55-100

  // For locked values, use the current genome values directly
  // For unlocked values, use the generated random values
  const finalChildUbi = constraints?.lockChildUbi && currentGenome?.childUbi !== undefined
    ? currentGenome.childUbi
    : childUbi;
  const finalYouthUbi = constraints?.lockYouthUbi && currentGenome?.youthUbi !== undefined
    ? currentGenome.youthUbi
    : youthUbi;
  const finalAdultUbi = constraints?.lockAdultUbi && currentGenome?.adultUbi !== undefined
    ? currentGenome.adultUbi
    : adultUbi;
  const finalSeniorUbi = constraints?.lockSeniorUbi && currentGenome?.seniorUbi !== undefined
    ? currentGenome.seniorUbi
    : seniorUbi;

  console.log('  FINAL UBI VALUES:');
  console.log(`    Child: ${finalChildUbi} (${constraints?.lockChildUbi ? 'LOCKED' : 'UNLOCKED'})`);
  console.log(`    Youth: ${finalYouthUbi} (${constraints?.lockYouthUbi ? 'LOCKED' : 'UNLOCKED'})`);
  console.log(`    Adult: ${finalAdultUbi} (${constraints?.lockAdultUbi ? 'LOCKED' : 'UNLOCKED'})`);
  console.log(`    Senior: ${finalSeniorUbi} (${constraints?.lockSeniorUbi ? 'LOCKED' : 'UNLOCKED'})`);

  // Use centralized constraint validation for progression only (not locks)
  const ubiAmounts: UbiAmounts = {
    child: finalChildUbi,
    youth: finalYouthUbi,
    adult: finalAdultUbi,
    senior: finalSeniorUbi
  };
  const ubiLocks: UbiLocks = {
    childLocked: constraints?.lockChildUbi || false,
    youthLocked: constraints?.lockYouthUbi || false,
    adultLocked: constraints?.lockAdultUbi || false,
    seniorLocked: constraints?.lockSeniorUbi || false,
  };

  const validatedUbi = validateUbiForGenetic(ubiAmounts, ubiLocks);

  // Tax parameters - use locked values or generate random
  const flatTaxRateLocked = constraints?.lockFlatTaxRate && currentGenome?.flatTaxRate !== undefined;
  const finalFlatTaxRate = flatTaxRateLocked ? currentGenome.flatTaxRate! : Math.floor(Math.random() * 51);
  console.log(`  Flat Tax Rate: ${flatTaxRateLocked ? 'LOCKED' : 'RANDOM'} = ${finalFlatTaxRate}%`);

  const taxExemptionLocked = constraints?.lockTaxExemption && currentGenome?.taxExemption !== undefined;
  const finalTaxExemption = taxExemptionLocked ? currentGenome.taxExemption! : Math.floor(Math.random() * 50001);
  console.log(`  Tax Exemption: ${taxExemptionLocked ? 'LOCKED' : 'RANDOM'} = $${finalTaxExemption}`);

  return {
    childUbi: validatedUbi.correctedValues.child,
    youthUbi: validatedUbi.correctedValues.youth,
    adultUbi: validatedUbi.correctedValues.adult,
    seniorUbi: validatedUbi.correctedValues.senior,

    flatTaxRate: finalFlatTaxRate,
    taxExemption: finalTaxExemption,

    childAgeCutoff,
    youthAgeCutoff,
    seniorAgeCutoff,

    oasReplacement: Math.floor(Math.random() * 101),     // 0-100%
    ccbReplacement: Math.floor(Math.random() * 101),     // 0-100%
    eiReplacement: Math.floor(Math.random() * 101),      // 0-100%
    socialAssistanceReplacement: Math.floor(Math.random() * 101), // 0-100%
  };
};

/**
 * Validate genome constraints
 */
export const validateGenome = (genome: UbiGenome, constraints: OptimizationConstraints): boolean => {
  // Check UBI progression constraint
  if (constraints.minUbiProgression) {
    if (genome.childUbi > genome.youthUbi ||
        genome.youthUbi > genome.adultUbi ||
        genome.adultUbi > genome.seniorUbi) {
      return false;
    }
  }
  
  // Check tax rate constraint
  if (genome.flatTaxRate > constraints.maxTaxRate) {
    return false;
  }
  
  // Check age cutoff logic
  if (genome.childAgeCutoff >= genome.youthAgeCutoff ||
      genome.youthAgeCutoff >= genome.seniorAgeCutoff) {
    return false;
  }
  
  return true;
};

/**
 * Repair genome to satisfy constraints
 */
export const repairGenome = (genome: UbiGenome, constraints: OptimizationConstraints): UbiGenome => {
  const repaired = { ...genome };
  
  // Repair UBI progression (respect locks)
  if (constraints.minUbiProgression) {
    // Only repair unlocked values to maintain progression
    if (!constraints.lockYouthUbi) {
      repaired.youthUbi = Math.max(repaired.youthUbi, repaired.childUbi);
    }
    if (!constraints.lockAdultUbi) {
      repaired.adultUbi = Math.max(repaired.adultUbi, repaired.youthUbi);
    }
    if (!constraints.lockSeniorUbi) {
      repaired.seniorUbi = Math.max(repaired.seniorUbi, repaired.adultUbi);
    }
  }
  
  // Repair tax rate
  repaired.flatTaxRate = Math.min(repaired.flatTaxRate, constraints.maxTaxRate);
  
  // Repair age cutoffs
  if (repaired.childAgeCutoff >= repaired.youthAgeCutoff) {
    repaired.youthAgeCutoff = repaired.childAgeCutoff + 1;
  }
  if (repaired.youthAgeCutoff >= repaired.seniorAgeCutoff) {
    repaired.seniorAgeCutoff = repaired.youthAgeCutoff + 1;
  }
  
  // Clamp values to valid ranges (respect locks)
  if (!constraints.lockChildUbi) {
    repaired.childUbi = Math.max(0, Math.min(500, repaired.childUbi));
  }
  if (!constraints.lockYouthUbi) {
    repaired.youthUbi = Math.max(0, Math.min(800, repaired.youthUbi));
  }
  if (!constraints.lockAdultUbi) {
    repaired.adultUbi = Math.max(0, Math.min(2000, repaired.adultUbi));
  }
  if (!constraints.lockSeniorUbi) {
    repaired.seniorUbi = Math.max(0, Math.min(2500, repaired.seniorUbi));
  }
  if (!constraints.lockFlatTaxRate) {
    repaired.flatTaxRate = Math.max(0, Math.min(50, repaired.flatTaxRate));
  }
  if (!constraints.lockTaxExemption) {
    repaired.taxExemption = Math.max(0, Math.min(50000, repaired.taxExemption));
  }
  repaired.childAgeCutoff = Math.max(0, Math.min(12, repaired.childAgeCutoff));
  repaired.youthAgeCutoff = Math.max(13, Math.min(21, repaired.youthAgeCutoff));
  repaired.seniorAgeCutoff = Math.max(55, Math.min(100, repaired.seniorAgeCutoff));
  repaired.oasReplacement = Math.max(0, Math.min(100, repaired.oasReplacement));
  repaired.ccbReplacement = Math.max(0, Math.min(100, repaired.ccbReplacement));
  repaired.eiReplacement = Math.max(0, Math.min(100, repaired.eiReplacement));
  repaired.socialAssistanceReplacement = Math.max(0, Math.min(100, repaired.socialAssistanceReplacement));
  
  return repaired;
};

/**
 * Crossover operation - blend two genomes (respects constraints)
 */
export const crossover = (parent1: UbiGenome, parent2: UbiGenome, constraints?: OptimizationConstraints): [UbiGenome, UbiGenome] => {
  const alpha = 0.5; // Blend factor
  
  const child1: UbiGenome = {
    // UBI amounts - use locked value or blend
    childUbi: constraints?.lockChildUbi ? parent1.childUbi : Math.floor(alpha * parent1.childUbi + (1 - alpha) * parent2.childUbi),
    youthUbi: constraints?.lockYouthUbi ? parent1.youthUbi : Math.floor(alpha * parent1.youthUbi + (1 - alpha) * parent2.youthUbi),
    adultUbi: constraints?.lockAdultUbi ? parent1.adultUbi : Math.floor(alpha * parent1.adultUbi + (1 - alpha) * parent2.adultUbi),
    seniorUbi: constraints?.lockSeniorUbi ? parent1.seniorUbi : Math.floor(alpha * parent1.seniorUbi + (1 - alpha) * parent2.seniorUbi),
    // Tax parameters - use locked value or blend
    flatTaxRate: constraints?.lockFlatTaxRate ? parent1.flatTaxRate : Math.floor(alpha * parent1.flatTaxRate + (1 - alpha) * parent2.flatTaxRate),
    taxExemption: constraints?.lockTaxExemption ? parent1.taxExemption : Math.floor(alpha * parent1.taxExemption + (1 - alpha) * parent2.taxExemption),
    childAgeCutoff: Math.floor(alpha * parent1.childAgeCutoff + (1 - alpha) * parent2.childAgeCutoff),
    youthAgeCutoff: Math.floor(alpha * parent1.youthAgeCutoff + (1 - alpha) * parent2.youthAgeCutoff),
    seniorAgeCutoff: Math.floor(alpha * parent1.seniorAgeCutoff + (1 - alpha) * parent2.seniorAgeCutoff),
    oasReplacement: Math.floor(alpha * parent1.oasReplacement + (1 - alpha) * parent2.oasReplacement),
    ccbReplacement: Math.floor(alpha * parent1.ccbReplacement + (1 - alpha) * parent2.ccbReplacement),
    eiReplacement: Math.floor(alpha * parent1.eiReplacement + (1 - alpha) * parent2.eiReplacement),
    socialAssistanceReplacement: Math.floor(alpha * parent1.socialAssistanceReplacement + (1 - alpha) * parent2.socialAssistanceReplacement),
  };
  
  const child2: UbiGenome = {
    // UBI amounts - use locked value or blend
    childUbi: constraints?.lockChildUbi ? parent1.childUbi : Math.floor((1 - alpha) * parent1.childUbi + alpha * parent2.childUbi),
    youthUbi: constraints?.lockYouthUbi ? parent1.youthUbi : Math.floor((1 - alpha) * parent1.youthUbi + alpha * parent2.youthUbi),
    adultUbi: constraints?.lockAdultUbi ? parent1.adultUbi : Math.floor((1 - alpha) * parent1.adultUbi + alpha * parent2.adultUbi),
    seniorUbi: constraints?.lockSeniorUbi ? parent1.seniorUbi : Math.floor((1 - alpha) * parent1.seniorUbi + alpha * parent2.seniorUbi),
    // Tax parameters - use locked value or blend
    flatTaxRate: constraints?.lockFlatTaxRate ? parent1.flatTaxRate : Math.floor((1 - alpha) * parent1.flatTaxRate + alpha * parent2.flatTaxRate),
    taxExemption: constraints?.lockTaxExemption ? parent1.taxExemption : Math.floor((1 - alpha) * parent1.taxExemption + alpha * parent2.taxExemption),
    childAgeCutoff: Math.floor((1 - alpha) * parent1.childAgeCutoff + alpha * parent2.childAgeCutoff),
    youthAgeCutoff: Math.floor((1 - alpha) * parent1.youthAgeCutoff + alpha * parent2.youthAgeCutoff),
    seniorAgeCutoff: Math.floor((1 - alpha) * parent1.seniorAgeCutoff + alpha * parent2.seniorAgeCutoff),
    oasReplacement: Math.floor((1 - alpha) * parent1.oasReplacement + alpha * parent2.oasReplacement),
    ccbReplacement: Math.floor((1 - alpha) * parent1.ccbReplacement + alpha * parent2.ccbReplacement),
    eiReplacement: Math.floor((1 - alpha) * parent1.eiReplacement + alpha * parent2.eiReplacement),
    socialAssistanceReplacement: Math.floor((1 - alpha) * parent1.socialAssistanceReplacement + alpha * parent2.socialAssistanceReplacement),
  };
  
  return [child1, child2];
};

/**
 * Mutation operation - randomly modify genome parameters
 */
export const mutate = (genome: UbiGenome, mutationRate: number, constraints?: OptimizationConstraints): UbiGenome => {
  const mutated = { ...genome };

  // Mutation strength (percentage of range to modify)
  const strength = 0.1;

  // Only mutate UBI amounts if they're not locked
  if (Math.random() < mutationRate) {
    if (!constraints?.lockChildUbi) {
      mutated.childUbi += Math.floor((Math.random() - 0.5) * 500 * strength);
    }
  }
  if (Math.random() < mutationRate) {
    if (!constraints?.lockYouthUbi) {
      mutated.youthUbi += Math.floor((Math.random() - 0.5) * 800 * strength);
    }
  }
  if (Math.random() < mutationRate) {
    if (!constraints?.lockAdultUbi) {
      mutated.adultUbi += Math.floor((Math.random() - 0.5) * 2000 * strength);
    }
  }
  if (Math.random() < mutationRate) {
    if (!constraints?.lockSeniorUbi) {
      mutated.seniorUbi += Math.floor((Math.random() - 0.5) * 2500 * strength);
    }
  }

  // Only mutate tax parameters if they're not locked
  if (Math.random() < mutationRate) {
    if (!constraints?.lockFlatTaxRate) {
      mutated.flatTaxRate += Math.floor((Math.random() - 0.5) * 50 * strength);
    }
  }
  if (Math.random() < mutationRate) {
    if (!constraints?.lockTaxExemption) {
      mutated.taxExemption += Math.floor((Math.random() - 0.5) * 50000 * strength);
    }
  }

  // Only mutate age cutoffs if they're not locked
  // Child age: only locked by childLocked
  if (Math.random() < mutationRate) {
    if (!constraints?.lockChildAge) {
      mutated.childAgeCutoff += Math.floor((Math.random() - 0.5) * 12 * strength);
    }
  }
  // Youth age: locked by youthLocked OR adultLocked (since adults depend on youth boundary)
  if (Math.random() < mutationRate) {
    if (!constraints?.lockYouthAge && !constraints?.lockAdultAge) {
      mutated.youthAgeCutoff += Math.floor((Math.random() - 0.5) * 8 * strength);
    }
  }
  // Senior age: locked by seniorLocked OR adultLocked (since adults depend on senior boundary)
  if (Math.random() < mutationRate) {
    if (!constraints?.lockSeniorAge && !constraints?.lockAdultAge) {
      mutated.seniorAgeCutoff += Math.floor((Math.random() - 0.5) * 45 * strength);
    }
  }

  if (Math.random() < mutationRate) {
    mutated.oasReplacement += Math.floor((Math.random() - 0.5) * 100 * strength);
  }
  if (Math.random() < mutationRate) {
    mutated.ccbReplacement += Math.floor((Math.random() - 0.5) * 100 * strength);
  }
  if (Math.random() < mutationRate) {
    mutated.eiReplacement += Math.floor((Math.random() - 0.5) * 100 * strength);
  }
  if (Math.random() < mutationRate) {
    mutated.socialAssistanceReplacement += Math.floor((Math.random() - 0.5) * 100 * strength);
  }

  return mutated;
};

/**
 * Tournament selection - select parent based on fitness
 */
export const tournamentSelection = (
  population: OptimizationResult[],
  tournamentSize: number
): OptimizationResult => {
  const tournament: OptimizationResult[] = [];

  // Randomly select individuals for tournament
  for (let i = 0; i < tournamentSize; i++) {
    const randomIndex = Math.floor(Math.random() * population.length);
    tournament.push(population[randomIndex]);
  }

  // Return the fittest individual from tournament
  return tournament.reduce((best, current) =>
    current.fitness > best.fitness ? current : best
  );
};

/**
 * Calculate fitness score for a genome
 */
export const calculateFitness = async (
  genome: UbiGenome,
  objectives: OptimizationObjectives,
  constraints: OptimizationConstraints,
  populationData: any,
  economicData: any
): Promise<OptimizationResult> => {
  // Calculate UBI costs
  const totalUbiCost =
    (genome.childUbi * populationData.childPopulation * 12) +
    (genome.youthUbi * populationData.youthPopulation * 12) +
    (genome.adultUbi * populationData.adultPopulation * 12) +
    (genome.seniorUbi * populationData.seniorPopulation * 12);

  // Calculate tax revenue (simplified model)
  const avgIncomes = { youth: 25000, adult: 55000, senior: 35000 };
  const getTaxableIncome = (income: number) => Math.max(0, income - genome.taxExemption);
  const getTaxOwed = (income: number) => getTaxableIncome(income) * (genome.flatTaxRate / 100);

  const totalTaxRevenue =
    (populationData.youthPopulation * getTaxOwed(avgIncomes.youth)) +
    (populationData.adultPopulation * getTaxOwed(avgIncomes.adult)) +
    (populationData.seniorPopulation * getTaxOwed(avgIncomes.senior));

  // Calculate program savings (simplified)
  const programSavings =
    (58000000000 * genome.oasReplacement / 100) +      // OAS
    (25000000000 * genome.ccbReplacement / 100) +      // CCB
    (22000000000 * genome.eiReplacement / 100) +       // EI
    (15000000000 * genome.socialAssistanceReplacement / 100); // Social Assistance

  const netCost = totalUbiCost - totalTaxRevenue - programSavings;
  const gdpPercentage = (netCost / economicData.gdp) * 100;

  // Calculate objective scores (0-1 scale)

  // 1. Benefit Score - higher UBI amounts are better
  const maxPossibleUbi = (500 + 800 + 2000 + 2500) / 4; // Average of max amounts
  const actualUbi = (genome.childUbi + genome.youthUbi + genome.adultUbi + genome.seniorUbi) / 4;
  const benefitScore = actualUbi / maxPossibleUbi;

  // 2. Tax Score - lower tax rates are better
  const taxScore = 1 - (genome.flatTaxRate / 50);

  // 3. Fiscal Score - closer to balanced budget is better
  const fiscalScore = Math.max(0, 1 - Math.abs(netCost) / constraints.maxNetCost);

  // 4. Political Score - realistic parameters are better
  let politicalScore = 1.0;

  // Penalize extreme tax rates
  if (genome.flatTaxRate > 35) politicalScore -= 0.2;
  if (genome.flatTaxRate < 15) politicalScore -= 0.1;

  // Penalize extreme UBI amounts
  if (genome.adultUbi > 1500) politicalScore -= 0.1;
  if (genome.adultUbi < 800) politicalScore -= 0.1;

  // Penalize high program replacement rates
  const avgReplacement = (genome.oasReplacement + genome.ccbReplacement +
                         genome.eiReplacement + genome.socialAssistanceReplacement) / 4;
  if (avgReplacement > 80) politicalScore -= 0.2;

  // Penalize if exceeds GDP constraint
  if (gdpPercentage > constraints.maxGdpPercentage) {
    politicalScore -= 0.3;
  }

  politicalScore = Math.max(0, politicalScore);

  // Calculate weighted total score
  const totalScore =
    (benefitScore * objectives.maximizeBenefits) +
    (taxScore * objectives.minimizeTaxBurden) +
    (fiscalScore * objectives.achieveFiscalBalance) +
    (politicalScore * objectives.politicalFeasibility);

  return {
    genome,
    fitness: totalScore,
    objectives: {
      benefitScore,
      taxScore,
      fiscalScore,
      politicalScore,
      totalScore,
    },
    feasibility: {
      totalUbiCost,
      totalTaxRevenue,
      programSavings,
      netCost,
      gdpPercentage,
      isFeasible: netCost <= constraints.maxNetCost && gdpPercentage <= constraints.maxGdpPercentage,
    },
  };
};

/**
 * Main genetic algorithm optimization function
 */
export const optimizeUbiParameters = async (
  objectives: OptimizationObjectives = DEFAULT_OBJECTIVES,
  constraints: OptimizationConstraints = DEFAULT_CONSTRAINTS,
  config: GeneticAlgorithmConfig = DEFAULT_GA_CONFIG,
  populationData: any,
  economicData: any,
  onProgress?: (generation: number, bestFitness: number, bestGenome: UbiGenome) => void,
  currentGenome?: Partial<UbiGenome>
): Promise<OptimizationResult[]> => {



  // Initialize population
  let population: OptimizationResult[] = [];
  const initialSeniorAges: number[] = [];



  for (let i = 0; i < config.populationSize; i++) {
    let genome = generateRandomGenome(constraints, currentGenome);
    initialSeniorAges.push(genome.seniorAgeCutoff);
    genome = repairGenome(genome, constraints);

    const result = await calculateFitness(genome, objectives, constraints, populationData, economicData);
    population.push(result);
  }

  console.log(`🔍 Initial senior ages (sample):`, initialSeniorAges.slice(0, 10));
  console.log(`🔍 Senior age stats:`, {
    min: Math.min(...initialSeniorAges),
    max: Math.max(...initialSeniorAges),
    avg: (initialSeniorAges.reduce((a, b) => a + b, 0) / initialSeniorAges.length).toFixed(1)
  });

  // Evolution loop
  for (let generation = 0; generation < config.generations; generation++) {
    // Sort population by fitness (descending)
    population.sort((a, b) => b.fitness - a.fitness);

    // Report progress
    const bestIndividual = population[0];
    if (onProgress) {
      onProgress(generation, bestIndividual.fitness, bestIndividual.genome);
    }

    console.log(`Generation ${generation}: Best fitness = ${bestIndividual.fitness.toFixed(4)}`);

    // Create next generation
    const nextGeneration: OptimizationResult[] = [];

    // Elitism - keep best individuals
    const eliteCount = Math.floor(config.populationSize * config.elitismRate);
    for (let i = 0; i < eliteCount; i++) {
      nextGeneration.push(population[i]);
    }

    // Generate offspring through crossover and mutation
    while (nextGeneration.length < config.populationSize) {
      // Selection
      const parent1 = tournamentSelection(population, config.tournamentSize);
      const parent2 = tournamentSelection(population, config.tournamentSize);

      let offspring: UbiGenome[];

      // Crossover
      if (Math.random() < config.crossoverRate) {
        offspring = crossover(parent1.genome, parent2.genome, constraints);
      } else {
        offspring = [parent1.genome, parent2.genome];
      }

      // Mutation and evaluation
      for (let child of offspring) {
        if (nextGeneration.length >= config.populationSize) break;

        child = mutate(child, config.mutationRate, constraints);
        child = repairGenome(child, constraints);

        const result = await calculateFitness(child, objectives, constraints, populationData, economicData);
        nextGeneration.push(result);
      }
    }

    population = nextGeneration;
  }

  // Final sort and return results
  population.sort((a, b) => b.fitness - a.fitness);

  console.log('🎯 Optimization complete!');
  console.log('Best solution fitness:', population[0].fitness.toFixed(4));
  console.log('Best solution genome:', population[0].genome);
  console.log(`🔍 Senior age analysis:`, {
    finalSeniorAge: population[0].genome.seniorAgeCutoff,
    allowedRange: '55-100',
    isAtMinimum: population[0].genome.seniorAgeCutoff === 55
  });

  return population;
};

/**
 * Quick optimization with predefined scenarios
 */
export const optimizeForScenario = async (
  scenario: 'maximize_benefits' | 'minimize_taxes' | 'fiscal_balance' | 'political_feasible',
  populationData: any,
  economicData: any,
  onProgress?: (generation: number, bestFitness: number, bestGenome: UbiGenome) => void,
  ageConstraints?: {
    childLocked: boolean;
    youthLocked: boolean;
    adultLocked: boolean;
    seniorLocked: boolean;
  },
  ubiConstraints?: {
    childLocked: boolean;
    youthLocked: boolean;
    adultLocked: boolean;
    seniorLocked: boolean;
  },
  taxConstraints?: {
    flatTaxRateLocked: boolean;
    taxExemptionLocked: boolean;
  },
  currentGenome?: Partial<UbiGenome>
): Promise<OptimizationResult> => {

  let objectives: OptimizationObjectives;
  let constraints: OptimizationConstraints;

  switch (scenario) {
    case 'maximize_benefits':
      objectives = {
        maximizeBenefits: 0.6,
        minimizeTaxBurden: 0.1,
        achieveFiscalBalance: 0.2,
        politicalFeasibility: 0.1,
      };
      constraints = {
        ...DEFAULT_CONSTRAINTS,
        maxNetCost: 300000000000, // Allow higher cost for max benefits
        maxGdpPercentage: 10,
        // Apply age constraints
        lockChildAge: ageConstraints?.childLocked || false,
        lockYouthAge: ageConstraints?.youthLocked || false,
        lockAdultAge: ageConstraints?.adultLocked || false,
        lockSeniorAge: ageConstraints?.seniorLocked || false,
        // Apply UBI amount constraints
        lockChildUbi: ubiConstraints?.childLocked || false,
        lockYouthUbi: ubiConstraints?.youthLocked || false,
        lockAdultUbi: ubiConstraints?.adultLocked || false,
        lockSeniorUbi: ubiConstraints?.seniorLocked || false,
        // Apply tax parameter constraints
        lockFlatTaxRate: taxConstraints?.flatTaxRateLocked || false,
        lockTaxExemption: taxConstraints?.taxExemptionLocked || false,
      };
      break;

    case 'minimize_taxes':
      objectives = {
        maximizeBenefits: 0.1,
        minimizeTaxBurden: 0.6,
        achieveFiscalBalance: 0.2,
        politicalFeasibility: 0.1,
      };
      constraints = {
        ...DEFAULT_CONSTRAINTS,
        maxTaxRate: 25, // Lower max tax rate
        // Apply age constraints
        lockChildAge: ageConstraints?.childLocked || false,
        lockYouthAge: ageConstraints?.youthLocked || false,
        lockAdultAge: ageConstraints?.adultLocked || false,
        lockSeniorAge: ageConstraints?.seniorLocked || false,
        // Apply UBI amount constraints
        lockChildUbi: ubiConstraints?.childLocked || false,
        lockYouthUbi: ubiConstraints?.youthLocked || false,
        lockAdultUbi: ubiConstraints?.adultLocked || false,
        lockSeniorUbi: ubiConstraints?.seniorLocked || false,
        // Apply tax parameter constraints
        lockFlatTaxRate: taxConstraints?.flatTaxRateLocked || false,
        lockTaxExemption: taxConstraints?.taxExemptionLocked || false,
      };
      break;

    case 'fiscal_balance':
      objectives = {
        maximizeBenefits: 0.2,
        minimizeTaxBurden: 0.2,
        achieveFiscalBalance: 0.5,
        politicalFeasibility: 0.1,
      };
      constraints = {
        ...DEFAULT_CONSTRAINTS,
        maxNetCost: 50000000000, // Very low net cost
        // Apply age constraints
        lockChildAge: ageConstraints?.childLocked || false,
        lockYouthAge: ageConstraints?.youthLocked || false,
        lockAdultAge: ageConstraints?.adultLocked || false,
        lockSeniorAge: ageConstraints?.seniorLocked || false,
        // Apply UBI amount constraints
        lockChildUbi: ubiConstraints?.childLocked || false,
        lockYouthUbi: ubiConstraints?.youthLocked || false,
        lockAdultUbi: ubiConstraints?.adultLocked || false,
        lockSeniorUbi: ubiConstraints?.seniorLocked || false,
        // Apply tax parameter constraints
        lockFlatTaxRate: taxConstraints?.flatTaxRateLocked || false,
        lockTaxExemption: taxConstraints?.taxExemptionLocked || false,
      };
      break;

    case 'political_feasible':
      objectives = {
        maximizeBenefits: 0.2,
        minimizeTaxBurden: 0.2,
        achieveFiscalBalance: 0.2,
        politicalFeasibility: 0.4,
      };
      constraints = {
        ...DEFAULT_CONSTRAINTS,
        maxTaxRate: 30,
        maxGdpPercentage: 5,
        // Apply age constraints
        lockChildAge: ageConstraints?.childLocked || false,
        lockYouthAge: ageConstraints?.youthLocked || false,
        lockAdultAge: ageConstraints?.adultLocked || false,
        lockSeniorAge: ageConstraints?.seniorLocked || false,
        // Apply UBI amount constraints
        lockChildUbi: ubiConstraints?.childLocked || false,
        lockYouthUbi: ubiConstraints?.youthLocked || false,
        lockAdultUbi: ubiConstraints?.adultLocked || false,
        lockSeniorUbi: ubiConstraints?.seniorLocked || false,
        // Apply tax parameter constraints
        lockFlatTaxRate: taxConstraints?.flatTaxRateLocked || false,
        lockTaxExemption: taxConstraints?.taxExemptionLocked || false,
      };
      break;
  }

  const config: GeneticAlgorithmConfig = {
    ...DEFAULT_GA_CONFIG,
    generations: 30, // Faster for quick scenarios
    populationSize: 50,
  };

  console.log('🚀 Starting genetic algorithm optimization...');

  try {
    const results = await optimizeUbiParameters(
      objectives,
      constraints,
      config,
      populationData,
      economicData,
      onProgress,
      currentGenome
    );

    if (!results || results.length === 0) {
      throw new Error("Optimization returned no results");
    }

    return results[0]; // Return best solution
  } catch (error) {
    console.error("Error in genetic algorithm:", error);
    throw error;
  }
};


