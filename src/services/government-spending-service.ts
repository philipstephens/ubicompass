/**
 * Government Spending Service for UBI Compass
 * Provides access to government spending data for UBI replacement analysis
 * (Database temporarily disabled for deployment - using fallback data)
 */
import { server$ } from '@builder.io/qwik-city';

// Government spending data interfaces
export interface GovernmentSpendingData {
  year: number;
  federalTotal: number;
  federalSocial: number;
  provincialTotal: number;
  totalReplaceable: number;
}

export interface SpendingByCategory {
  categoryCode: string;
  categoryName: string;
  amount: number;
  percentage: number;
  replaceable: boolean;
}

export interface ReplacementAnalysis {
  totalCurrentSpending: number;
  replaceableSpending: number;
  programSavings: number;
  replacementPercentage: number;
}

/**
 * Get government spending data for a specific year
 */
export const getGovernmentSpending = server$(async (year: number): Promise<GovernmentSpendingData> => {
  // Database temporarily disabled - return fallback data
  const spendingData: { [key: number]: GovernmentSpendingData } = {
    2000: {
      year: 2000,
      federalTotal: 175000000000, // $175B
      federalSocial: 85000000000,  // $85B
      provincialTotal: 145000000000, // $145B
      totalReplaceable: 65000000000  // $65B
    },
    2005: {
      year: 2005,
      federalTotal: 210000000000, // $210B
      federalSocial: 105000000000, // $105B
      provincialTotal: 175000000000, // $175B
      totalReplaceable: 80000000000  // $80B
    },
    2010: {
      year: 2010,
      federalTotal: 320000000000, // $320B
      federalSocial: 160000000000, // $160B
      provincialTotal: 240000000000, // $240B
      totalReplaceable: 120000000000 // $120B
    },
    2015: {
      year: 2015,
      federalTotal: 330000000000, // $330B
      federalSocial: 165000000000, // $165B
      provincialTotal: 290000000000, // $290B
      totalReplaceable: 140000000000 // $140B
    },
    2020: {
      year: 2020,
      federalTotal: 450000000000, // $450B (COVID spending)
      federalSocial: 225000000000, // $225B
      provincialTotal: 380000000000, // $380B
      totalReplaceable: 180000000000 // $180B
    },
    2022: {
      year: 2022,
      federalTotal: 420000000000, // $420B
      federalSocial: 210000000000, // $210B
      provincialTotal: 370000000000, // $370B
      totalReplaceable: 170000000000 // $170B
    }
  };
  
  return spendingData[year] || spendingData[2022];
});

/**
 * Get spending breakdown by category
 */
export const getSpendingByCategory = server$(async (year: number): Promise<SpendingByCategory[]> => {
  // Database temporarily disabled - return fallback data
  return [
    {
      categoryCode: 'SOCIAL',
      categoryName: 'Social Protection',
      amount: 120000000000, // $120B
      percentage: 35.0,
      replaceable: true
    },
    {
      categoryCode: 'HEALTH',
      categoryName: 'Health',
      amount: 85000000000, // $85B
      percentage: 25.0,
      replaceable: false
    },
    {
      categoryCode: 'EDUCATION',
      categoryName: 'Education',
      amount: 65000000000, // $65B
      percentage: 19.0,
      replaceable: false
    },
    {
      categoryCode: 'DEFENSE',
      categoryName: 'Defense',
      amount: 25000000000, // $25B
      percentage: 7.3,
      replaceable: false
    },
    {
      categoryCode: 'INFRASTRUCTURE',
      categoryName: 'Infrastructure',
      amount: 30000000000, // $30B
      percentage: 8.8,
      replaceable: false
    },
    {
      categoryCode: 'OTHER',
      categoryName: 'Other',
      amount: 17000000000, // $17B
      percentage: 5.0,
      replaceable: false
    }
  ];
});

/**
 * Calculate replacement analysis based on UBI parameters
 */
export const calculateReplacementAnalysis = server$(async (
  year: number,
  ubiCostAnnual: number,
  replacementPercentages: { [category: string]: number } = {}
): Promise<ReplacementAnalysis> => {
  // Database temporarily disabled - return fallback calculation
  const spendingData = await getGovernmentSpending(year);
  const categoryData = await getSpendingByCategory(year);
  
  // Calculate total replaceable spending
  const replaceableCategories = categoryData.filter(cat => cat.replaceable);
  const totalReplaceableSpending = replaceableCategories.reduce((sum, cat) => {
    const replacementPercent = replacementPercentages[cat.categoryCode] || 0;
    return sum + (cat.amount * replacementPercent / 100);
  }, 0);
  
  return {
    totalCurrentSpending: spendingData.federalTotal + spendingData.provincialTotal,
    replaceableSpending: spendingData.totalReplaceable,
    programSavings: totalReplaceableSpending,
    replacementPercentage: spendingData.totalReplaceable > 0 ? 
      (totalReplaceableSpending / spendingData.totalReplaceable) * 100 : 0
  };
});

/**
 * Get available years for spending analysis
 */
export const getAvailableSpendingYears = server$(async (): Promise<number[]> => {
  // Database temporarily disabled - return fallback years
  return [2000, 2005, 2010, 2015, 2020, 2022];
});

/**
 * Get program replacement recommendations
 */
export const getProgramReplacementRecommendations = server$(async (
  year: number,
  ubiCostAnnual: number
): Promise<{ [category: string]: number }> => {
  // Database temporarily disabled - return fallback recommendations
  const spendingData = await getGovernmentSpending(year);
  
  // Simple recommendation logic based on UBI cost
  const recommendations: { [category: string]: number } = {};
  
  if (ubiCostAnnual <= spendingData.totalReplaceable * 0.3) {
    // Low UBI cost - replace basic social programs
    recommendations['SOCIAL'] = 25;
  } else if (ubiCostAnnual <= spendingData.totalReplaceable * 0.6) {
    // Medium UBI cost - replace more social programs
    recommendations['SOCIAL'] = 50;
  } else {
    // High UBI cost - replace most social programs
    recommendations['SOCIAL'] = 75;
  }
  
  return recommendations;
});

/**
 * Get economic context for spending analysis
 */
export const getEconomicContext = server$(async (year: number): Promise<{
  gdp: number;
  spendingAsPercentOfGdp: number;
  debtToGdpRatio: number;
}> => {
  // Database temporarily disabled - return fallback data
  const contextData: { [key: number]: any } = {
    2000: { gdp: 1100000000000, spendingAsPercentOfGdp: 29.1, debtToGdpRatio: 82.1 },
    2005: { gdp: 1300000000000, spendingAsPercentOfGdp: 29.6, debtToGdpRatio: 70.3 },
    2010: { gdp: 1600000000000, spendingAsPercentOfGdp: 35.0, debtToGdpRatio: 81.1 },
    2015: { gdp: 1900000000000, spendingAsPercentOfGdp: 32.7, debtToGdpRatio: 91.5 },
    2020: { gdp: 2000000000000, spendingAsPercentOfGdp: 41.5, debtToGdpRatio: 117.8 },
    2022: { gdp: 2200000000000, spendingAsPercentOfGdp: 35.9, debtToGdpRatio: 107.5 }
  };
  
  return contextData[year] || contextData[2022];
});

/**
 * Validate replacement percentages
 */
export const validateReplacementPercentages = server$(async (
  replacementPercentages: { [category: string]: number }
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  // Check that percentages are within valid range
  Object.entries(replacementPercentages).forEach(([category, percentage]) => {
    if (percentage < 0 || percentage > 100) {
      errors.push(`${category}: Percentage must be between 0 and 100`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
});

// Legacy function names for compatibility with existing components
export const getGovernmentSpendingSummary = getGovernmentSpending;

export const getSocialProgramsData = server$(async (year: number) => {
  // Return fallback social programs data
  return [
    {
      programName: 'Old Age Security',
      amount: 45000000000,
      replaceable: true,
      category: 'SOCIAL'
    },
    {
      programName: 'Employment Insurance',
      amount: 25000000000,
      replaceable: true,
      category: 'SOCIAL'
    },
    {
      programName: 'Canada Child Benefit',
      amount: 24000000000,
      replaceable: true,
      category: 'SOCIAL'
    },
    {
      programName: 'Provincial Social Assistance',
      amount: 15000000000,
      replaceable: true,
      category: 'SOCIAL'
    }
  ];
});

export const calculateUbiReplacementAnalysis = server$(async (
  year: number,
  ubiCostAnnual: number,
  taxRevenue: number,
  replacementScenarios: any
) => {
  // Return fallback replacement analysis
  const spendingData = await getGovernmentSpending(year);
  const socialPrograms = await getSocialProgramsData(year);

  const totalProgramSavings = socialPrograms.reduce((sum: number, program: any) => {
    return sum + (program.amount * 0.5); // Assume 50% replacement
  }, 0);

  return {
    totalCurrentSpending: spendingData.federalTotal + spendingData.provincialTotal,
    programSavings: totalProgramSavings,
    netUbiCost: ubiCostAnnual - totalProgramSavings,
    replacementRate: 50.0,
    feasibilityScore: 75.0
  };
});
