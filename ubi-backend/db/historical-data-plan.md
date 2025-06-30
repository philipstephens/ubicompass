# Historical Data Collection Plan (Pre-2018)

## Current Data Coverage Analysis

### Years 2000-2007: 🟠 Partial Coverage (3-4/6 datasets)
- ✅ Income Distribution (2000-2023)
- ✅ CPI/Inflation (2000-2022) 
- ✅ Tax Filers (2000-2022)
- ❌ GDP Data (only 2020-2024)
- ❌ Federal Finance (only 2008-2023)
- ❌ Provincial Finance (only 2007-2023)

### Years 2008-2017: 🟡 Good Coverage (5/6 datasets)
- ✅ Income Distribution, Federal Finance, Provincial Finance, CPI/Inflation, Tax Filers
- ❌ GDP Data (only 2020-2024)

## Required Data Downloads

### 1. Historical GDP Data (2000-2019)
**Statistics Canada Table**: 36-10-0014-01
**URL**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610001401
**Coverage Needed**: 2000-2019 (19 years)
**Priority**: HIGH - Essential for feasibility calculations

### 2. Historical Federal Finance (2000-2007)
**Statistics Canada Table**: 10-10-0005-01
**URL**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1010000501
**Coverage Needed**: 2000-2007 (8 years)
**Priority**: MEDIUM - Can estimate from trends

### 3. Historical Provincial Finance (2000-2006)
**Statistics Canada Table**: 10-10-0020-01
**URL**: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1010002001
**Coverage Needed**: 2000-2006 (7 years)
**Priority**: MEDIUM - Can estimate from trends

## Implementation Steps

### Phase 1: Essential Data (GDP)
1. Download historical GDP data (2000-2019)
2. Process and import into database
3. Update UBI Compass to support 2008-2017 analysis
4. Test feasibility calculations for historical years

### Phase 2: Government Finance Data
1. Download historical federal finance (2000-2007)
2. Download historical provincial finance (2000-2006)
3. Process and import data
4. Update UBI Compass to support 2000-2017 analysis

### Phase 3: Data Quality & Validation
1. Validate historical calculations against known economic events
2. Add data quality indicators for each year
3. Implement interpolation for missing data points
4. Add historical context to feasibility assessments

## Alternative Approaches

### Option 1: Interpolation/Estimation
- Use existing data trends to estimate missing values
- Apply inflation adjustments to known data points
- Implement confidence intervals for estimated data

### Option 2: External Data Sources
- Bank of Canada historical data
- OECD economic indicators
- IMF historical statistics
- Academic economic databases

### Option 3: Simplified Historical Analysis
- Focus on years with complete data (2020-2022)
- Provide historical context without full calculations
- Use relative comparisons instead of absolute values

## Technical Implementation

### Database Schema Updates
```sql
-- Add data quality indicators
ALTER TABLE gdp_data ADD COLUMN data_quality VARCHAR(20) DEFAULT 'actual';
ALTER TABLE federal_finance ADD COLUMN data_quality VARCHAR(20) DEFAULT 'actual';
ALTER TABLE provincial_finance ADD COLUMN data_quality VARCHAR(20) DEFAULT 'actual';

-- Values: 'actual', 'interpolated', 'estimated', 'external'
```

### API Enhancements
- Add data quality indicators to API responses
- Implement confidence levels for historical analysis
- Add warnings for years with incomplete data

### UI Updates
- Display data quality indicators
- Add historical context explanations
- Show confidence levels for older years

## Expected Outcomes

### With Complete Historical Data:
- Full UBI analysis for 2000-2023 (24 years)
- Historical trend analysis
- Economic crisis impact studies (2008, COVID)
- Long-term feasibility projections

### With Current Data Only:
- Reliable analysis for 2020-2022 (3 years)
- Good analysis for 2008-2019 (12 years, missing GDP)
- Limited analysis for 2000-2007 (8 years, partial data)

## Recommendations

### Immediate Action (Next 1-2 weeks):
1. **Download historical GDP data** - This single dataset would enable analysis for 2008-2017
2. **Update UBI Compass** to handle 2008-2017 with estimated GDP if needed
3. **Add data coverage indicators** to inform users about data quality

### Medium Term (1-2 months):
1. Complete government finance historical data collection
2. Implement full 2000-2023 analysis capability
3. Add historical trend analysis features

### Long Term (3+ months):
1. Integrate external economic data sources
2. Develop predictive modeling for future years
3. Create comprehensive historical economic impact studies

## Cost-Benefit Analysis

### High Value, Low Effort:
- ✅ Download GDP data (2000-2019) - Enables 12 more years of analysis
- ✅ Add data quality indicators - Improves user trust

### Medium Value, Medium Effort:
- 🟡 Government finance data (2000-2007) - Completes historical picture
- 🟡 Interpolation algorithms - Fills data gaps

### Lower Priority:
- 🔴 External data integration - Complex, may not add significant value
- 🔴 Predictive modeling - Beyond current scope

## Success Metrics

1. **Years of Analysis**: Expand from 3 years (2020-2022) to 15+ years (2008-2023)
2. **Data Completeness**: Achieve 80%+ data coverage for target years
3. **User Confidence**: Clear data quality indicators and explanations
4. **Historical Insights**: Enable analysis of economic cycles and trends
