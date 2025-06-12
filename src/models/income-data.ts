/**
 * Data models for income distribution data
 */

/**
 * Year metadata for UBI calculations
 */
export interface YearMetaData {
  ubiid: number;
  taxyear: number;
  ubiamount: number;
  taxpayersperquintile?: number;  // For quintile-based calculations
  taxpayersperdecile?: number;    // For decile-based calculations
  flattaxpercentage: number;
}

/**
 * Base tax entry interface
 */
export interface BaseTaxEntry {
  entryid: number;
  averagetaxableincome: number;
  mediantax: number;
  ubiid: number;
  // Enhanced data fields
  lowerBound?: number;
  upperBound?: number;
  populationCount?: number;
}

/**
 * Quintile-based tax entry
 */
export interface QuintileTaxEntry extends BaseTaxEntry {
  quintile: number;  // 1-5
}

/**
 * Decile-based tax entry
 */
export interface DecileTaxEntry extends BaseTaxEntry {
  decile: number;  // 1-10
}

/**
 * Union type for tax entries
 */
export type TaxEntry = QuintileTaxEntry | DecileTaxEntry;

/**
 * Create mock quintile data for testing
 * @param ubiId The UBI ID to associate with the entries
 * @returns An array of quintile tax entries
 */
export function createMockQuintileData(ubiId: number): QuintileTaxEntry[] {
  return [
    {
      entryid: 1,
      quintile: 1,
      averagetaxableincome: 10,
      mediantax: 0,
      ubiid: ubiId,
      lowerBound: 0,
      upperBound: 20,
      populationCount: 6140,
    },
    {
      entryid: 2,
      quintile: 2,
      averagetaxableincome: 30,
      mediantax: 2,
      ubiid: ubiId,
      lowerBound: 20,
      upperBound: 40,
      populationCount: 6140,
    },
    {
      entryid: 3,
      quintile: 3,
      averagetaxableincome: 50,
      mediantax: 5.5,
      ubiid: ubiId,
      lowerBound: 40,
      upperBound: 60,
      populationCount: 6140,
    },
    {
      entryid: 4,
      quintile: 4,
      averagetaxableincome: 75,
      mediantax: 11,
      ubiid: ubiId,
      lowerBound: 60,
      upperBound: 100,
      populationCount: 6140,
    },
    {
      entryid: 5,
      quintile: 5,
      averagetaxableincome: 200,
      mediantax: 35,
      ubiid: ubiId,
      lowerBound: 100,
      upperBound: 500,
      populationCount: 6140,
    },
  ];
}

/**
 * Create mock decile data for testing
 * @param ubiId The UBI ID to associate with the entries
 * @returns An array of decile tax entries
 */
export function createMockDecileData(ubiId: number): DecileTaxEntry[] {
  return [
    {
      entryid: 1,
      decile: 1,
      averagetaxableincome: 5,
      mediantax: 0,
      ubiid: ubiId,
      lowerBound: 0,
      upperBound: 10,
      populationCount: 3070,
    },
    {
      entryid: 2,
      decile: 2,
      averagetaxableincome: 15,
      mediantax: 0,
      ubiid: ubiId,
      lowerBound: 10,
      upperBound: 20,
      populationCount: 3070,
    },
    {
      entryid: 3,
      decile: 3,
      averagetaxableincome: 25,
      mediantax: 1,
      ubiid: ubiId,
      lowerBound: 20,
      upperBound: 30,
      populationCount: 3070,
    },
    {
      entryid: 4,
      decile: 4,
      averagetaxableincome: 35,
      mediantax: 3,
      ubiid: ubiId,
      lowerBound: 30,
      upperBound: 40,
      populationCount: 3070,
    },
    {
      entryid: 5,
      decile: 5,
      averagetaxableincome: 45,
      mediantax: 5,
      ubiid: ubiId,
      lowerBound: 40,
      upperBound: 50,
      populationCount: 3070,
    },
    {
      entryid: 6,
      decile: 6,
      averagetaxableincome: 55,
      mediantax: 6,
      ubiid: ubiId,
      lowerBound: 50,
      upperBound: 60,
      populationCount: 3070,
    },
    {
      entryid: 7,
      decile: 7,
      averagetaxableincome: 65,
      mediantax: 8,
      ubiid: ubiId,
      lowerBound: 60,
      upperBound: 70,
      populationCount: 3070,
    },
    {
      entryid: 8,
      decile: 8,
      averagetaxableincome: 85,
      mediantax: 14,
      ubiid: ubiId,
      lowerBound: 70,
      upperBound: 100,
      populationCount: 3070,
    },
    {
      entryid: 9,
      decile: 9,
      averagetaxableincome: 120,
      mediantax: 22,
      ubiid: ubiId,
      lowerBound: 100,
      upperBound: 150,
      populationCount: 3070,
    },
    {
      entryid: 10,
      decile: 10,
      averagetaxableincome: 280,
      mediantax: 48,
      ubiid: ubiId,
      lowerBound: 150,
      upperBound: 500,
      populationCount: 3070,
    },
  ];
}

/**
 * Create mock year metadata for testing
 * @returns An array of year metadata
 */
export function createMockYearData(): YearMetaData[] {
  return [
    {
      ubiid: 1,
      taxyear: 2022,
      ubiamount: 2000,
      taxpayersperquintile: 6140,
      taxpayersperdecile: 3070,
      flattaxpercentage: 30,
    },
  ];
}

/**
 * Check if a tax entry is a quintile entry
 */
export function isQuintileEntry(entry: TaxEntry): entry is QuintileTaxEntry {
  return 'quintile' in entry;
}

/**
 * Check if a tax entry is a decile entry
 */
export function isDecileEntry(entry: TaxEntry): entry is DecileTaxEntry {
  return 'decile' in entry;
}

/**
 * Get the group number (quintile or decile) from a tax entry
 */
export function getGroupNumber(entry: TaxEntry): number {
  if (isQuintileEntry(entry)) {
    return entry.quintile;
  } else if (isDecileEntry(entry)) {
    return entry.decile;
  }
  return 0;
}

/**
 * Get the description for a quintile
 */
export function getQuintileDescription(quintile: number): string {
  switch (quintile) {
    case 1:
      return "Lowest 20%";
    case 2:
      return "20-40%";
    case 3:
      return "40-60%";
    case 4:
      return "60-80%";
    case 5:
      return "Highest 20%";
    default:
      return "";
  }
}

/**
 * Get the description for a decile
 */
export function getDecileDescription(decile: number): string {
  switch (decile) {
    case 1:
      return "Lowest 10%";
    case 2:
      return "10-20%";
    case 3:
      return "20-30%";
    case 4:
      return "30-40%";
    case 5:
      return "40-50%";
    case 6:
      return "50-60%";
    case 7:
      return "60-70%";
    case 8:
      return "70-80%";
    case 9:
      return "80-90%";
    case 10:
      return "Highest 10%";
    default:
      return "";
  }
}

/**
 * Get the description for a group (quintile or decile)
 */
export function getGroupDescription(entry: TaxEntry): string {
  if (isQuintileEntry(entry)) {
    return getQuintileDescription(entry.quintile);
  } else if (isDecileEntry(entry)) {
    return getDecileDescription(entry.decile);
  }
  return "";
}
