# Manual Download Guide - Statistics Canada Data for UBI Analysis

## 🎯 Phase 1 Priority Downloads

### 1. Income Distribution Data (HIGHEST PRIORITY)
**Table 11-10-0239-01: Income of individuals by age group, sex and income source**
- **Direct Link**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1110023901
- **What to download**: Full table CSV (2000-2022)
- **Why critical**: Core data for calculating UBI impact on different income levels
- **File size**: ~50MB
- **Instructions**:
  1. Click "Download options" 
  2. Select "Entire table (CSV)"
  3. Save as `income_by_age_11100239.csv`

### 2. Tax Filer Income Data
**Table 11-10-0008-01: Tax filers and dependents with income by total income, sex and age**
- **Direct Link**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1110000801
- **What to download**: Full table CSV (2000-2022)
- **Why critical**: Shows actual income distribution for tax calculations
- **Instructions**:
  1. Click "Download options"
  2. Select "Entire table (CSV)" 
  3. Save as `tax_filers_11100008.csv`

### 3. GDP Data
**Table 36-10-0014-01: Gross domestic product, income-based**
- **Direct Link**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610001401
- **What to download**: Canada data only, all years
- **Why critical**: Calculate UBI cost as % of GDP for feasibility
- **Instructions**:
  1. Filter: Geography = "Canada"
  2. Download filtered CSV
  3. Save as `gdp_canada_36100014.csv`

### 4. Federal Government Finance
**Table 10-10-0005-01: Federal government revenue and expenditure**
- **Direct Link**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1010000501
- **What to download**: All revenue and expenditure data
- **Why critical**: Calculate UBI cost vs government capacity
- **Instructions**:
  1. Download full table CSV
  2. Save as `federal_finance_10100005.csv`

### 5. Provincial Government Finance
**Table 10-10-0020-01: Provincial and territorial government revenue and expenditure**
- **Direct Link**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1010002001
- **What to download**: All provinces, revenue and expenditure
- **Why critical**: Total government fiscal capacity
- **Instructions**:
  1. Download full table CSV
  2. Save as `provincial_finance_10100020.csv`

### 6. Consumer Price Index (Inflation)
**Table 18-10-0005-01: Consumer Price Index, annual average**
- **Direct Link**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000501
- **What to download**: Canada, all items CPI
- **Why critical**: Adjust income data for inflation over time
- **Instructions**:
  1. Filter: Geography = "Canada", Products and product groups = "All-items"
  2. Download filtered CSV
  3. Save as `cpi_inflation_18100005.csv`

## 📁 File Organization

Create this folder structure:
```
ubi-backend/db/
├── statscan_data/
│   ├── income_by_age_11100239.csv
│   ├── tax_filers_11100008.csv
│   ├── gdp_canada_36100014.csv
│   ├── federal_finance_10100005.csv
│   ├── provincial_finance_10100020.csv
│   └── cpi_inflation_18100005.csv
├── processed_data/ (will be created by scripts)
└── sql_output/ (will be created by scripts)
```

## 🚀 Quick Start Instructions

### Step 1: Download Priority Data
1. Start with **Income Distribution** (Table 11-10-0239-01) - this is most critical
2. Download **GDP data** (Table 36-10-0014-01) - needed for feasibility calculations
3. Get **Federal Finance** data (Table 10-10-0005-01) - for budget context

### Step 2: Process the Data
```bash
cd ubi-backend/db
python process-statscan-data.py
```

### Step 3: Import to Database
```bash
# Import the generated SQL files to PostgreSQL
psql -d UBIDatabase -f processed_data/income_distribution.sql
psql -d UBIDatabase -f processed_data/gdp_data.sql
psql -d UBIDatabase -f processed_data/federal_finance.sql
```

## 💡 Download Tips

### For Large Files:
- Use "Right-click → Save link as" for direct downloads
- Statistics Canada files can be 50-200MB each
- Download during off-peak hours for faster speeds

### Data Quality Checks:
- Verify year range covers 2000-2022
- Check for missing years or data gaps
- Ensure file sizes are reasonable (not truncated)

### If Downloads Fail:
1. Try different browsers (Chrome, Firefox, Edge)
2. Disable ad blockers temporarily
3. Use Statistics Canada's alternative download methods
4. Contact Statistics Canada support if persistent issues

## 🎯 Expected Outcomes

After downloading and processing:
- **Income distribution** by age groups and income levels (2000-2022)
- **GDP figures** for economic context and feasibility calculations
- **Government budget data** for fiscal capacity analysis
- **Inflation data** for real income adjustments

This data will enable:
- ✅ Accurate UBI cost calculations
- ✅ Income distribution impact analysis  
- ✅ Economic feasibility assessments
- ✅ Year-over-year trend analysis
- ✅ Policy scenario modeling

## 📞 Support

If you encounter issues:
- **Statistics Canada Help**: https://www.statcan.gc.ca/en/help/contact
- **Data questions**: Contact their data support team
- **Technical issues**: Try alternative browsers or download methods

## 🔄 Next Steps

Once you have the data:
1. Run the processing scripts
2. Import to your PostgreSQL database
3. Create UBI calculation models
4. Integrate with UBI Compass application
5. Build comprehensive feasibility analysis

**Priority order**: Income → GDP → Federal Finance → Provincial Finance → CPI → Tax Filers
