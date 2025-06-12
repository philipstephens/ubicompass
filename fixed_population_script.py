# Fixed Python script for processing population data with age rollup
import csv

def getPopArray():
    """
    Reads 'population-id-age.csv' and returns a list of lists, where each inner list
    contains [ID, age, total]. Skips headers and invalid entries.
    Returns an empty list if the file is not found or an error occurs.
    """
    popArray = []
    
    try:
        with open('population-id-age.csv', 'r') as inFile:
            reader = csv.reader(inFile)
            for row in reader:
                # Skip header rows or rows with invalid format
                if len(row) != 3 or row[0] == 'Year Code' or not row[1]:
                    continue
                # Ensure age and total are valid integers
                try:
                    age = int(row[1])
                    total = int(row[2])
                    # Convert ID to int for consistent sorting
                    id_val = int(row[0])
                    popArray.append([id_val, age, total])
                except ValueError:
                    print(f"Skipping invalid row: {row}")
                    continue
    
    except FileNotFoundError:
        print("Error: The file 'population-id-age.csv' was not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []
    
    return popArray

def rollupKey(line1):
    """Sort by id then by age"""
    return (line1[0], line1[1])
    
def rollupAge99(popArray):
    """
    Processes popArray to group entries by ID, keeping entries with age < 99,
    and consolidating entries with age >= 99 into a single entry per ID with summed totals.
    Args:
        popArray: List of lists, where each inner list is [ID, age, total].
    Returns:
        List of lists with processed entries.
    """
    if not popArray:
        return []

    # Initialize the output array
    fixedArray = []
    
    try:
        # Sort popArray by ID (asc), age (asc)
        popArray.sort(key=rollupKey)
        
        line_number = 0
        while line_number < len(popArray):
            currentId = popArray[line_number][0]  # Already int from getPopArray
            total_sum_99_plus = 0
            
            # Process entries with the same ID
            while line_number < len(popArray) and popArray[line_number][0] == currentId:
                age = popArray[line_number][1]
                value = popArray[line_number][2]
                
                if age < 99:
                    # Keep entries with age < 99 as-is
                    fixedArray.append([currentId, age, value])
                else:
                    # Accumulate values for age >= 99
                    total_sum_99_plus += value
                
                line_number += 1
            
            # If there were entries with age >= 99, add consolidated entry
            if total_sum_99_plus > 0:
                fixedArray.append([currentId, 99, total_sum_99_plus])
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []
    
    return fixedArray

def main():
    popArray = getPopArray()
    print(f"Original data loaded: {len(popArray)} entries")
    
    # FIXED: Actually use the returned value from rollupAge99
    fixedArray = rollupAge99(popArray)
    print(f"Processed data: {len(fixedArray)} entries")
    
    # Print sample of results
    print("\nSample of processed data:")
    for i, line in enumerate(fixedArray[:10]):  # Show first 10 entries
        print(f"ID: {line[0]}, Age: {line[1]}, Population: {line[2]}")
    
    if len(fixedArray) > 10:
        print(f"... and {len(fixedArray) - 10} more entries")
    
    # Check for any ages > 99 (should be none)
    ages_over_99 = [line for line in fixedArray if line[1] > 99]
    if ages_over_99:
        print(f"\nWARNING: Found {len(ages_over_99)} entries with age > 99:")
        for line in ages_over_99:
            print(f"  ID: {line[0]}, Age: {line[1]}, Population: {line[2]}")
    else:
        print("\n✅ SUCCESS: No entries with age > 99 found!")
    
    return fixedArray

if __name__ == '__main__':
    main()
