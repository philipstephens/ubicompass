#!/usr/bin/env python3
"""
Population Data Interpolator for Canada Census Data
Creates SQL insert statements for years 2000-2022 with interpolated values
"""

import csv
from typing import Dict, List, Tuple

class PopulationInterpolator:
    def __init__(self):
        # Census year codes to actual years mapping
        self.census_years = {2: 2002, 7: 2007, 12: 2012, 17: 2017, 22: 2022}
        # Target years 2000-2022 with their year codes
        self.target_years = {year: year - 2000 for year in range(2000, 2023)}
        self.census_data = {}  # {year_code: {age: population}}
        
    def load_census_data(self, filename: str) -> bool:
        """Load census data from CSV file"""
        try:
            with open(filename, 'r') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                
                for row in reader:
                    if len(row) != 3:
                        continue
                    
                    year_code = int(row[0])
                    age = int(row[1])
                    population = int(row[2])
                    
                    if year_code not in self.census_data:
                        self.census_data[year_code] = {}
                    
                    # Roll up ages > 99 into age 99
                    if age > 99:
                        if 99 not in self.census_data[year_code]:
                            self.census_data[year_code][99] = 0
                        self.census_data[year_code][99] += population
                    else:
                        self.census_data[year_code][age] = population
                        
            print(f"Loaded census data for years: {list(self.census_years[code] for code in self.census_data.keys())}")
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

def main():
    interpolator = PopulationInterpolator()
    
    # Load census data
    if not interpolator.load_census_data('population-age-id.csv'):
        print("Failed to load census data")
        return
    
    # Generate SQL file
    if interpolator.generate_sql_file('population-canada.sql'):
        print("Population interpolation completed successfully!")
    else:
        print("Failed to generate SQL file")

if __name__ == '__main__':
    main()
