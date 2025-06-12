#!/usr/bin/env python3
"""
Population Data Interpolator for Canada Census Data
Creates SQL insert statements for years 2000-2022 with interpolated values
"""

import csv
from typing import Dict, List, Tuple

class PopulationInterpolator:
    def __init__(self, round_to_thousands=False):
        # Census year codes to actual years mapping
        self.census_years = {2: 2002, 7: 2007, 12: 2012, 17: 2017, 22: 2022}
        # Target years 2000-2022 with their year codes
        self.target_years = {year: year - 2000 for year in range(2000, 2023)}
        self.census_data = {}  # {year_code: {age: population}}
        self.round_to_thousands = round_to_thousands

    def round_population(self, population: int) -> int:
        """Round population to nearest 1000 if rounding is enabled"""
        if self.round_to_thousands:
            return round(population / 1000) * 1000
        return population
        
    def load_census_data(self, filename: str) -> bool:
        try:
            with open(filename, 'r') as file:
                reader = csv.reader(file, delimiter=';')  # Use semicolon delimiter
                header = next(reader)
                print(f"CSV Header: {header}")  # DEBUG
                
                row_count = 0  # Initialize row counter
                for i, row in enumerate(reader):
                    row_count += 1  # Count rows processed

                    if i < 5:  # Show first 5 data rows
                        print(f"Row {i}: {row}")

                    if len(row) != 3:
                        continue

                    try:  # Move try inside the loop
                        year_code = int(row[0])
                        age = int(row[1])
                        population = int(row[2])

                        print(f"Processing: year_code={year_code}, age={age}, pop={population}")  # DEBUG

                        if year_code not in self.census_data:
                            self.census_data[year_code] = {}

                        # Apply rounding if enabled
                        population = self.round_population(population)

                        # Roll up ages > 99 into age 99
                        if age > 99:
                            if 99 not in self.census_data[year_code]:
                                self.census_data[year_code][99] = 0
                            self.census_data[year_code][99] += population
                        else:
                            self.census_data[year_code][age] = population

                    except ValueError as e:
                        print(f"ValueError processing row {row}: {e}")  # DEBUG
                        continue

            print(f"Total rows processed: {row_count}")  # DEBUG
            print(f"Census data keys: {list(self.census_data.keys())}")  # DEBUG
                
            return True
        
        except Exception as e:
            print(f"Error loading census data: {e}")
            return False
    
    def calculate_population_step(self, year1_code: int, year2_code: int, age: int) -> float:
        """Calculate population step between two census years for a specific age"""
        if (year1_code not in self.census_data or 
            year2_code not in self.census_data or
            age not in self.census_data[year1_code] or 
            age not in self.census_data[year2_code]):
            return 0.0
        
        pop1 = self.census_data[year1_code][age]
        pop2 = self.census_data[year2_code][age]
        year_diff = self.census_years[year2_code] - self.census_years[year1_code]
        
        return (pop2 - pop1) / year_diff if year_diff > 0 else 0.0
    
    def interpolate_population(self, target_year: int, age: int) -> int:
        """Interpolate population for a specific year and age"""
        target_year_code = self.target_years[target_year]
        
        # If it's a census year, return actual data
        for census_code, census_year in self.census_years.items():
            if target_year == census_year and age in self.census_data.get(census_code, {}):
                return self.census_data[census_code][age]
        
        # Find the appropriate census years for interpolation
        if target_year < 2002:
            # Use 2002-2007 step, extrapolate backwards
            step = self.calculate_population_step(2, 7, age)
            base_pop = self.census_data.get(2, {}).get(age, 0)
            years_diff = target_year - 2002
            return max(0, int(base_pop + (step * years_diff)))
            
        elif target_year > 2022:
            # Use 2017-2022 step, extrapolate forwards
            step = self.calculate_population_step(17, 22, age)
            base_pop = self.census_data.get(22, {}).get(age, 0)
            years_diff = target_year - 2022
            return max(0, int(base_pop + (step * years_diff)))
            
        else:
            # Interpolate between census years
            # Find surrounding census years
            prev_census = None
            next_census = None
            
            for census_code, census_year in sorted(self.census_years.items()):
                if census_year <= target_year:
                    prev_census = census_code
                elif census_year > target_year and next_census is None:
                    next_census = census_code
                    break
            
            if prev_census and next_census:
                step = self.calculate_population_step(prev_census, next_census, age)
                base_pop = self.census_data.get(prev_census, {}).get(age, 0)
                years_diff = target_year - self.census_years[prev_census]
                return max(0, int(base_pop + (step * years_diff)))
            elif prev_census:
                # Only previous census available
                return self.census_data.get(prev_census, {}).get(age, 0)
            else:
                return 0
    
    def calculate_age_0_checksum(self, target_year: int) -> int:
        """Calculate age 0 as sum of all ages 1-99 for checksum"""
        total = 0
        for age in range(1, 100):
            total += self.interpolate_population(target_year, age)
        return total

    def verify_census_checksums(self):
        """Verify that Age 0 equals sum of ages 1-99 for each census year"""
        print("\n=== CENSUS CHECKSUM VERIFICATION ===")

        for census_code, census_year in sorted(self.census_years.items()):
            if census_code in self.census_data:
                # Get Age 0 value (total population)
                age_0_value = self.census_data[census_code].get(0, 0)

                # Calculate sum of ages 1-99
                sum_ages_1_to_99 = 0
                for age in range(1, 100):
                    if age in self.census_data[census_code]:
                        sum_ages_1_to_99 += self.census_data[census_code][age]

                # Calculate difference
                difference = age_0_value - sum_ages_1_to_99
                percentage_diff = (difference / age_0_value * 100) if age_0_value > 0 else 0

                # Status
                status = "✅ MATCH" if abs(difference) < 1000 else "❌ MISMATCH"

                print(f"Year {census_year} (code {census_code}): {status}")
                print(f"  Age 0 (total): {age_0_value:,}")
                print(f"  Sum ages 1-99: {sum_ages_1_to_99:,}")
                print(f"  Difference: {difference:,} ({percentage_diff:.2f}%)")
                print(f"  Ages available: {len([age for age in range(1, 100) if age in self.census_data[census_code]])}")
                print()

        return True
    
    def generate_sql_file(self, output_filename: str) -> bool:
        """Generate SQL insert statements for all years and ages"""
        try:
            with open(output_filename, 'w') as file:
                file.write("-- Population data for Canada (2000-2022)\n")
                file.write("-- Generated from census data with interpolation\n\n")
                
                for year in range(2000, 2023):
                    year_code = self.target_years[year]
                    
                    # Calculate age 0 (checksum)
                    age_0_population = self.calculate_age_0_checksum(year)
                    file.write(f'INSERT INTO populations ("yearStatsId", "age", "population") VALUES ({year_code}, 0, {age_0_population});\n')
                    
                    # Generate for ages 1-99
                    for age in range(1, 100):
                        population = self.interpolate_population(year, age)
                        file.write(f'INSERT INTO populations ("yearStatsId", "age", "population") VALUES ({year_code}, {age}, {population});\n')
                    
                    file.write(f"\n-- End of data for year {year} (code {year_code})\n\n")
                
            print(f"SQL file generated: {output_filename}")
            return True
            
        except Exception as e:
            print(f"Error generating SQL file: {e}")
            return False
    
    def verify_checksums(self):
        """Verify that calculated checksums match original census data"""
        print("\n=== CHECKSUM VERIFICATION ===")
        
        for census_code, census_year in self.census_years.items():
            if census_code in self.census_data and 0 in self.census_data[census_code]:
                # Original Age 0 from census
                original_age_0 = self.census_data[census_code][0]
                
                # Calculate sum of ages 1-99 for this census year
                calculated_sum = 0
                for age in range(1, 100):
                    if age in self.census_data[census_code]:
                        calculated_sum += self.census_data[census_code][age]
                
                # Compare
                difference = original_age_0 - calculated_sum
                percentage_diff = (difference / original_age_0) * 100 if original_age_0 > 0 else 0
                
                print(f"Year {census_year} (code {census_code}):")
                print(f"  Original Age 0: {original_age_0:,}")
                print(f"  Sum of Ages 1-99: {calculated_sum:,}")
                print(f"  Difference: {difference:,} ({percentage_diff:.2f}%)")
                print()
def main():
    print("=== Testing WITHOUT rounding ===")
    interpolator = PopulationInterpolator(round_to_thousands=False)

    # Load census data
    if not interpolator.load_census_data('population-age-id.csv'):
        print("Failed to load census data")
        return

    # Verify checksums for census years
    interpolator.verify_census_checksums()

    print("\n" + "="*50)
    print("=== Testing WITH rounding to nearest 1,000 ===")
    interpolator_rounded = PopulationInterpolator(round_to_thousands=True)

    # Load census data with rounding
    if not interpolator_rounded.load_census_data('population-age-id.csv'):
        print("Failed to load census data")
        return

    # Verify checksums for census years with rounding
    interpolator_rounded.verify_census_checksums()

    # Generate SQL file (use rounded version if checksums are better)
    print("\n" + "="*50)
    print("=== Generating SQL file ===")
    if interpolator_rounded.generate_sql_file('population-canada.sql'):
        print("Population interpolation completed successfully!")
    else:
        print("Failed to generate SQL file")
        
    # Add this to your main() function before generating SQL:
    interpolator.verify_checksums()

if __name__ == '__main__':
    main()
