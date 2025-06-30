/**
 * Historical context descriptions for each analysis year
 * Provides users with important economic and social context
 */

export interface YearContext {
  year: number;
  title: string;
  description: string;
  economicContext: string;
  majorEvents: string[];
  inflationRate?: number;
  gdpGrowth?: number;
}

export const yearContexts: Record<number, YearContext> = {
  2022: {
    year: 2022,
    title: "Post-COVID Recovery",
    description: "High inflation period following pandemic recovery",
    economicContext: "Strong GDP recovery but persistent inflation challenges",
    majorEvents: ["Russia-Ukraine conflict", "Supply chain disruptions", "Interest rate increases"],
    inflationRate: 6.8,
    gdpGrowth: 3.4
  },
  
  2021: {
    year: 2021,
    title: "COVID-19 Pandemic Response",
    description: "Massive government spending and economic support programs",
    economicContext: "Historic government intervention and spending levels",
    majorEvents: ["Vaccine rollout", "CERB and pandemic benefits", "Economic reopening"],
    inflationRate: 3.4,
    gdpGrowth: 4.6
  },
  
  2020: {
    year: 2020,
    title: "COVID-19 Pandemic Onset",
    description: "Economic lockdowns and unprecedented government response",
    economicContext: "Sharp economic contraction followed by massive stimulus",
    majorEvents: ["Global pandemic declared", "Economic lockdowns", "CERB launched"],
    inflationRate: 0.7,
    gdpGrowth: -5.2
  },
  
  2019: {
    year: 2019,
    title: "Pre-Pandemic Baseline",
    description: "Stable economic conditions before COVID-19",
    economicContext: "Normal economic growth with low unemployment",
    majorEvents: ["Federal election", "USMCA negotiations", "Stable growth"],
    inflationRate: 1.9,
    gdpGrowth: 1.9
  },
  
  2018: {
    year: 2018,
    title: "Trade Tensions",
    description: "NAFTA renegotiation and trade uncertainty",
    economicContext: "Economic growth despite trade policy uncertainty",
    majorEvents: ["USMCA negotiations", "Trade tensions with US", "Cannabis legalization"],
    inflationRate: 2.3,
    gdpGrowth: 2.4
  },
  
  2017: {
    year: 2017,
    title: "Economic Recovery Continues",
    description: "Sustained growth following post-2008 recovery",
    economicContext: "Steady economic expansion and job growth",
    majorEvents: ["Canada 150 celebrations", "NAFTA renegotiation begins", "Strong job growth"],
    inflationRate: 1.6,
    gdpGrowth: 3.0
  },
  
  2016: {
    year: 2016,
    title: "Oil Price Recovery",
    description: "Federal election year with economic policy changes",
    economicContext: "Recovery from oil price collapse, new government policies",
    majorEvents: ["Liberal government elected", "Oil price recovery begins", "Infrastructure spending"],
    inflationRate: 1.4,
    gdpGrowth: 1.0
  },
  
  2015: {
    year: 2015,
    title: "Oil Price Collapse",
    description: "Recession begins due to commodity price crash",
    economicContext: "Technical recession due to oil and commodity price collapse",
    majorEvents: ["Oil prices crash", "Technical recession", "Federal election campaign"],
    inflationRate: 1.1,
    gdpGrowth: 0.7
  },
  
  2014: {
    year: 2014,
    title: "Oil Boom Peak",
    description: "Strong economy at peak of commodity supercycle",
    economicContext: "Resource-driven economic strength before price collapse",
    majorEvents: ["Oil boom peak", "Strong resource sector", "Low unemployment"],
    inflationRate: 1.9,
    gdpGrowth: 2.9
  },
  
  2013: {
    year: 2013,
    title: "Post-Crisis Recovery",
    description: "Continued recovery from 2008 financial crisis",
    economicContext: "Steady growth as global economy stabilizes",
    majorEvents: ["Housing market strength", "Resource sector growth", "Stable recovery"],
    inflationRate: 0.9,
    gdpGrowth: 2.3
  },
  
  2012: {
    year: 2012,
    title: "European Debt Crisis",
    description: "Global uncertainty from European sovereign debt crisis",
    economicContext: "Canadian resilience despite global headwinds",
    majorEvents: ["European debt crisis", "Global economic uncertainty", "Resource sector strength"],
    inflationRate: 1.5,
    gdpGrowth: 1.7
  },
  
  2011: {
    year: 2011,
    title: "Post-Recession Recovery",
    description: "Economic recovery gains momentum",
    economicContext: "Strong recovery from 2008-2009 recession",
    majorEvents: ["Federal election", "Economic recovery", "Resource boom continues"],
    inflationRate: 2.9,
    gdpGrowth: 3.1
  },
  
  2010: {
    year: 2010,
    title: "Economic Stimulus",
    description: "Government stimulus programs support recovery",
    economicContext: "Stimulus-supported recovery from financial crisis",
    majorEvents: ["Economic stimulus programs", "Vancouver Olympics", "Recovery begins"],
    inflationRate: 1.8,
    gdpGrowth: 3.4
  },
  
  2009: {
    year: 2009,
    title: "Global Financial Crisis Peak",
    description: "Deepest recession since the Great Depression",
    economicContext: "Sharp economic contraction and rising unemployment",
    majorEvents: ["Global recession deepens", "Bank bailouts", "Massive stimulus launched"],
    inflationRate: 0.3,
    gdpGrowth: -2.8
  },
  
  2008: {
    year: 2008,
    title: "Financial Crisis Begins",
    description: "Lehman Brothers collapse triggers global crisis",
    economicContext: "Financial system crisis spreads globally",
    majorEvents: ["Lehman Brothers collapse", "Global financial crisis", "Bank bailouts begin"],
    inflationRate: 2.4,
    gdpGrowth: 1.0
  },
  
  2007: {
    year: 2007,
    title: "Pre-Crisis Economic Peak",
    description: "Strong economy before financial crisis",
    economicContext: "Peak economic conditions before crisis",
    majorEvents: ["Economic peak", "Housing bubble concerns", "Strong growth"],
    inflationRate: 2.1,
    gdpGrowth: 2.1
  },
  
  2006: {
    year: 2006,
    title: "Housing Boom Continues",
    description: "Continued economic expansion and housing growth",
    economicContext: "Strong economic growth with rising asset prices",
    majorEvents: ["Housing boom", "Resource sector strength", "Federal election"],
    inflationRate: 2.0,
    gdpGrowth: 2.6
  },
  
  2005: {
    year: 2005,
    title: "Strong Economic Growth",
    description: "Robust economic expansion continues",
    economicContext: "Sustained economic growth and low unemployment",
    majorEvents: ["Strong economic growth", "Resource sector boom", "Liberal minority government"],
    inflationRate: 2.2,
    gdpGrowth: 3.2
  },
  
  2004: {
    year: 2004,
    title: "Post-Dot-Com Recovery",
    description: "Recovery from early 2000s tech crash",
    economicContext: "Economic recovery gains strength",
    majorEvents: ["Federal election", "Economic recovery", "Resource sector growth"],
    inflationRate: 1.9,
    gdpGrowth: 3.1
  },
  
  2003: {
    year: 2003,
    title: "Iraq War & SARS",
    description: "Iraq War begins, SARS outbreak impacts economy",
    economicContext: "Economic uncertainty from geopolitical and health crises",
    majorEvents: ["Iraq War begins", "SARS outbreak", "Economic uncertainty"],
    inflationRate: 2.8,
    gdpGrowth: 1.9
  },
  
  2002: {
    year: 2002,
    title: "Post-9/11 Uncertainty",
    description: "Economic uncertainty following September 11 attacks",
    economicContext: "Slow growth amid security concerns and tech crash aftermath",
    majorEvents: ["Post-9/11 security measures", "Corporate scandals", "Economic uncertainty"],
    inflationRate: 2.2,
    gdpGrowth: 2.9
  },
  
  2001: {
    year: 2001,
    title: "9/11 & Dot-Com Crash",
    description: "September 11 attacks and technology bubble burst",
    economicContext: "Economic shock from terrorist attacks and tech crash",
    majorEvents: ["September 11 attacks", "Dot-com bubble bursts", "Economic recession"],
    inflationRate: 2.5,
    gdpGrowth: 1.8
  },
  
  2000: {
    year: 2000,
    title: "Y2K & Dot-Com Peak",
    description: "Y2K transition and technology bubble at peak",
    economicContext: "Technology-driven economic boom at its peak",
    majorEvents: ["Y2K transition", "Dot-com bubble peak", "Strong economic growth"],
    inflationRate: 2.7,
    gdpGrowth: 5.2
  }
};

/**
 * Get context for a specific year
 */
export const getYearContext = (year: number): YearContext | null => {
  return yearContexts[year] || null;
};

/**
 * Get a brief description for a year (for dropdowns)
 */
export const getYearBriefDescription = (year: number): string => {
  const context = getYearContext(year);
  return context ? context.title : "";
};

/**
 * Get all available years with contexts
 */
export const getAvailableYears = (): number[] => {
  return Object.keys(yearContexts).map(Number).sort((a, b) => b - a);
};
