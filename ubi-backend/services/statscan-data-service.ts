/**
 * Statistics Canada Data Service
 * Provides access to real Canadian economic data for UBI analysis
 */

import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  host: 'localhost',
  port: 7000,
  database: 'UBIDatabase',
  user: 'postgres',
  // Add password if needed
});

export interface IncomeDistributionData {
  year: number;
  ageGroup: string;
  incomeSource: string;
  sex: string;
  value: number;
  unit: string;
}

export interface GDPData {
  year: number;
  geography: string;
  gdpComponent: string;
  value: number;
  unit: string;
}

export interface GovernmentFinanceData {
  year: number;
  geography: string;
  revenueExpenditure: string;
  component: string;
  value: number;
  unit: string;
}

export interface CPIData {
  year: number;
  geography: string;
  products: string;
  value: number;
  unit: string;
}

export interface EconomicContext {
  year: number;
  gdp: number;
  federalRevenue: number;
  federalExpenditure: number;
  provincialRevenue: number;
  provincialExpenditure: number;
  inflationRate: number;
  population: number;
}

export class StatsCanaDataService {
  
  /**
   * Get available years with complete data coverage
   */
  async getAvailableYears(): Promise<number[]> {
    const query = `
      SELECT DISTINCT year 
      FROM income_distribution 
      WHERE year >= 2008 AND year <= 2022
      ORDER BY year DESC
    `;
    
    const result = await pool.query(query);
    return result.rows.map(row => row.year);
  }

  /**
   * Get income distribution data for UBI calculations
   */
  async getIncomeDistribution(year: number): Promise<IncomeDistributionData[]> {
    const query = `
      SELECT year, age_group as "ageGroup", income_source as "incomeSource", 
             sex, value, unit
      FROM income_distribution 
      WHERE year = $1 
        AND geography = 'Canada'
        AND income_source = 'Total income'
        AND sex = 'Both sexes'
      ORDER BY age_group
    `;
    
    const result = await pool.query(query, [year]);
    return result.rows;
  }

  /**
   * Get GDP data for economic context
   */
  async getGDPData(year: number): Promise<number | null> {
    const query = `
      SELECT value
      FROM gdp_data 
      WHERE year = $1 
        AND geography = 'Canada'
        AND gdp_component LIKE '%Gross domestic product%'
      LIMIT 1
    `;
    
    const result = await pool.query(query, [year]);
    return result.rows.length > 0 ? result.rows[0].value : null;
  }

  /**
   * Get federal government revenue and expenditure
   */
  async getFederalFinance(year: number): Promise<{revenue: number, expenditure: number} | null> {
    const query = `
      SELECT 
        revenue_expenditure as "revenueExpenditure",
        SUM(value) as total
      FROM federal_finance 
      WHERE year = $1 
        AND geography = 'Canada'
        AND revenue_expenditure IN ('Revenue', 'Expenditure')
      GROUP BY revenue_expenditure
    `;
    
    const result = await pool.query(query, [year]);
    
    const data = { revenue: 0, expenditure: 0 };
    result.rows.forEach(row => {
      if (row.revenueExpenditure === 'Revenue') {
        data.revenue = row.total;
      } else if (row.revenueExpenditure === 'Expenditure') {
        data.expenditure = row.total;
      }
    });
    
    return data.revenue > 0 || data.expenditure > 0 ? data : null;
  }

  /**
   * Get provincial government finance totals
   */
  async getProvincialFinance(year: number): Promise<{revenue: number, expenditure: number} | null> {
    const query = `
      SELECT 
        revenue_expenditure as "revenueExpenditure",
        SUM(value) as total
      FROM provincial_finance 
      WHERE year = $1 
        AND revenue_expenditure IN ('Revenue', 'Expenditure')
      GROUP BY revenue_expenditure
    `;
    
    const result = await pool.query(query, [year]);
    
    const data = { revenue: 0, expenditure: 0 };
    result.rows.forEach(row => {
      if (row.revenueExpenditure === 'Revenue') {
        data.revenue = row.total;
      } else if (row.revenueExpenditure === 'Expenditure') {
        data.expenditure = row.total;
      }
    });
    
    return data.revenue > 0 || data.expenditure > 0 ? data : null;
  }

  /**
   * Get inflation rate (CPI change year-over-year)
   */
  async getInflationRate(year: number): Promise<number | null> {
    const query = `
      SELECT 
        curr.value as current_cpi,
        prev.value as previous_cpi
      FROM cpi_data curr
      LEFT JOIN cpi_data prev ON prev.year = curr.year - 1
        AND prev.geography = curr.geography
        AND prev.products = curr.products
      WHERE curr.year = $1 
        AND curr.geography = 'Canada'
        AND curr.products = 'All-items'
    `;
    
    const result = await pool.query(query, [year]);
    
    if (result.rows.length > 0 && result.rows[0].previous_cpi) {
      const current = result.rows[0].current_cpi;
      const previous = result.rows[0].previous_cpi;
      return ((current - previous) / previous) * 100;
    }
    
    return null;
  }

  /**
   * Get population data for a specific year
   */
  async getPopulation(year: number): Promise<{adults: number, children: number, total: number} | null> {
    const yearCode = year - 2000;
    
    const query = `
      SELECT 
        SUM(CASE WHEN age >= 18 THEN population ELSE 0 END) as adults,
        SUM(CASE WHEN age < 18 AND age > 0 THEN population ELSE 0 END) as children,
        SUM(CASE WHEN age > 0 THEN population ELSE 0 END) as total
      FROM populations 
      WHERE "yearStatsId" = $1
    `;
    
    const result = await pool.query(query, [yearCode]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Get comprehensive economic context for a year
   */
  async getEconomicContext(year: number): Promise<EconomicContext | null> {
    try {
      const [gdp, federalFinance, provincialFinance, inflationRate, population] = await Promise.all([
        this.getGDPData(year),
        this.getFederalFinance(year),
        this.getProvincialFinance(year),
        this.getInflationRate(year),
        this.getPopulation(year)
      ]);

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
    } catch (error) {
      console.error('Error getting economic context:', error);
      return null;
    }
  }

  /**
   * Calculate UBI feasibility with real data
   */
  async calculateUBIFeasibility(
    year: number, 
    ubiAmount: number, 
    childUbiAmount: number = 0
  ): Promise<any> {
    const context = await this.getEconomicContext(year);
    const population = await this.getPopulation(year);
    
    if (!context || !population) {
      throw new Error(`Insufficient data for year ${year}`);
    }

    // Calculate gross UBI cost
    const adultUbiCost = population.adults * ubiAmount;
    const childUbiCost = population.children * (childUbiAmount * 12); // Monthly to annual
    const grossUbiCost = adultUbiCost + childUbiCost;

    // Calculate as percentage of GDP
    const gdpPercentage = context.gdp > 0 ? (grossUbiCost / context.gdp) * 100 : 0;

    // Calculate as percentage of government budgets
    const totalGovernmentBudget = context.federalExpenditure + context.provincialExpenditure;
    const budgetPercentage = totalGovernmentBudget > 0 ? (grossUbiCost / totalGovernmentBudget) * 100 : 0;

    // Feasibility assessment
    let feasibility = 'UNKNOWN';
    if (gdpPercentage < 5) {
      feasibility = 'FEASIBLE';
    } else if (gdpPercentage < 10) {
      feasibility = 'CHALLENGING';
    } else {
      feasibility = 'DIFFICULT';
    }

    return {
      year,
      grossUbiCost,
      adultUbiCost,
      childUbiCost,
      gdpPercentage,
      budgetPercentage,
      feasibility,
      context,
      population
    };
  }

  /**
   * Close database connections
   */
  async close(): Promise<void> {
    await pool.end();
  }
}

// Export singleton instance
export const statsCanaDataService = new StatsCanaDataService();
