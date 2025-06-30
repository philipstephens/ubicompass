/**
 * Unit tests for year contexts data
 * Tests historical context information for analysis years
 */

import { describe, it, expect } from 'vitest';
import {
  yearContexts,
  getYearContext,
  getYearBriefDescription,
  getAvailableYears,
  type YearContext
} from '../../../data/year-contexts';

describe('Year Contexts', () => {
  describe('yearContexts data structure', () => {
    it('should have contexts for all years 2000-2022', () => {
      for (let year = 2000; year <= 2022; year++) {
        expect(yearContexts[year]).toBeDefined();
        expect(yearContexts[year].year).toBe(year);
      }
    });

    it('should have complete data for each year context', () => {
      Object.values(yearContexts).forEach((context: YearContext) => {
        expect(context.year).toBeGreaterThanOrEqual(2000);
        expect(context.year).toBeLessThanOrEqual(2022);
        expect(context.title).toBeTruthy();
        expect(context.description).toBeTruthy();
        expect(context.economicContext).toBeTruthy();
        expect(Array.isArray(context.majorEvents)).toBe(true);
        expect(context.majorEvents.length).toBeGreaterThan(0);
      });
    });

    it('should have realistic inflation rates when provided', () => {
      Object.values(yearContexts).forEach((context: YearContext) => {
        if (context.inflationRate !== undefined) {
          expect(context.inflationRate).toBeGreaterThanOrEqual(-5); // Deflation possible
          expect(context.inflationRate).toBeLessThanOrEqual(15); // Hyperinflation unlikely in Canada
        }
      });
    });

    it('should have realistic GDP growth rates when provided', () => {
      Object.values(yearContexts).forEach((context: YearContext) => {
        if (context.gdpGrowth !== undefined) {
          expect(context.gdpGrowth).toBeGreaterThanOrEqual(-10); // Severe recession
          expect(context.gdpGrowth).toBeLessThanOrEqual(10); // Boom unlikely to exceed 10%
        }
      });
    });
  });

  describe('getYearContext', () => {
    it('should return correct context for valid years', () => {
      const context2020 = getYearContext(2020);
      expect(context2020).toBeDefined();
      expect(context2020!.year).toBe(2020);
      expect(context2020!.title).toBe('COVID-19 Pandemic Onset');
      expect(context2020!.majorEvents).toContain('Global pandemic declared');
    });

    it('should return null for invalid years', () => {
      expect(getYearContext(1999)).toBeNull();
      expect(getYearContext(2023)).toBeNull();
      expect(getYearContext(2050)).toBeNull();
    });

    it('should return null for non-numeric input', () => {
      expect(getYearContext(NaN)).toBeNull();
      expect(getYearContext(Infinity)).toBeNull();
    });
  });

  describe('getYearBriefDescription', () => {
    it('should return title for valid years', () => {
      expect(getYearBriefDescription(2020)).toBe('COVID-19 Pandemic Onset');
      expect(getYearBriefDescription(2001)).toBe('9/11 & Dot-Com Crash');
      expect(getYearBriefDescription(2008)).toBe('Financial Crisis Begins');
    });

    it('should return empty string for invalid years', () => {
      expect(getYearBriefDescription(1999)).toBe('');
      expect(getYearBriefDescription(2023)).toBe('');
    });
  });

  describe('getAvailableYears', () => {
    it('should return all years in descending order', () => {
      const years = getAvailableYears();
      expect(years).toHaveLength(23); // 2000-2022 inclusive
      expect(years[0]).toBe(2022); // Most recent first
      expect(years[years.length - 1]).toBe(2000); // Oldest last
      
      // Verify descending order
      for (let i = 1; i < years.length; i++) {
        expect(years[i]).toBeLessThan(years[i - 1]);
      }
    });

    it('should include all expected years', () => {
      const years = getAvailableYears();
      for (let year = 2000; year <= 2022; year++) {
        expect(years).toContain(year);
      }
    });
  });

  describe('Historical accuracy', () => {
    it('should have accurate COVID-19 context for 2020-2022', () => {
      const context2020 = getYearContext(2020)!;
      const context2021 = getYearContext(2021)!;
      const context2022 = getYearContext(2022)!;

      expect(context2020.title).toContain('COVID');
      expect(context2021.title).toContain('COVID');
      expect(context2022.title).toContain('COVID');

      expect(context2020.majorEvents.some(event => 
        event.toLowerCase().includes('pandemic')
      )).toBe(true);
    });

    it('should have accurate financial crisis context for 2008-2009', () => {
      const context2008 = getYearContext(2008)!;
      const context2009 = getYearContext(2009)!;

      expect(context2008.title).toContain('Financial Crisis');
      expect(context2009.title).toContain('Financial Crisis');

      expect(context2008.majorEvents.some(event => 
        event.toLowerCase().includes('lehman')
      )).toBe(true);
    });

    it('should have accurate 9/11 context for 2001', () => {
      const context2001 = getYearContext(2001)!;

      expect(context2001.title).toContain('9/11');
      expect(context2001.majorEvents.some(event => 
        event.toLowerCase().includes('september 11')
      )).toBe(true);
    });

    it('should have accurate Y2K context for 2000', () => {
      const context2000 = getYearContext(2000)!;

      expect(context2000.title).toContain('Y2K');
      expect(context2000.majorEvents.some(event => 
        event.toLowerCase().includes('y2k')
      )).toBe(true);
    });
  });

  describe('Economic data consistency', () => {
    it('should show economic decline during recession years', () => {
      const context2009 = getYearContext(2009)!; // Financial crisis peak
      const context2020 = getYearContext(2020)!; // COVID recession

      if (context2009.gdpGrowth !== undefined) {
        expect(context2009.gdpGrowth).toBeLessThan(0);
      }
      if (context2020.gdpGrowth !== undefined) {
        expect(context2020.gdpGrowth).toBeLessThan(0);
      }
    });

    it('should show high inflation in recent years', () => {
      const context2021 = getYearContext(2021)!;
      const context2022 = getYearContext(2022)!;

      if (context2021.inflationRate !== undefined) {
        expect(context2021.inflationRate).toBeGreaterThan(2);
      }
      if (context2022.inflationRate !== undefined) {
        expect(context2022.inflationRate).toBeGreaterThan(5);
      }
    });

    it('should show low inflation during deflationary periods', () => {
      const context2009 = getYearContext(2009)!; // Financial crisis
      const context2020 = getYearContext(2020)!; // Early COVID

      if (context2009.inflationRate !== undefined) {
        expect(context2009.inflationRate).toBeLessThan(1);
      }
      if (context2020.inflationRate !== undefined) {
        expect(context2020.inflationRate).toBeLessThan(2);
      }
    });
  });

  describe('Data completeness by period', () => {
    it('should have more complete data for recent years', () => {
      const recentYears = [2020, 2021, 2022];
      const olderYears = [2000, 2001, 2002];

      recentYears.forEach(year => {
        const context = getYearContext(year)!;
        expect(context.inflationRate).toBeDefined();
        expect(context.gdpGrowth).toBeDefined();
      });

      // Older years may have less complete data, but should still have basic info
      olderYears.forEach(year => {
        const context = getYearContext(year)!;
        expect(context.title).toBeTruthy();
        expect(context.description).toBeTruthy();
        expect(context.majorEvents.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Text quality', () => {
    it('should have meaningful titles', () => {
      Object.values(yearContexts).forEach((context: YearContext) => {
        expect(context.title.length).toBeGreaterThan(5);
        expect(context.title.length).toBeLessThan(50);
        expect(context.title).not.toMatch(/^\d+$/); // Not just numbers
      });
    });

    it('should have descriptive economic contexts', () => {
      Object.values(yearContexts).forEach((context: YearContext) => {
        expect(context.economicContext.length).toBeGreaterThan(20);
        expect(context.economicContext.length).toBeLessThan(200);
      });
    });

    it('should have relevant major events', () => {
      Object.values(yearContexts).forEach((context: YearContext) => {
        context.majorEvents.forEach(event => {
          expect(event.length).toBeGreaterThan(5);
          expect(event.length).toBeLessThan(100);
        });
      });
    });
  });
});
