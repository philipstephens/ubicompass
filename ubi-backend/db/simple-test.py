#!/usr/bin/env python3
"""
Simple test script for Statistics Canada data collection setup
"""

import os

def main():
    print("🧭 UBI Compass - Simple Setup Test")
    print("="*50)
    
    # Check current directory
    current_dir = os.getcwd()
    print(f"📁 Current directory: {current_dir}")
    
    # Check if we're in the right place
    if "ubi-backend" in current_dir and "db" in current_dir:
        print("✅ You're in the correct directory!")
    else:
        print("⚠️  Make sure you're in the ubi-backend/db directory")
        print("   Run: cd ubi-backend/db")
    
    # Check for required files
    required_files = [
        "statscan-downloader.py",
        "process-statscan-data.py", 
        "manual-download-guide.md",
        "statscan-data-plan.md"
    ]
    
    print("\n📋 Checking required files:")
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - MISSING")
    
    # Check dependencies
    print("\n🔍 Checking Python packages:")
    
    try:
        import requests
        print("✅ requests - Available")
    except ImportError:
        print("❌ requests - Install with: pip install requests")
    
    try:
        import pandas
        print("✅ pandas - Available")
    except ImportError:
        print("❌ pandas - Install with: pip install pandas")
    
    # Create directories
    print("\n📁 Creating required directories:")
    dirs_to_create = ["statscan_data", "processed_data"]
    
    for dir_name in dirs_to_create:
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
            print(f"📁 Created: {dir_name}/")
        else:
            print(f"✅ Exists: {dir_name}/")
    
    print("\n" + "="*50)
    print("🎯 NEXT STEPS:")
    print("="*50)
    
    print("\n1. 📦 Install missing packages (if any):")
    print("   pip install requests pandas")
    
    print("\n2. 📥 Download Statistics Canada data:")
    print("   Option A - Manual (Recommended):")
    print("     Follow manual-download-guide.md")
    print("   Option B - Automated:")
    print("     python statscan-downloader.py")
    
    print("\n3. 🔄 Process the data:")
    print("     python process-statscan-data.py")
    
    print("\n📋 Priority downloads:")
    print("   1. Income Distribution (11-10-0239-01) - CRITICAL")
    print("   2. GDP Data (36-10-0014-01) - HIGH")
    print("   3. Federal Finance (10-10-0005-01) - HIGH")
    
    print("\n📖 For detailed instructions:")
    print("   - Read manual-download-guide.md")
    print("   - Read statscan-data-plan.md")
    
    print("\n🚀 You're ready to start Phase 1 data collection!")

if __name__ == "__main__":
    main()
