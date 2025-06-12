# strStartSQL = "INSERT INTO POPULATIONS ('yearStatsId', 'age', 'population') VALUES ("
# censusIds = [2, 7, 12, 17, 22]
# fileInput = open("population-sorted.txt")
# fileOutput = "population-table.sql"

import csv

def getPopArray():
    popArray = []
    
    try:
        with open('population-id-age.csv', 'r') as inFile:
            reader = csv.reader(inFile)
            
            # Skip the header row explicitly
            next(reader, None)  # ← Skip first row (header)
            
            for row in reader:
                # Skip rows with invalid format
                if len(row) != 3:
                    continue
                
                # Check if age field is empty (but allow "0")
                if row[1] == '':
                    continue
                    
                try:
                    age = int(row[1])
                    total = int(row[2])
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

def rollupAge99(popArray):
    if not popArray:
        return []

    fixedArray = []
    
    try:
        # CRITICAL: Sort by ID first, then by age
        popArray.sort(key=lambda x: (x[0], x[1]))  # Sort by ID, then age
        
        print(f"First 10 sorted entries: {popArray[:10]}")  # Debug print
        
        line_number = 0
        while line_number < len(popArray):
            currentId = popArray[line_number][0]
            total_sum_99_plus = 0
            
            print(f"Processing ID: {currentId}")  # Debug print
            
            # Process ALL entries with the same ID
            while line_number < len(popArray) and popArray[line_number][0] == currentId:
                age = popArray[line_number][1]
                value = popArray[line_number][2]
                
                print(f"  Processing age {age}, value {value}")  # Debug print
                
                if age < 99:
                    fixedArray.append([currentId, age, value])
                else:
                    total_sum_99_plus += value
                
                line_number += 1
            
            # Add consolidated 99+ entry if needed
            if total_sum_99_plus > 0:
                fixedArray.append([currentId, 99, total_sum_99_plus])
                print(f"  Added 99+ rollup: {total_sum_99_plus}")  # Debug print
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []
    
    return fixedArray

def saveRolledArray(rolledArray):
	try:
		with open('population-age-id.csv', 'w', newline='') as outFile:
			writer = csv.writer(outFile)
			for line in rolledArray:
				writer.writerow(line)

		print('*** population-age-id.csv has been saved. ***')
		return True

	except Exception as e:
		print(f"An error occurred: {e}")
		return False

def main():
    popArray = getPopArray()
    print(f"Original data loaded: {len(popArray)} entries")
    
    # Check if ID 2, Age 0 exists in original data
    id2_age0 = [line for line in popArray if line[0] == 2 and line[1] == 0]
    print(f"ID 2, Age 0 in original data: {id2_age0}")
    
    fixedArray = rollupAge99(popArray)
    
    # Check if ID 2, Age 0 exists in processed data
    id2_age0_fixed = [line for line in fixedArray if line[0] == 2 and line[1] == 0]
    print(f"ID 2, Age 0 in processed data: {id2_age0_fixed}")
    
    return fixedArray

if __name__ == '__main__':
	main()
