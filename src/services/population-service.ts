/**
 * Population service that handles both database and static population data
 * Database mode: Queries PostgreSQL for accurate population data
 * Static mode: Uses pre-calculated estimates for offline functionality
 */

import { calculatePopulationByAge, getEconomicData, type PopulationData, type EconomicData } from '../data/population-estimates';

export interface PopulationBreakdown {
  children: number;
  youth: number;
  adults: number;
  seniors: number;
  total: number;
  isEstimated: boolean;
}

export interface EconomicContext {
  gdp: number;
  federalExpenditure: number;
  provincialExpenditure: number;
  totalGovernmentBudget: number;
  inflationRate: number;
  averageIncome: number;
  isEstimated: boolean;
}

export class PopulationService {
  private isDatabaseMode: boolean;

  constructor(isDatabaseMode: boolean = false) {
    this.isDatabaseMode = isDatabaseMode;
  }

  /**
   * Set population data mode (database vs static)
   */
  setDatabaseMode(useDatabase: boolean): void {
    this.isDatabaseMode = useDatabase;
  }

  /**
   * Get population breakdown by age groups for a given year
   */
  async getPopulationBreakdown(
    year: number,
    childCutoff: number,
    adultCutoff: number,
    seniorCutoff: number
  ): Promise<PopulationBreakdown> {
    if (this.isDatabaseMode) {
      return await this.getPopulationFromDatabase(year, childCutoff, adultCutoff, seniorCutoff);
    } else {
      return this.getPopulationFromEstimates(year, childCutoff, adultCutoff, seniorCutoff);
    }
  }

  /**
   * Get economic context for a given year
   */
  async getEconomicContext(year: number): Promise<EconomicContext> {
    if (this.isDatabaseMode) {
      return await this.getEconomicFromDatabase(year);
    } else {
      return this.getEconomicFromEstimates(year);
    }
  }

  /**
   * Get population data from database
   */
  private async getPopulationFromDatabase(
    year: number,
    childCutoff: number,
    adultCutoff: number,
    seniorCutoff: number
  ): Promise<PopulationBreakdown> {
    try {
      const response = await fetch('/api/population', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year,
          childCutoff,
          adultCutoff,
          seniorCutoff,
        }),
      });

      const result = await response.json();

      if (result.success) {
        return {
          children: result.data.children,
          youth: result.data.youth,
          adults: result.data.adults,
          seniors: result.data.seniors,
          total: result.data.total,
          isEstimated: false
        };
      } else {
        console.warn('Database population query failed, falling back to estimates');
        return this.getPopulationFromEstimates(year, childCutoff, adultCutoff, seniorCutoff);
      }
    } catch (error) {
      console.warn('Database connection failed, using estimates:', error);
      return this.getPopulationFromEstimates(year, childCutoff, adultCutoff, seniorCutoff);
    }
  }

  /**
   * Get population data from static estimates
   */
  private getPopulationFromEstimates(
    year: number,
    childCutoff: number,
    adultCutoff: number,
    seniorCutoff: number
  ): PopulationBreakdown {
    const data = calculatePopulationByAge(year, childCutoff, adultCutoff, seniorCutoff);
    
    return {
      children: data.children,
      youth: data.youth,
      adults: data.adults,
      seniors: data.seniors,
      total: data.total,
      isEstimated: true
    };
  }

  /**
   * Get economic data from database
   */
  private async getEconomicFromDatabase(year: number): Promise<EconomicContext> {
    try {
      const response = await fetch('/api/economic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year }),
      });

      const result = await response.json();

      if (result.success) {
        const data = result.data;
        return {
          gdp: data.gdp,
          federalExpenditure: data.federalExpenditure,
          provincialExpenditure: data.provincialExpenditure,
          totalGovernmentBudget: data.federalExpenditure + data.provincialExpenditure,
          inflationRate: data.inflationRate,
          averageIncome: data.averageIncome,
          isEstimated: false
        };
      } else {
        console.warn('Database economic query failed, falling back to estimates');
        return this.getEconomicFromEstimates(year);
      }
    } catch (error) {
      console.warn('Database connection failed, using estimates:', error);
      return this.getEconomicFromEstimates(year);
    }
  }

  /**
   * Get economic data from static estimates
   */
  private getEconomicFromEstimates(year: number): EconomicContext {
    const data = getEconomicData(year);
    
    return {
      gdp: data.gdp,
      federalExpenditure: data.federalExpenditure,
      provincialExpenditure: data.provincialExpenditure,
      totalGovernmentBudget: data.federalExpenditure + data.provincialExpenditure,
      inflationRate: data.inflationRate,
      averageIncome: data.averageIncome,
      isEstimated: true
    };
  }

  /**
   * Check if database is available
   */
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result.success && result.database;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available years for analysis
   */
  async getAvailableYears(): Promise<number[]> {
    if (this.isDatabaseMode) {
      try {
        const response = await fetch('/api/years', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.success) {
          return result.years.sort((a: number, b: number) => b - a);
        }
      } catch (error) {
        console.warn('Failed to get years from database:', error);
      }
    }

    // Fallback to static years
    return [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000];
  }

  /**
   * Get data quality indicator for a year
   */
  async getDataQuality(year: number): Promise<'complete' | 'excellent' | 'good' | 'estimated'> {
    if (!this.isDatabaseMode) {
      return 'estimated';
    }

    try {
      const response = await fetch('/api/data-quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year }),
      });

      const result = await response.json();

      if (result.success) {
        const datasets = result.availableDatasets;
        if (datasets >= 6) return 'complete';
        if (datasets >= 5) return 'excellent';
        if (datasets >= 4) return 'good';
        return 'estimated';
      }
    } catch (error) {
      console.warn('Failed to get data quality:', error);
    }

    return 'estimated';
  }

  /**
   * Format population number for display
   */
  formatPopulation(population: number, isEstimated: boolean = false): string {
    const formatted = population >= 1e6 
      ? `${(population / 1e6).toFixed(1)}M`
      : population >= 1e3 
        ? `${(population / 1e3).toFixed(0)}K`
        : population.toFixed(0);
    
    return isEstimated ? `${formatted} ~` : formatted;
  }

  /**
   * Get population description for UI
   */
  getPopulationDescription(
    breakdown: PopulationBreakdown,
    childCutoff: number,
    adultCutoff: number,
    seniorCutoff: number
  ): {
    children: string;
    youth: string;
    adults: string;
    seniors: string;
  } {
    const est = breakdown.isEstimated ? ' ~' : '';
    
    return {
      children: `Children under ${childCutoff}: ${this.formatPopulation(breakdown.children)}${est}`,
      youth: `Youth ${childCutoff}-${adultCutoff-1}: ${this.formatPopulation(breakdown.youth)}${est}`,
      adults: `Adults ${adultCutoff}-${seniorCutoff-1}: ${this.formatPopulation(breakdown.adults)}${est}`,
      seniors: `Seniors ${seniorCutoff}+: ${this.formatPopulation(breakdown.seniors)}${est}`
    };
  }
}
