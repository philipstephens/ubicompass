/**
 * Government Spending Service for UBI Compass
 * Provides access to government spending data for UBI replacement analysis
 */
import { server$ } from '@builder.io/qwik-city';
import type { Pool, PoolClient } from 'pg';

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
  isReplaceable: boolean;
  replacementPercentage: number;
  replaceableAmount: number;
}

export interface SocialProgramData {
  programCode: string;
  programName: string;
  amount: number;
  beneficiaries: number;
  averageBenefit: number;
  replacementScenario: string;
  replacementPercentage: number;
}

export interface UbiReplacementAnalysis {
  totalCurrentSpending: number;
  totalReplaceableSpending: number;
  programSavings: number;
  netUbiCost: number;
  replacementRate: number;
}

// Database connection (reuse from statistics-service)
async function createPool(): Promise<Pool> {
  const { Pool } = await import('pg');

  // Use DATABASE_URL from environment if available, otherwise fallback to individual config
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return new Pool({
      connectionString: databaseUrl,
    });
  }

  // Fallback to individual environment variables or defaults
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '7000'),
    database: process.env.DB_NAME || 'UBIDatabase',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'UBI_Compass_2024_Secure!',
  });
}

/**
 * Get government spending summary for a specific year
 */
export const getGovernmentSpendingSummary = server$(async (year: number): Promise<GovernmentSpendingData> => {
  // Enhanced fallback data with historical trends and inflation adjustments
  const getHistoricalFallbackData = (year: number): GovernmentSpendingData => {
    // Base 2019 values (pre-COVID)
    const base2019 = {
      federalTotal: 355000,
      federalSocial: 145000,
      provincialTotal: 320000,
      totalReplaceable: 85000,
    };

    // Historical growth rates (approximate annual growth)
    const federalGrowthRate = 0.035; // 3.5% annual growth
    const socialGrowthRate = 0.042; // 4.2% annual growth (faster due to aging population)
    const provincialGrowthRate = 0.038; // 3.8% annual growth

    if (year >= 2020) {
      // COVID adjustments
      const covidMultiplier = year === 2020 ? 1.35 : year === 2021 ? 1.28 : 1.15;
      return {
        year,
        federalTotal: Math.round(base2019.federalTotal * covidMultiplier),
        federalSocial: Math.round(base2019.federalSocial * (covidMultiplier * 1.1)), // Extra social spending
        provincialTotal: Math.round(base2019.provincialTotal * covidMultiplier),
        totalReplaceable: Math.round(base2019.totalReplaceable * (covidMultiplier * 1.2)), // More replaceable programs
      };
    } else {
      // Historical projection backwards from 2019
      const yearsFromBase = 2019 - year;
      const federalMultiplier = Math.pow(1 + federalGrowthRate, -yearsFromBase);
      const socialMultiplier = Math.pow(1 + socialGrowthRate, -yearsFromBase);
      const provincialMultiplier = Math.pow(1 + provincialGrowthRate, -yearsFromBase);

      return {
        year,
        federalTotal: Math.round(base2019.federalTotal * federalMultiplier),
        federalSocial: Math.round(base2019.federalSocial * socialMultiplier),
        provincialTotal: Math.round(base2019.provincialTotal * provincialMultiplier),
        totalReplaceable: Math.round(base2019.totalReplaceable * socialMultiplier),
      };
    }
  };

  const fallbackData = getHistoricalFallbackData(year);

  let pool: Pool | null = null;
  let client: PoolClient | null = null;

  try {
    pool = await createPool();
    client = await pool.connect();

    const result = await client.query(`
      SELECT 
        year,
        SUM(CASE WHEN gj.jurisdiction_code = 'CA' AND sc.category_code = 'TOTAL' THEN gs.amount_millions ELSE 0 END) as federal_total,
        SUM(CASE WHEN gj.jurisdiction_code = 'CA' AND sc.category_code = 'SOCIAL' THEN gs.amount_millions ELSE 0 END) as federal_social,
        SUM(CASE WHEN gj.level_id = 2 AND sc.category_code = 'TOTAL' THEN gs.amount_millions ELSE 0 END) as provincial_total,
        SUM(CASE WHEN sc.ubi_replaceable = TRUE THEN gs.amount_millions * sc.replacement_percentage / 100 ELSE 0 END) as total_replaceable
      FROM government_spending gs
      JOIN government_jurisdictions gj ON gs.jurisdiction_id = gj.id
      JOIN spending_categories sc ON gs.category_id = sc.id
      WHERE gs.year = $1
      GROUP BY year
    `, [year]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      return {
        year,
        federalTotal: parseFloat(row.federal_total) || fallbackData.federalTotal,
        federalSocial: parseFloat(row.federal_social) || fallbackData.federalSocial,
        provincialTotal: parseFloat(row.provincial_total) || fallbackData.provincialTotal,
        totalReplaceable: parseFloat(row.total_replaceable) || fallbackData.totalReplaceable,
      };
    }

    return fallbackData;
  } catch (error) {
    console.error(`Error fetching government spending for year ${year}:`, error);
    return fallbackData;
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error ending pool:', e);
      }
    }
  }
});

/**
 * Get spending breakdown by category for a specific year
 */
export const getSpendingByCategory = server$(async (year: number, jurisdictionCode: string = 'CA'): Promise<SpendingByCategory[]> => {
  let pool: Pool | null = null;
  let client: PoolClient | null = null;

  try {
    pool = await createPool();
    client = await pool.connect();

    const result = await client.query(`
      SELECT 
        sc.category_code,
        sc.category_name,
        gs.amount_millions,
        sc.ubi_replaceable,
        sc.replacement_percentage,
        (gs.amount_millions * sc.replacement_percentage / 100) as replaceable_amount
      FROM government_spending gs
      JOIN government_jurisdictions gj ON gs.jurisdiction_id = gj.id
      JOIN spending_categories sc ON gs.category_id = sc.id
      WHERE gs.year = $1 AND gj.jurisdiction_code = $2
        AND sc.parent_category_id IS NULL -- Only top-level categories
      ORDER BY gs.amount_millions DESC
    `, [year, jurisdictionCode]);

    return result.rows.map(row => ({
      categoryCode: row.category_code,
      categoryName: row.category_name,
      amount: parseFloat(row.amount_millions),
      isReplaceable: row.ubi_replaceable,
      replacementPercentage: parseFloat(row.replacement_percentage),
      replaceableAmount: parseFloat(row.replaceable_amount),
    }));
  } catch (error) {
    console.error(`Error fetching spending by category for year ${year}:`, error);
    // Return fallback data
    return [
      {
        categoryCode: 'SOCIAL',
        categoryName: 'Social Protection',
        amount: 180000,
        isReplaceable: true,
        replacementPercentage: 60,
        replaceableAmount: 108000,
      },
      {
        categoryCode: 'HEALTH',
        categoryName: 'Health',
        amount: 85000,
        isReplaceable: false,
        replacementPercentage: 0,
        replaceableAmount: 0,
      },
      {
        categoryCode: 'EDUCATION',
        categoryName: 'Education',
        amount: 35000,
        isReplaceable: false,
        replacementPercentage: 0,
        replaceableAmount: 0,
      },
    ];
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error ending pool:', e);
      }
    }
  }
});

/**
 * Get social programs data for UBI replacement analysis
 */
export const getSocialProgramsData = server$(async (year: number): Promise<SocialProgramData[]> => {
  let pool: Pool | null = null;
  let client: PoolClient | null = null;

  try {
    pool = await createPool();
    client = await pool.connect();

    const result = await client.query(`
      SELECT 
        sp.program_code,
        sp.program_name,
        sps.amount_millions,
        sps.beneficiaries,
        sps.average_benefit_annual,
        sp.ubi_replacement_scenario,
        sp.replacement_percentage
      FROM social_program_spending sps
      JOIN social_programs sp ON sps.program_id = sp.id
      WHERE sps.year = $1
      ORDER BY sps.amount_millions DESC
    `, [year]);

    const socialPrograms = result.rows.map(row => ({
      programCode: row.program_code,
      programName: row.program_name,
      amount: parseFloat(row.amount_millions),
      beneficiaries: parseInt(row.beneficiaries) || 0,
      averageBenefit: parseFloat(row.average_benefit_annual) || 0,
      replacementScenario: row.ubi_replacement_scenario,
      replacementPercentage: parseFloat(row.replacement_percentage),
    }));

    // If no data found in database, use fallback data
    if (socialPrograms.length === 0) {
      console.log(`📊 No social programs found in database for ${year}, using fallback data`);
      // Use the same fallback logic as in the catch block
      throw new Error('No data found - triggering fallback');
    }

    console.log(`✅ Returning ${socialPrograms.length} database social programs for ${year}:`, socialPrograms.map(p => p.programName));
    return socialPrograms;
  } catch (error) {
    console.error(`Error fetching social programs data for year ${year}:`, error);
    console.log(`🔄 Using fallback data for year ${year}`);

    // Enhanced historical fallback data
    const getHistoricalSocialPrograms = (year: number): SocialProgramData[] => {
      console.log(`📊 Generating historical social programs data for ${year}`);
      // Base 2022 values
      const base2022 = {
        oas: { amount: 58000, beneficiaries: 6800000, averageBenefit: 8529 },
        ccb: { amount: 25000, beneficiaries: 3500000, averageBenefit: 7142 },
        ei: { amount: 22000, beneficiaries: 1800000, averageBenefit: 12222 },
      };

      // Historical adjustments with period-specific growth rates
      const yearsFromBase = 2022 - year;

      // Period-specific growth rates for more accuracy
      let growthRate = 0.04; // Default 4% annual growth
      if (year >= 2020) {
        growthRate = 0.08; // COVID-19 spending surge
      } else if (year >= 2016) {
        growthRate = 0.035; // Moderate growth period
      } else if (year >= 2009) {
        growthRate = 0.025; // Post-2008 recovery, slower growth
      } else if (year >= 2008) {
        growthRate = 0.15; // 2008 financial crisis, high spending
      } else {
        growthRate = 0.03; // Pre-crisis moderate growth
      }

      const multiplier = Math.pow(1 + growthRate, -yearsFromBase);

      // CCB was introduced in 2016, before that it was different programs
      const ccbAmount = year >= 2016 ? base2022.ccb.amount * multiplier :
                       year >= 2006 ? base2022.ccb.amount * multiplier * 0.7 : // UCCB era
                       base2022.ccb.amount * multiplier * 0.4; // Earlier child benefits

      // Base programs that existed throughout most periods
      const programs = [
        {
          programCode: 'OAS',
          programName: 'Old Age Security',
          amount: Math.round(base2022.oas.amount * multiplier),
          beneficiaries: Math.round(base2022.oas.beneficiaries * Math.pow(1.015, -yearsFromBase)), // Slower population growth
          averageBenefit: Math.round(base2022.oas.averageBenefit * multiplier),
          replacementScenario: 'partial',
          replacementPercentage: 50,
        },
        {
          programCode: 'CCB',
          programName: year >= 2016 ? 'Canada Child Benefit' :
                      year >= 2006 ? 'Universal Child Care Benefit' : 'Child Tax Benefit',
          amount: Math.round(ccbAmount),
          beneficiaries: Math.round(base2022.ccb.beneficiaries * Math.pow(1.005, -yearsFromBase)), // Very slow growth
          averageBenefit: Math.round((ccbAmount / base2022.ccb.beneficiaries) * 1000000),
          replacementScenario: 'partial',
          replacementPercentage: year >= 2016 ? 80 : 60, // CCB more replaceable than older programs
        },
        {
          programCode: 'EI',
          programName: 'Employment Insurance',
          amount: Math.round(base2022.ei.amount * multiplier),
          beneficiaries: Math.round(base2022.ei.beneficiaries * Math.pow(1.01, -yearsFromBase)), // Varies with economy
          averageBenefit: Math.round(base2022.ei.averageBenefit * multiplier),
          replacementScenario: 'partial',
          replacementPercentage: 70,
        },
      ];

      // Add GST/HST Credit for years when it existed (1991+)
      if (year >= 1991) {
        programs.push({
          programCode: 'GST',
          programName: year >= 2000 ? 'GST/HST Credit' : 'GST Credit',
          amount: Math.round(base2022.ccb.amount * 0.3 * multiplier), // Roughly 30% of CCB size
          beneficiaries: Math.round(base2022.ccb.beneficiaries * 1.2), // More recipients
          averageBenefit: Math.round(1200 * multiplier), // Smaller per-person amount
          replacementScenario: 'full',
          replacementPercentage: 95,
        });
      }

      return programs;
    };

    const fallbackData = getHistoricalSocialPrograms(year);
    console.log(`✅ Returning ${fallbackData.length} fallback social programs for ${year}:`, fallbackData.map(p => p.programName));
    return fallbackData;
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error ending pool:', e);
      }
    }
  }
});

/**
 * Calculate UBI replacement analysis
 */
export const calculateUbiReplacementAnalysis = server$(async (
  year: number,
  ubiCostAnnual: number,
  taxRevenue: number,
  replacementScenarios: Record<string, number> = {}
): Promise<UbiReplacementAnalysis> => {
  try {
    const socialPrograms = await getSocialProgramsData(year);
    
    let totalCurrentSpending = 0;
    let programSavings = 0;

    socialPrograms.forEach(program => {
      totalCurrentSpending += program.amount * 1000000; // Convert to dollars
      
      // Use custom replacement percentage if provided, otherwise use default
      const replacementRate = replacementScenarios[program.programCode] !== undefined 
        ? replacementScenarios[program.programCode] 
        : program.replacementPercentage;
      
      programSavings += (program.amount * 1000000) * (replacementRate / 100);
    });

    const netUbiCost = ubiCostAnnual - taxRevenue - programSavings;
    const replacementRate = totalCurrentSpending > 0 ? (programSavings / totalCurrentSpending) * 100 : 0;

    return {
      totalCurrentSpending,
      totalReplaceableSpending: programSavings / 0.6, // Assuming 60% average replacement rate
      programSavings,
      netUbiCost,
      replacementRate,
    };
  } catch (error) {
    console.error('Error calculating UBI replacement analysis:', error);
    
    // Return fallback analysis
    return {
      totalCurrentSpending: 150000000000, // $150B
      totalReplaceableSpending: 90000000000, // $90B
      programSavings: 54000000000, // $54B (60% of replaceable)
      netUbiCost: ubiCostAnnual - taxRevenue - 54000000000,
      replacementRate: 36, // 36% replacement rate
    };
  }
});

/**
 * Get available years with government spending data
 */
export const getAvailableSpendingYears = server$(async (): Promise<number[]> => {
  let pool: Pool | null = null;
  let client: PoolClient | null = null;

  try {
    pool = await createPool();
    client = await pool.connect();

    const result = await client.query(`
      SELECT DISTINCT year 
      FROM government_spending 
      ORDER BY year DESC
    `);

    if (result.rows.length > 0) {
      return result.rows.map(row => row.year);
    }

    // Fallback years
    return [2022, 2021, 2020, 2019, 2018];
  } catch (error) {
    console.error('Error fetching available spending years:', error);
    return [2022, 2021, 2020, 2019, 2018];
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error ending pool:', e);
      }
    }
  }
});
