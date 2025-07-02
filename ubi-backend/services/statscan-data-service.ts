/**
 * Statistics Canada Data Service
 * Provides access to real Canadian economic data for UBI analysis
 * (Database temporarily disabled for deployment - using fallback data)
 */

export interface IncomeDistributionData {
  year: number;
  ageGroup: string;
  incomeSource: string;
  sex: string;
  value: number;
  unit: string;
}

export interface EconomicData {
  year: number;
  gdp: number;
  federalRevenue: number;
  federalExpenditure: number;
  provincialRevenue: number;
  provincialExpenditure: number;
  inflationRate: number;
  population: number;
}

export interface PopulationData {
  adults: number;
  children: number;
  total: number;
}

/**
 * Statistics Canada Data Service
 * Temporarily using fallback data instead of database
 */
export class StatsCanaDataService {
  
  /**
   * Get available years for analysis
   */
  async getAvailableYears(): Promise<number[]> {
    // Return fallback years
    return [2000, 2005, 2010, 2015, 2020, 2022];
  }

  /**
   * Get income distribution data for UBI calculations
   */
  async getIncomeDistribution(year: number): Promise<IncomeDistributionData[]> {
    // Return fallback income distribution data
    return [
      { year, ageGroup: '0 to 17 years', incomeSource: 'Total income', sex: 'Both sexes', value: 15000, unit: 'Dollars' },
      { year, ageGroup: '18 to 24 years', incomeSource: 'Total income', sex: 'Both sexes', value: 25000, unit: 'Dollars' },
      { year, ageGroup: '25 to 54 years', incomeSource: 'Total income', sex: 'Both sexes', value: 55000, unit: 'Dollars' },
      { year, ageGroup: '55 to 64 years', incomeSource: 'Total income', sex: 'Both sexes', value: 65000, unit: 'Dollars' },
      { year, ageGroup: '65 years and over', incomeSource: 'Total income', sex: 'Both sexes', value: 45000, unit: 'Dollars' }
    ];
  }

  /**
   * Get GDP data for economic context
   */
  async getGDP(year: number): Promise<number | null> {
    // Return fallback GDP data based on year
    const gdpData: { [key: number]: number } = {
      2000: 1100000000000, // $1.1 trillion
      2005: 1300000000000, // $1.3 trillion
      2010: 1600000000000, // $1.6 trillion
      2015: 1900000000000, // $1.9 trillion
      2020: 2000000000000, // $2.0 trillion
      2022: 2200000000000  // $2.2 trillion
    };
    
    return gdpData[year] || 2000000000000; // Default to $2 trillion
  }

  /**
   * Get federal finance data
   */
  async getFederalFinance(year: number): Promise<{ revenue: number; expenditure: number } | null> {
    // Return fallback federal finance data
    const financeData: { [key: number]: { revenue: number; expenditure: number } } = {
      2000: { revenue: 180000000000, expenditure: 175000000000 },
      2005: { revenue: 220000000000, expenditure: 210000000000 },
      2010: { revenue: 280000000000, expenditure: 320000000000 },
      2015: { revenue: 320000000000, expenditure: 330000000000 },
      2020: { revenue: 350000000000, expenditure: 450000000000 },
      2022: { revenue: 400000000000, expenditure: 420000000000 }
    };
    
    return financeData[year] || { revenue: 350000000000, expenditure: 400000000000 };
  }

  /**
   * Get provincial finance data
   */
  async getProvincialFinance(year: number): Promise<{ revenue: number; expenditure: number } | null> {
    // Return fallback provincial finance data
    const financeData: { [key: number]: { revenue: number; expenditure: number } } = {
      2000: { revenue: 150000000000, expenditure: 145000000000 },
      2005: { revenue: 180000000000, expenditure: 175000000000 },
      2010: { revenue: 220000000000, expenditure: 240000000000 },
      2015: { revenue: 280000000000, expenditure: 290000000000 },
      2020: { revenue: 320000000000, expenditure: 380000000000 },
      2022: { revenue: 360000000000, expenditure: 370000000000 }
    };
    
    return financeData[year] || { revenue: 320000000000, expenditure: 350000000000 };
  }

  /**
   * Get inflation rate for a specific year
   */
  async getInflationRate(year: number): Promise<number | null> {
    // Return fallback inflation rates
    const inflationData: { [key: number]: number } = {
      2000: 2.7,
      2005: 2.2,
      2010: 1.8,
      2015: 1.1,
      2020: 0.7,
      2022: 6.8
    };
    
    return inflationData[year] || 2.0; // Default to 2%
  }

  /**
   * Get population data for a specific year
   */
  async getPopulation(year: number): Promise<PopulationData | null> {
    // Return fallback population data
    const populationData: { [key: number]: PopulationData } = {
      2000: { adults: 24000000, children: 8000000, total: 32000000 },
      2005: { adults: 26000000, children: 8000000, total: 34000000 },
      2010: { adults: 28000000, children: 8000000, total: 36000000 },
      2015: { adults: 29000000, children: 8000000, total: 37000000 },
      2020: { adults: 30000000, children: 8000000, total: 38000000 },
      2022: { adults: 31000000, children: 8000000, total: 39000000 }
    };
    
    return populationData[year] || { adults: 30000000, children: 8000000, total: 38000000 };
  }

  /**
   * Get population data with dynamic age cutoff
   */
  async getPopulationWithAgeCutoff(year: number, ageCutoff: number): Promise<PopulationData | null> {
    // For simplicity, return the same data regardless of age cutoff
    return this.getPopulation(year);
  }

  /**
   * Get comprehensive economic data for a year
   */
  async getEconomicData(year: number): Promise<EconomicData> {
    const gdp = await this.getGDP(year) || 0;
    const federalFinance = await this.getFederalFinance(year);
    const provincialFinance = await this.getProvincialFinance(year);
    const inflationRate = await this.getInflationRate(year) || 0;
    const population = await this.getPopulation(year);

    return {
      year,
      gdp: gdp || 0,
      federalRevenue: federalFinance?.revenue || 0,
      federalExpenditure: federalFinance?.expenditure || 0,
      provincialRevenue: provincialFinance?.revenue || 0,
      provincialExpenditure: provincialFinance?.expenditure || 0,
      inflationRate: inflationRate || 0,
      population: population?.total || 0
    };
  }

  /**
   * Close database connections (no-op for fallback data)
   */
  async close(): Promise<void> {
    // No database connections to close
  }
}

// Export singleton instance
export const statsCanaDataService = new StatsCanaDataService();
