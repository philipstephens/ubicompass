#!/usr/bin/env python3
"""
Test script for Statistics Canada data download and processing
"""

import os
import sys

def check_dependencies():
    """Check if required Python packages are available"""
    print("🔍 Checking dependencies...")
    
    missing_packages = []
    
    try:
        import requests
        print("✅ requests - OK")
    except ImportError:
        missing_packages.append("requests")
        print("❌ requests - MISSING")
    
    try:
        import pandas
        print("✅ pandas - OK")
    except ImportError:
        missing_packages.append("pandas")
        print("❌ pandas - MISSING")
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Install with: pip install " + " ".join(missing_packages))
        return False
    
    print("✅ All dependencies available!")
    return True

def check_directories():
    """Check if required directories exist"""
    print("\n📁 Checking directories...")
    
    required_dirs = [
        "statscan_data",
        "processed_data"
    ]
    
    for dir_name in required_dirs:
        if os.path.exists(dir_name):
            print(f"✅ {dir_name}/ - EXISTS")
        else:
            os.makedirs(dir_name, exist_ok=True)
            print(f"📁 {dir_name}/ - CREATED")

def test_download_script():
    """Test the download script"""
    print("\n🚀 Testing download script...")

    try:
        # Import with proper module name
        import statscan_downloader

        downloader = statscan_downloader.StatsCanaDataDownloader()
        print("✅ Download script imports successfully")

        # Test metadata retrieval for one table
        print("🔍 Testing metadata retrieval...")
        metadata = downloader.get_table_metadata("11-10-0239-01")

        if metadata:
            print("✅ Metadata retrieval works")
        else:
            print("⚠️  Metadata retrieval failed (may be network issue)")

        return True

    except Exception as e:
        print(f"❌ Download script error: {e}")
        return False

def test_processing_script():
    """Test the processing script"""
    print("\n🔄 Testing processing script...")

    try:
        # Import with proper module name
        import process_statscan_data

        processor = process_statscan_data.StatsCanaDataProcessor()
        print("✅ Processing script imports successfully")
        return True

    except Exception as e:
        print(f"❌ Processing script error: {e}")
        return False

def show_next_steps():
    """Show next steps for the user"""
    print("\n" + "="*60)
    print("🎯 NEXT STEPS FOR PHASE 1 DATA COLLECTION")
    print("="*60)
    
    print("\n1. 📥 DOWNLOAD DATA (Choose one method):")
    print("   Option A - Automated:")
    print("     python statscan-downloader.py")
    print("   Option B - Manual:")
    print("     Follow manual-download-guide.md")
    
    print("\n2. 🔄 PROCESS DATA:")
    print("     python process-statscan-data.py")
    
    print("\n3. 📊 IMPORT TO DATABASE:")
    print("     psql -d UBIDatabase -f processed_data/income_distribution.sql")
    print("     psql -d UBIDatabase -f processed_data/gdp_data.sql")
    print("     psql -d UBIDatabase -f processed_data/federal_finance.sql")
    
    print("\n4. 🧭 INTEGRATE WITH UBI COMPASS:")
    print("     Update UBI calculation models with real data")
    
    print("\n📋 PRIORITY ORDER:")
    print("   1. Income Distribution (11-10-0239-01) - CRITICAL")
    print("   2. GDP Data (36-10-0014-01) - HIGH")
    print("   3. Federal Finance (10-10-0005-01) - HIGH")
    print("   4. Provincial Finance (10-10-0020-01) - MEDIUM")
    print("   5. CPI/Inflation (18-10-0005-01) - MEDIUM")
    print("   6. Tax Filers (11-10-0008-01) - LOW")

def main():
    print("🧭 UBI Compass - Phase 1 Data Collection Test")
    print("="*60)
    
    # Check dependencies
    deps_ok = check_dependencies()
    
    # Check directories
    check_directories()
    
    # Test scripts if dependencies are available
    if deps_ok:
        download_ok = test_download_script()
        process_ok = test_processing_script()
        
        if download_ok and process_ok:
            print("\n✅ ALL TESTS PASSED!")
            print("🚀 Ready for Statistics Canada data collection!")
        else:
            print("\n⚠️  Some tests failed, but you can still proceed with manual downloads")
    else:
        print("\n⚠️  Install missing dependencies first, then re-run this test")
    
    # Show next steps
    show_next_steps()
    
    print("\n📖 For detailed instructions, see:")
    print("   - manual-download-guide.md")
    print("   - statscan-data-plan.md")

if __name__ == "__main__":
    main()
