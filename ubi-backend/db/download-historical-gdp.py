#!/usr/bin/env python3
"""
Download historical GDP data from Statistics Canada (2000-2019)
This will enable UBI analysis for years prior to 2020.
"""

import requests
import pandas as pd
import os
from datetime import datetime

def download_historical_gdp():
    """Download historical GDP data from Statistics Canada"""
    
    print("🏛️ Downloading Historical GDP Data (2000-2019)")
    print("="*60)
    
    # Statistics Canada GDP table
    table_id = "36-10-0014-01"
    base_url = "https://www150.statcan.gc.ca/t1/tbl1/en/dtl!downloadDbLoadingData-loadingData.action"
    
    # Parameters for the request
    params = {
        'pid': '3610001401',
        'selectedMembers': '[["1"],["1"],["1"]]',  # Canada, Current prices, Gross domestic product at market prices
        'checkedLevels': '',
        'refPeriods': '20000101,20191231',  # 2000-2019
        'dimensionLayouts': 'layout2',
        'vectorDisplay': 'false'
    }
    
    try:
        print(f"📡 Requesting data from Statistics Canada...")
        print(f"   Table: {table_id}")
        print(f"   Years: 2000-2019")
        
        # Make the request
        response = requests.get(base_url, params=params, timeout=30)
        response.raise_for_status()
        
        # Save raw response for debugging
        raw_filename = "statscan_data/gdp_historical_raw.csv"
        with open(raw_filename, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Raw data saved to: {raw_filename}")
        
        # Try to parse the CSV
        try:
            df = pd.read_csv(raw_filename, encoding='utf-8')
            print(f"📊 Data shape: {df.shape}")
            print(f"📋 Columns: {list(df.columns)}")
            
            if 'REF_DATE' in df.columns:
                years = sorted(df['REF_DATE'].unique())
                print(f"📅 Years found: {min(years)} - {max(years)} ({len(years)} years)")
                
                # Filter for our target years
                target_years = list(range(2000, 2020))
                available_years = [y for y in years if y in target_years]
                print(f"🎯 Target years available: {len(available_years)}/20")
                
                if available_years:
                    # Save processed data
                    processed_filename = "statscan_data/gdp_historical_2000_2019.csv"
                    historical_data = df[df['REF_DATE'].isin(target_years)]
                    historical_data.to_csv(processed_filename, index=False)
                    print(f"✅ Processed data saved to: {processed_filename}")
                    
                    return True
                else:
                    print("❌ No target years found in downloaded data")
                    return False
            else:
                print("❌ No REF_DATE column found in data")
                return False
                
        except Exception as parse_error:
            print(f"❌ Error parsing CSV: {parse_error}")
            print("💡 The file might be in a different format or require manual download")
            return False
            
    except requests.RequestException as e:
        print(f"❌ Error downloading data: {e}")
        print("💡 You may need to download this data manually from:")
        print("   https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610001401")
        return False

def manual_download_instructions():
    """Provide manual download instructions"""
    print("\n" + "="*60)
    print("📋 MANUAL DOWNLOAD INSTRUCTIONS")
    print("="*60)
    print("""
If automatic download failed, follow these steps:

1. 🌐 Visit: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610001401

2. 📊 Configure the table:
   - Geography: Canada
   - Prices: Current prices
   - Estimates: Gross domestic product at market prices
   - Reference period: 2000 to 2019

3. 💾 Download:
   - Click "Download options"
   - Select "Entire table (CSV)"
   - Save as: ubi-backend/db/statscan_data/gdp_historical_2000_2019.csv

4. 🔄 Re-run this script to verify the download

5. 📈 Update UBI Compass:
   - Run: python process-historical-data.py
   - Test: Access years 2008-2017 in UBI Compass
""")

def verify_existing_data():
    """Check if historical GDP data already exists"""
    
    files_to_check = [
        "statscan_data/gdp_historical_2000_2019.csv",
        "statscan_data/gdp_canada_36100014.csv"
    ]
    
    for filename in files_to_check:
        if os.path.exists(filename):
            try:
                df = pd.read_csv(filename, encoding='utf-8')
                if 'REF_DATE' in df.columns:
                    years = sorted(df['REF_DATE'].unique())
                    historical_years = [y for y in years if 2000 <= y <= 2019]
                    
                    if historical_years:
                        print(f"✅ Found historical data in {filename}")
                        print(f"   Years: {min(historical_years)} - {max(historical_years)} ({len(historical_years)} years)")
                        return True
                        
            except Exception as e:
                print(f"⚠️  Error reading {filename}: {e}")
    
    return False

def main():
    print("🧭 UBI Compass - Historical GDP Data Downloader")
    print("="*60)
    
    # Create directory if it doesn't exist
    os.makedirs("statscan_data", exist_ok=True)
    
    # Check if we already have the data
    if verify_existing_data():
        print("\n🎉 Historical GDP data already available!")
        print("💡 You can now analyze years 2008-2017 in UBI Compass")
        return
    
    # Try to download
    print("\n📡 Attempting automatic download...")
    success = download_historical_gdp()
    
    if success:
        print("\n🎉 SUCCESS!")
        print("✅ Historical GDP data downloaded successfully")
        print("💡 Next steps:")
        print("   1. Run: python process-historical-data.py")
        print("   2. Update UBI Compass database")
        print("   3. Test years 2008-2017 in UBI Compass")
    else:
        print("\n⚠️  Automatic download failed")
        manual_download_instructions()

if __name__ == "__main__":
    main()
