#!/usr/bin/env python3
"""
Check data coverage for imported Statistics Canada data
"""

import os
import pandas as pd

def check_csv_coverage():
    """Check year coverage in CSV files"""
    print("🔍 Checking Data Coverage in CSV Files")
    print("="*50)
    
    csv_files = {
        "Income Distribution": "statscan_data/income_by_age_11100239.csv",
        "GDP Data": "statscan_data/gdp_canada_36100014.csv", 
        "Federal Finance": "statscan_data/federal_finance_10100005.csv",
        "Provincial Finance": "statscan_data/provincial_finance_10100020.csv",
        "CPI/Inflation": "statscan_data/cpi_inflation_18100005.csv",
        "Tax Filers": "statscan_data/tax_filers_11100008.csv"
    }
    
    coverage_summary = {}
    
    for name, filepath in csv_files.items():
        if os.path.exists(filepath):
            try:
                print(f"\n📊 {name}:")
                df = pd.read_csv(filepath, encoding='utf-8')
                
                if 'REF_DATE' in df.columns:
                    years = sorted(df['REF_DATE'].unique())
                    min_year = min(years)
                    max_year = max(years)
                    total_years = len(years)
                    
                    print(f"   📅 Years: {min_year} - {max_year}")
                    print(f"   📈 Total years: {total_years}")
                    print(f"   📋 Sample years: {years[:5]}{'...' if len(years) > 5 else ''}")
                    
                    coverage_summary[name] = {
                        'min_year': min_year,
                        'max_year': max_year,
                        'total_years': total_years,
                        'years': years
                    }
                    
                    # Check for gaps
                    expected_years = list(range(min_year, max_year + 1))
                    missing_years = [y for y in expected_years if y not in years]
                    if missing_years:
                        print(f"   ⚠️  Missing years: {missing_years}")
                    else:
                        print(f"   ✅ Complete coverage: {min_year}-{max_year}")
                        
                else:
                    print(f"   ❌ No REF_DATE column found")
                    
            except Exception as e:
                print(f"   ❌ Error reading file: {e}")
        else:
            print(f"\n❌ {name}: File not found - {filepath}")
    
    return coverage_summary

def generate_coverage_report(coverage_summary):
    """Generate a coverage report"""
    print("\n" + "="*50)
    print("📋 DATA COVERAGE SUMMARY")
    print("="*50)
    
    # Find overall coverage
    all_years = set()
    for data in coverage_summary.values():
        all_years.update(data['years'])
    
    if all_years:
        overall_min = min(all_years)
        overall_max = max(all_years)
        print(f"\n🎯 Overall Coverage: {overall_min} - {overall_max}")
        
        # Check coverage by year
        print(f"\n📊 Year-by-Year Coverage:")
        for year in range(overall_min, overall_max + 1):
            datasets_with_year = []
            for name, data in coverage_summary.items():
                if year in data['years']:
                    datasets_with_year.append(name)
            
            coverage_count = len(datasets_with_year)
            total_datasets = len(coverage_summary)
            
            if coverage_count == total_datasets:
                status = "✅ Complete"
            elif coverage_count >= total_datasets * 0.7:
                status = "🟡 Good"
            elif coverage_count >= total_datasets * 0.4:
                status = "🟠 Partial"
            else:
                status = "🔴 Limited"
                
            print(f"   {year}: {coverage_count}/{total_datasets} datasets {status}")
    
    # Recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    print("="*30)
    
    # Find best coverage period
    year_counts = {}
    for year in all_years:
        count = sum(1 for data in coverage_summary.values() if year in data['years'])
        year_counts[year] = count
    
    if year_counts:
        best_years = [year for year, count in year_counts.items() if count == max(year_counts.values())]
        best_start = min(best_years)
        best_end = max(best_years)
        
        print(f"🎯 Best coverage period: {best_start}-{best_end}")
        print(f"   ({max(year_counts.values())}/{len(coverage_summary)} datasets available)")
        
        # UBI analysis recommendations
        if best_start <= 2010 and best_end >= 2020:
            print(f"✅ Excellent for UBI analysis (covers pre/post 2008 crisis + recent years)")
        elif best_start <= 2015 and best_end >= 2020:
            print(f"🟡 Good for UBI analysis (covers recent economic trends)")
        else:
            print(f"🟠 Limited for historical analysis, but usable for current policy")

def main():
    print("🧭 UBI Compass - Data Coverage Analysis")
    print("="*50)
    
    # Check CSV coverage
    coverage = check_csv_coverage()
    
    # Generate report
    if coverage:
        generate_coverage_report(coverage)
        
        print(f"\n🚀 NEXT STEPS:")
        print("1. Focus UBI analysis on years with best coverage")
        print("2. Use interpolation for missing years if needed")
        print("3. Consider downloading additional historical data if required")
        print("4. Proceed with database import for available years")
    else:
        print("❌ No data found to analyze")

if __name__ == "__main__":
    main()
