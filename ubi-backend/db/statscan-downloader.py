#!/usr/bin/env python3
"""
Statistics Canada Data Downloader for UBI Feasibility Analysis
Downloads essential economic and income data for 2000-2022
"""

import requests
import pandas as pd
import json
import time
import os
from typing import Dict, List, Optional
from urllib.parse import urljoin

class StatsCanaDataDownloader:
    def __init__(self, output_dir="statscan_data"):
        self.base_url = "https://www150.statcan.gc.ca/t1/wds/rest/"
        self.output_dir = output_dir
        self.session = requests.Session()

        # Create output directory in current working directory
        os.makedirs(self.output_dir, exist_ok=True)

        # Priority tables for UBI analysis
        self.priority_tables = {
            "income_by_age": {
                "pid": "11-10-0239-01",
                "name": "Income of individuals by age group, sex and income source",
                "description": "Core income distribution data"
            },
            "tax_filers": {
                "pid": "11-10-0008-01",
                "name": "Tax filers and dependents with income by total income, sex and age",
                "description": "Tax filer income distribution"
            },
            "gdp_data": {
                "pid": "36-10-0014-01",
                "name": "Gross domestic product, income-based",
                "description": "GDP for economic context"
            },
            "federal_finance": {
                "pid": "10-10-0005-01",
                "name": "Federal government revenue and expenditure",
                "description": "Federal budget data"
            },
            "provincial_finance": {
                "pid": "10-10-0020-01",
                "name": "Provincial and territorial government revenue and expenditure",
                "description": "Provincial budget data"
            },
            "inflation": {
                "pid": "18-10-0005-01",
                "name": "Consumer Price Index, annual average",
                "description": "Inflation data for real income calculations"
            }
        }

    def get_table_metadata(self, pid: str) -> Optional[Dict]:
        """Get metadata for a Statistics Canada table"""
        try:
            # Remove hyphens from PID for API call
            clean_pid = pid.replace("-", "")
            url = f"{self.base_url}getDatasetMetadata/{clean_pid}/en"

            print(f"Fetching metadata for {pid}...")
            response = self.session.get(url, timeout=30)

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Failed to get metadata for {pid}: {response.status_code}")
                return None

        except Exception as e:
            print(f"Error getting metadata for {pid}: {e}")
            return None

    def download_table_csv(self, pid: str, table_name: str) -> bool:
        """Download table data as CSV from Statistics Canada"""
        try:
            # Construct CSV download URL
            csv_url = f"https://www150.statcan.gc.ca/n1/tbl/csv/{pid.replace('-', '')}-eng.zip"

            print(f"Downloading {table_name} ({pid})...")
            print(f"URL: {csv_url}")

            response = self.session.get(csv_url, timeout=60)

            if response.status_code == 200:
                # Save the zip file
                filename = f"{pid.replace('-', '_')}_{table_name.replace(' ', '_')}.zip"
                filepath = os.path.join(self.output_dir, filename)

                with open(filepath, 'wb') as f:
                    f.write(response.content)

                print(f"✅ Downloaded: {filename}")
                return True
            else:
                print(f"❌ Failed to download {pid}: HTTP {response.status_code}")
                return False

        except Exception as e:
            print(f"❌ Error downloading {pid}: {e}")
            return False

    def download_priority_tables(self) -> Dict[str, bool]:
        """Download all priority tables for UBI analysis"""
        results = {}

        print("🚀 Starting Statistics Canada data download...")
        print(f"📁 Output directory: {self.output_dir}")
        print("="*60)

        for key, table_info in self.priority_tables.items():
            pid = table_info["pid"]
            name = table_info["name"]
            description = table_info["description"]

            print(f"\n📊 {description}")
            print(f"Table: {name}")

            # Download the table
            success = self.download_table_csv(pid, key)
            results[key] = success

            # Be nice to the server
            time.sleep(2)

        return results

    def generate_download_summary(self, results: Dict[str, bool]) -> None:
        """Generate a summary of download results"""
        print("\n" + "="*60)
        print("📋 DOWNLOAD SUMMARY")
        print("="*60)

        successful = []
        failed = []

        for key, success in results.items():
            table_info = self.priority_tables[key]
            if success:
                successful.append(f"✅ {key}: {table_info['name']}")
            else:
                failed.append(f"❌ {key}: {table_info['name']}")

        if successful:
            print("\n🎉 SUCCESSFUL DOWNLOADS:")
            for item in successful:
                print(f"  {item}")

        if failed:
            print("\n⚠️  FAILED DOWNLOADS:")
            for item in failed:
                print(f"  {item}")
            print("\n💡 Try downloading failed tables manually from:")
            print("   https://www150.statcan.gc.ca/")

        print(f"\n📁 Files saved to: {os.path.abspath(self.output_dir)}")
        print(f"📊 Success rate: {len(successful)}/{len(results)} tables")

    def create_manual_download_guide(self) -> None:
        """Create a guide for manual downloads if needed"""
        guide_path = os.path.join(self.output_dir, "manual_download_guide.md")

        with open(guide_path, 'w') as f:
            f.write("# Manual Download Guide for Statistics Canada Data\n\n")
            f.write("If automated downloads fail, use these direct links:\n\n")

            for key, table_info in self.priority_tables.items():
                pid = table_info["pid"]
                name = table_info["name"]
                description = table_info["description"]

                f.write(f"## {description}\n")
                f.write(f"**Table**: {name}\n")
                f.write(f"**PID**: {pid}\n")
                f.write(f"**URL**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid={pid.replace('-', '')}\n")
                f.write(f"**CSV Download**: Look for 'Download options' → 'Entire table (CSV)'\n\n")

        print(f"📖 Manual download guide created: {guide_path}")

def main():
    print("🧭 UBI Compass - Statistics Canada Data Downloader")
    print("="*60)

    # Create downloader
    downloader = StatsCanaDataDownloader()

    # Create manual download guide
    downloader.create_manual_download_guide()

    # Download priority tables
    results = downloader.download_priority_tables()

    # Generate summary
    downloader.generate_download_summary(results)

    print("\n🎯 Next Steps:")
    print("1. Extract downloaded ZIP files")
    print("2. Review CSV data structure")
    print("3. Run data processing scripts")
    print("4. Create SQL insert statements")
    print("\n🚀 Ready for Phase 1 data processing!")

if __name__ == "__main__":
    main()