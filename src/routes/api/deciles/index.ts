import type { RequestHandler } from '@builder.io/qwik-city';
// Database temporarily disabled - using fallback data

export const onGet: RequestHandler = async ({ json, query }) => {
  try {
    const year = parseInt(query.get('year') || '2000');
    const beforeTax = query.get('beforeTax') !== 'false'; // Default to true

    console.log(`API: Returning fallback decile data for year ${year}, beforeTax: ${beforeTax}`);

    // Fallback decile data based on Canadian income distribution
    const fallbackDecileData = [
      { decile: 1, upperIncomeLimit: 15000, averageIncome: 8000, shareOfIncome: 2.1, taxPayers: 2800000 },
      { decile: 2, upperIncomeLimit: 25000, averageIncome: 20000, shareOfIncome: 3.8, taxPayers: 2800000 },
      { decile: 3, upperIncomeLimit: 35000, averageIncome: 30000, shareOfIncome: 5.2, taxPayers: 2800000 },
      { decile: 4, upperIncomeLimit: 45000, averageIncome: 40000, shareOfIncome: 6.4, taxPayers: 2800000 },
      { decile: 5, upperIncomeLimit: 55000, averageIncome: 50000, shareOfIncome: 7.6, taxPayers: 2800000 },
      { decile: 6, upperIncomeLimit: 68000, averageIncome: 61500, shareOfIncome: 9.1, taxPayers: 2800000 },
      { decile: 7, upperIncomeLimit: 85000, averageIncome: 76500, shareOfIncome: 11.2, taxPayers: 2800000 },
      { decile: 8, upperIncomeLimit: 110000, averageIncome: 97500, shareOfIncome: 14.1, taxPayers: 2800000 },
      { decile: 9, upperIncomeLimit: 155000, averageIncome: 132500, shareOfIncome: 18.8, taxPayers: 2800000 },
      { decile: 10, upperIncomeLimit: 500000, averageIncome: 225000, shareOfIncome: 21.7, taxPayers: 2800000 }
    ];

    // Transform the data to match your chart format
    const transformedData = fallbackDecileData.map(row => ({
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
      totalTaxpayers: 28000000, // Fallback total taxpayers
      deciles: transformedData
    });

  } catch (error) {
    console.error('API error:', error);
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
