# Statistics Canada Data Collection Plan - Phase 1

## Essential Tables for UBI Feasibility Analysis (2000-2022)

### 1. Income Distribution Data
**Table 11-10-0239-01: Income of individuals by age group, sex and income source**
- URL: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1110023901
- **What we get**: Income distribution by age groups and income sources
- **Why critical**: Core data for calculating UBI impact on different income levels
- **Frequency**: Annual
- **Geography**: Canada, provinces

### 2. Tax Filer Income Data  
**Table 11-10-0008-01: Tax filers and dependents with income by total income, sex and age**
- URL: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1110000801
- **What we get**: Number of tax filers by income brackets and demographics
- **Why critical**: Shows actual income distribution for tax calculations
- **Frequency**: Annual
- **Geography**: Canada, provinces

### 3. GDP Data
**Table 36-10-0014-01: Gross domestic product, income-based, provincial and territorial**
- URL: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610001401
- **What we get**: Annual GDP figures for economic context
- **Why critical**: Calculate UBI cost as % of GDP for feasibility
- **Frequency**: Annual
- **Geography**: Canada, provinces

### 4. Government Finance Data
**Table 10-10-0005-01: Federal government revenue and expenditure**
- URL: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1010000501
- **What we get**: Federal budget revenue and spending
- **Why critical**: Calculate UBI cost vs government capacity
- **Frequency**: Annual
- **Geography**: Canada

### 5. Provincial Government Finance
**Table 10-10-0020-01: Provincial and territorial government revenue and expenditure**
- URL: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1010002001
- **What we get**: Provincial budget data
- **Why critical**: Total government fiscal capacity
- **Frequency**: Annual
- **Geography**: Provinces/territories

### 6. Consumer Price Index (Inflation)
**Table 18-10-0005-01: Consumer Price Index, annual average**
- URL: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000501
- **What we get**: Inflation rates for real income calculations
- **Why critical**: Adjust income data for inflation over time
- **Frequency**: Annual
- **Geography**: Canada, provinces

## Data Download Strategy

### Method 1: Statistics Canada API
- **Pros**: Automated, structured data
- **Cons**: Requires API key, learning curve
- **Best for**: Large datasets, regular updates

### Method 2: CSV Download
- **Pros**: Simple, immediate access
- **Cons**: Manual process, formatting needed
- **Best for**: One-time downloads, specific years

### Method 3: Web Scraping
- **Pros**: Can get any visible data
- **Cons**: Fragile, may break with site changes
- **Best for**: Backup method only

## Recommended Approach

1. **Start with CSV downloads** for immediate progress
2. **Create Python scripts** to standardize the data format
3. **Build SQL insert scripts** for database population
4. **Validate data quality** before proceeding

## Expected Data Structure

```sql
-- Target table structures for Phase 1

CREATE TABLE income_distribution (
    year INT,
    age_group VARCHAR(20),
    income_bracket VARCHAR(30),
    population_count INT,
    median_income DECIMAL(12,2),
    average_income DECIMAL(12,2)
);

CREATE TABLE economic_indicators (
    year INT,
    gdp_nominal DECIMAL(15,2),
    gdp_real DECIMAL(15,2),
    federal_revenue DECIMAL(15,2),
    federal_expenditure DECIMAL(15,2),
    provincial_revenue DECIMAL(15,2),
    provincial_expenditure DECIMAL(15,2),
    inflation_rate DECIMAL(5,2)
);

CREATE TABLE tax_filers (
    year INT,
    income_bracket_min INT,
    income_bracket_max INT,
    number_of_filers INT,
    total_income DECIMAL(15,2),
    total_tax_paid DECIMAL(15,2)
);
```

## Data Quality Checks

1. **Year coverage**: Ensure 2000-2022 complete
2. **Population totals**: Match with our existing population data
3. **Income consistency**: Cross-validate between tables
4. **Inflation adjustment**: Convert to constant dollars
5. **Missing data**: Identify and handle gaps

## Next Steps

1. Download priority tables (start with income distribution)
2. Create data processing scripts
3. Build database schemas
4. Validate and clean data
5. Create UBI calculation models
