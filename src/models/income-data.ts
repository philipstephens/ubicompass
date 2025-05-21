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
  taxpayersperdecile: number;  // Changed from taxpayersperquintile
  flattaxpercentage: number;
}

/**
 * Tax entry for a specific income decile
 */
export interface TaxEntry {
  entryid: number;
  decile: number;  // Changed from quintile (now 1-10)
  averagetaxableincome: number;
  mediantax: number;
  ubiid: number;
  // New fields for enhanced data
  lowerBound: number;
  upperBound: number;
  populationCount: number;
}

/**
 * Create mock decile data for testing
 * @param ubiId The UBI ID to associate with the entries
 * @returns An array of tax entries for each decile
 */
export function createMockDecileData(ubiId: number): TaxEntry[] {
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
      taxpayersperdecile: 3070,
      flattaxpercentage: 30,
    },
  ];
}
