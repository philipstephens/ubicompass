#!/usr/bin/env python3
"""
Statistics Canada Data Processor for UBI Analysis
Processes downloaded CSV files and creates SQL insert statements
"""

import os
import csv
import zipfile
import pandas as pd
from typing import Dict, List, Tuple
import re

class StatsCanaDataProcessor:
    def __init__(self, input_dir="statscan_data", output_dir="processed_data"):
        self.input_dir = input_dir
        self.output_dir = output_dir

        # Create output directory in current working directory
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Year range for UBI analysis
        self.target_years = list(range(2000, 2023))
        
    def extract_zip_files(self) -> List[str]:
        """Extract all ZIP files in the input directory"""
        extracted_files = []
        
        print("📦 Extracting ZIP files...")
        
        for filename in os.listdir(self.input_dir):
            if filename.endswith('.zip'):
                zip_path = os.path.join(self.input_dir, filename)
                extract_dir = os.path.join(self.input_dir, filename.replace('.zip', ''))
                
                try:
                    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                        zip_ref.extractall(extract_dir)
                        extracted_files.append(extract_dir)
                        print(f"✅ Extracted: {filename}")
                except Exception as e:
                    print(f"❌ Failed to extract {filename}: {e}")
        
        return extracted_files

    def find_csv_files(self) -> Dict[str, str]:
        """Find all CSV files in input directory"""
        csv_files = {}

        # Look for CSV files directly in the input directory
        for file in os.listdir(self.input_dir):
            if file.endswith('.csv'):
                full_path = os.path.join(self.input_dir, file)
                # Use the filename (without extension) as the key
                file_key = file.replace('.csv', '')
                csv_files[file_key] = full_path
                print(f"📄 Found CSV file: {file}")

        # Also check subdirectories (for extracted ZIP files)
        for root, dirs, files in os.walk(self.input_dir):
            for file in files:
                if file.endswith('.csv') and root != self.input_dir:
                    full_path = os.path.join(root, file)
                    # Use the directory name as the key
                    dir_name = os.path.basename(root)
                    csv_files[dir_name] = full_path
                    print(f"📄 Found CSV file in subdirectory: {file}")

        return csv_files

    def process_income_data(self, csv_path: str) -> str:
        """Process income distribution data"""
        print("💰 Processing income distribution data...")
        
        try:
            # Read the CSV file
            df = pd.read_csv(csv_path, encoding='utf-8')
            
            # Filter for target years
            df_filtered = df[df['REF_DATE'].isin(self.target_years)]
            
            # Create SQL insert statements
            sql_statements = []
            sql_statements.append("-- Income distribution data from Statistics Canada")
            sql_statements.append("CREATE TABLE IF NOT EXISTS income_distribution (")
            sql_statements.append("    year INT,")
            sql_statements.append("    age_group VARCHAR(50),")
            sql_statements.append("    income_source VARCHAR(100),")
            sql_statements.append("    sex VARCHAR(20),")
            sql_statements.append("    value DECIMAL(15,2),")
            sql_statements.append("    unit VARCHAR(50)")
            sql_statements.append(");")
            sql_statements.append("")
            
            # Process each row
            for _, row in df_filtered.iterrows():
                year = row['REF_DATE']
                age_group = str(row.get('Age group', '')).replace("'", "''")
                income_source = str(row.get('Income source', '')).replace("'", "''")
                sex = str(row.get('Sex', '')).replace("'", "''")
                value = row.get('VALUE', 0)
                unit = str(row.get('UOM', '')).replace("'", "''")
                
                if pd.notna(value) and value != 0:
                    sql_statements.append(
                        f"INSERT INTO income_distribution (year, age_group, income_source, sex, value, unit) "
                        f"VALUES ({year}, '{age_group}', '{income_source}', '{sex}', {value}, '{unit}');"
                    )
            
            # Save to file
            output_path = os.path.join(self.output_dir, "income_distribution.sql")
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(sql_statements))
            
            print(f"✅ Income data processed: {output_path}")
            return output_path
            
        except Exception as e:
            print(f"❌ Error processing income data: {e}")
            return ""

    def process_gdp_data(self, csv_path: str) -> str:
        """Process GDP data"""
        print("📈 Processing GDP data...")
        
        try:
            df = pd.read_csv(csv_path, encoding='utf-8')
            df_filtered = df[df['REF_DATE'].isin(self.target_years)]
            
            sql_statements = []
            sql_statements.append("-- GDP data from Statistics Canada")
            sql_statements.append("CREATE TABLE IF NOT EXISTS gdp_data (")
            sql_statements.append("    year INT,")
            sql_statements.append("    geography VARCHAR(100),")
            sql_statements.append("    gdp_component VARCHAR(100),")
            sql_statements.append("    value DECIMAL(15,2),")
            sql_statements.append("    unit VARCHAR(50)")
            sql_statements.append(");")
            sql_statements.append("")
            
            for _, row in df_filtered.iterrows():
                year = row['REF_DATE']
                geography = str(row.get('GEO', '')).replace("'", "''")
                component = str(row.get('Estimates', '')).replace("'", "''")
                value = row.get('VALUE', 0)
                unit = str(row.get('UOM', '')).replace("'", "''")
                
                if pd.notna(value) and value != 0:
                    sql_statements.append(
                        f"INSERT INTO gdp_data (year, geography, gdp_component, value, unit) "
                        f"VALUES ({year}, '{geography}', '{component}', {value}, '{unit}');"
                    )
            
            output_path = os.path.join(self.output_dir, "gdp_data.sql")
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(sql_statements))
            
            print(f"✅ GDP data processed: {output_path}")
            return output_path
            
        except Exception as e:
            print(f"❌ Error processing GDP data: {e}")
            return ""

    def process_government_finance(self, csv_path: str, table_type: str) -> str:
        """Process government finance data"""
        print(f"🏛️ Processing {table_type} finance data...")
        
        try:
            df = pd.read_csv(csv_path, encoding='utf-8')
            df_filtered = df[df['REF_DATE'].isin(self.target_years)]
            
            table_name = f"{table_type}_finance"
            sql_statements = []
            sql_statements.append(f"-- {table_type.title()} government finance data")
            sql_statements.append(f"CREATE TABLE IF NOT EXISTS {table_name} (")
            sql_statements.append("    year INT,")
            sql_statements.append("    geography VARCHAR(100),")
            sql_statements.append("    revenue_expenditure VARCHAR(100),")
            sql_statements.append("    component VARCHAR(200),")
            sql_statements.append("    value DECIMAL(15,2),")
            sql_statements.append("    unit VARCHAR(50)")
            sql_statements.append(");")
            sql_statements.append("")
            
            for _, row in df_filtered.iterrows():
                year = row['REF_DATE']
                geography = str(row.get('GEO', '')).replace("'", "''")
                rev_exp = str(row.get('Revenue and expenditure', '')).replace("'", "''")
                component = str(row.get('Components', '')).replace("'", "''")
                value = row.get('VALUE', 0)
                unit = str(row.get('UOM', '')).replace("'", "''")
                
                if pd.notna(value) and value != 0:
                    sql_statements.append(
                        f"INSERT INTO {table_name} (year, geography, revenue_expenditure, component, value, unit) "
                        f"VALUES ({year}, '{geography}', '{rev_exp}', '{component}', {value}, '{unit}');"
                    )
            
            output_path = os.path.join(self.output_dir, f"{table_name}.sql")
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(sql_statements))
            
            print(f"✅ {table_type.title()} finance data processed: {output_path}")
            return output_path
            
        except Exception as e:
            print(f"❌ Error processing {table_type} finance data: {e}")
            return ""

    def process_cpi_data(self, csv_path: str) -> str:
        """Process Consumer Price Index (inflation) data"""
        print("📊 Processing CPI/Inflation data...")

        try:
            df = pd.read_csv(csv_path, encoding='utf-8')
            df_filtered = df[df['REF_DATE'].isin(self.target_years)]

            sql_statements = []
            sql_statements.append("-- CPI/Inflation data from Statistics Canada")
            sql_statements.append("CREATE TABLE IF NOT EXISTS cpi_data (")
            sql_statements.append("    year INT,")
            sql_statements.append("    geography VARCHAR(100),")
            sql_statements.append("    products VARCHAR(200),")
            sql_statements.append("    value DECIMAL(8,2),")
            sql_statements.append("    unit VARCHAR(50)")
            sql_statements.append(");")
            sql_statements.append("")

            for _, row in df_filtered.iterrows():
                year = row['REF_DATE']
                geography = str(row.get('GEO', '')).replace("'", "''")
                products = str(row.get('Products and product groups', '')).replace("'", "''")
                value = row.get('VALUE', 0)
                unit = str(row.get('UOM', '')).replace("'", "''")

                if pd.notna(value) and value != 0:
                    sql_statements.append(
                        f"INSERT INTO cpi_data (year, geography, products, value, unit) "
                        f"VALUES ({year}, '{geography}', '{products}', {value}, '{unit}');"
                    )

            output_path = os.path.join(self.output_dir, "cpi_data.sql")
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(sql_statements))

            print(f"✅ CPI data processed: {output_path}")
            return output_path

        except Exception as e:
            print(f"❌ Error processing CPI data: {e}")
            return ""

    def process_tax_filer_data(self, csv_path: str) -> str:
        """Process tax filer income data"""
        print("💼 Processing tax filer data...")

        try:
            df = pd.read_csv(csv_path, encoding='utf-8')
            df_filtered = df[df['REF_DATE'].isin(self.target_years)]

            sql_statements = []
            sql_statements.append("-- Tax filer data from Statistics Canada")
            sql_statements.append("CREATE TABLE IF NOT EXISTS tax_filer_data (")
            sql_statements.append("    year INT,")
            sql_statements.append("    geography VARCHAR(100),")
            sql_statements.append("    age_group VARCHAR(50),")
            sql_statements.append("    sex VARCHAR(20),")
            sql_statements.append("    income_bracket VARCHAR(100),")
            sql_statements.append("    value DECIMAL(15,2),")
            sql_statements.append("    unit VARCHAR(50)")
            sql_statements.append(");")
            sql_statements.append("")

            for _, row in df_filtered.iterrows():
                year = row['REF_DATE']
                geography = str(row.get('GEO', '')).replace("'", "''")
                age_group = str(row.get('Age group', '')).replace("'", "''")
                sex = str(row.get('Sex', '')).replace("'", "''")
                income_bracket = str(row.get('Total income', '')).replace("'", "''")
                value = row.get('VALUE', 0)
                unit = str(row.get('UOM', '')).replace("'", "''")

                if pd.notna(value) and value != 0:
                    sql_statements.append(
                        f"INSERT INTO tax_filer_data (year, geography, age_group, sex, income_bracket, value, unit) "
                        f"VALUES ({year}, '{geography}', '{age_group}', '{sex}', '{income_bracket}', {value}, '{unit}');"
                    )

            output_path = os.path.join(self.output_dir, "tax_filer_data.sql")
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(sql_statements))

            print(f"✅ Tax filer data processed: {output_path}")
            return output_path

        except Exception as e:
            print(f"❌ Error processing tax filer data: {e}")
            return ""

    def create_summary_report(self, processed_files: List[str]) -> None:
        """Create a summary report of processed data"""
        report_path = os.path.join(self.output_dir, "processing_summary.md")
        
        with open(report_path, 'w') as f:
            f.write("# Statistics Canada Data Processing Summary\n\n")
            f.write(f"**Processing Date**: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Target Years**: {self.target_years[0]}-{self.target_years[-1]}\n\n")
            
            f.write("## Processed Files\n\n")
            for file_path in processed_files:
                if file_path:
                    filename = os.path.basename(file_path)
                    f.write(f"- ✅ {filename}\n")
            
            f.write("\n## Next Steps\n\n")
            f.write("1. Review generated SQL files for data quality\n")
            f.write("2. Import SQL files into PostgreSQL database\n")
            f.write("3. Create data validation queries\n")
            f.write("4. Build UBI feasibility calculation models\n")
            f.write("5. Integrate with UBI Compass application\n")
        
        print(f"📋 Summary report created: {report_path}")

    def process_all_data(self) -> None:
        """Process all downloaded Statistics Canada data"""
        print("🚀 Starting Statistics Canada data processing...")
        print("="*60)
        
        # Extract ZIP files
        extracted_dirs = self.extract_zip_files()
        
        # Find CSV files
        csv_files = self.find_csv_files()
        
        print(f"\n📊 Found {len(csv_files)} CSV files to process")
        
        processed_files = []
        
        # Process each type of data
        for file_key, csv_path in csv_files.items():
            print(f"\n🔄 Processing: {file_key}")

            if "income" in file_key.lower() or "11100239" in file_key:
                result = self.process_income_data(csv_path)
                processed_files.append(result)
            elif "gdp" in file_key.lower() or "36100014" in file_key:
                result = self.process_gdp_data(csv_path)
                processed_files.append(result)
            elif "federal" in file_key.lower() or "10100005" in file_key:
                result = self.process_government_finance(csv_path, "federal")
                processed_files.append(result)
            elif "provincial" in file_key.lower() or "10100020" in file_key:
                result = self.process_government_finance(csv_path, "provincial")
                processed_files.append(result)
            elif "cpi" in file_key.lower() or "inflation" in file_key.lower() or "18100005" in file_key:
                result = self.process_cpi_data(csv_path)
                processed_files.append(result)
            elif "tax_filers" in file_key.lower() or "11100008" in file_key:
                result = self.process_tax_filer_data(csv_path)
                processed_files.append(result)
            else:
                print(f"⚠️  Unknown data type for {file_key}, skipping...")
        
        # Create summary report
        self.create_summary_report(processed_files)
        
        print("\n" + "="*60)
        print("✅ Data processing complete!")
        print(f"📁 Processed files saved to: {os.path.abspath(self.output_dir)}")

def main():
    print("🧭 UBI Compass - Statistics Canada Data Processor")
    print("="*60)
    
    processor = StatsCanaDataProcessor()
    processor.process_all_data()
    
    print("\n🎯 Ready for database import and UBI analysis!")

if __name__ == "__main__":
    main()
