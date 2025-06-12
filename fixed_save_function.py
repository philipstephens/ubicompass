import csv

def saveRolledArray(rolledArray):
    """
    Saves the rolled array to 'population-age-id.csv' file.
    Args:
        rolledArray: List of lists containing [ID, age, population] data
    Returns:
        bool: True if successful, False if error occurred
    """
    try:
        with open('population-age-id.csv', 'w', newline='') as outFile:
            writer = csv.writer(outFile)
            
            # Optional: Write header row
            writer.writerow(['ID', 'Age', 'Population'])
            
            # Write data rows
            for line in rolledArray:
                writer.writerow(line)
        
        print('*** population-age-id.csv has been saved. ***')
        return True
        
    except Exception as e:
        print(f"An error occurred while saving file: {e}")
        return False

# Alternative version without CSV writer (if you prefer manual formatting)
def saveRolledArrayManual(rolledArray):
    """
    Saves the rolled array to 'population-age-id.csv' file using manual formatting.
    Args:
        rolledArray: List of lists containing [ID, age, population] data
    Returns:
        bool: True if successful, False if error occurred
    """
    try:
        with open('population-age-id.csv', 'w') as outFile:
            # Optional: Write header
            outFile.write('ID,Age,Population\n')
            
            # Write data rows
            for line in rolledArray:
                # Convert list to comma-separated string
                csv_line = ','.join(str(item) for item in line)
                outFile.write(csv_line + '\n')
        
        print('*** population-age-id.csv has been saved. ***')
        return True
        
    except Exception as e:
        print(f"An error occurred while saving file: {e}")
        return False

# Example usage
if __name__ == '__main__':
    # Sample data
    sample_data = [
        [1, 25, 1000],
        [1, 99, 500],  # Rolled up 99+ ages
        [2, 30, 1200],
        [2, 99, 300]
    ]
    
    # Test the function
    success = saveRolledArray(sample_data)
    if success:
        print("File saved successfully!")
    else:
        print("Failed to save file!")
