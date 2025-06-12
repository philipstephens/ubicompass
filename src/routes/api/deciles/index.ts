import type { RequestHandler } from '@builder.io/qwik-city';
import { getDecileDataForYear, getAvailableYears } from '~/lib/db';

export const onGet: RequestHandler = async ({ json, query }) => {
  try {
    const year = parseInt(query.get('year') || '2000');
    const beforeTax = query.get('beforeTax') !== 'false'; // Default to true

    console.log(`API: Fetching decile data for year ${year}, beforeTax: ${beforeTax}`);
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

    const decileData = await getDecileDataForYear(year, beforeTax);
    console.log(`API: Retrieved ${decileData.length} records`);
    
    // Transform the data to match your chart format
    const transformedData = decileData.map(row => ({
      decile: row.decile,
      lowerBound: row.decile === 1 ? 0 : null, // We'll calculate this from previous decile
      upperBound: row.upperIncomeLimit,
      averageTaxableIncome: row.averageIncome,
      shareOfIncome: row.shareOfIncome,
      taxpayers: Math.round(row.taxPayers / 10), // Divide total taxpayers by 10 deciles
      label: getDecileLabel(row.decile)
    }));
    
    // Calculate lower bounds from upper bounds of previous deciles
    for (let i = 1; i < transformedData.length; i++) {
      transformedData[i].lowerBound = transformedData[i - 1].upperBound;
    }
    
    json(200, {
      year,
      beforeTax,
      totalTaxpayers: decileData[0]?.taxPayers || 0,
      deciles: transformedData
    });
    
  } catch (error) {
    console.error('Database error:', error);
    json(500, { 
      error: 'Failed to fetch decile data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Removed POST endpoint - use /api/years instead for available years

function getDecileLabel(decile: number): string {
  switch (decile) {
    case 1: return "Lowest 10%";
    case 2: return "10-20%";
    case 3: return "20-30%";
    case 4: return "30-40%";
    case 5: return "40-50%";
    case 6: return "50-60%";
    case 7: return "60-70%";
    case 8: return "70-80%";
    case 9: return "80-90%";
    case 10: return "Highest 10%";
    default: return `Decile ${decile}`;
  }
}
