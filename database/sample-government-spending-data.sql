-- Sample Canadian Government Spending Data for UBI Compass
-- Based on Statistics Canada data and federal/provincial budgets
-- All amounts in millions of CAD

-- Federal Government Spending (Canada) - Recent years
-- 2022 Federal Spending Data
INSERT INTO government_spending (year, jurisdiction_id, category_id, amount_millions, data_source) VALUES
-- Total federal spending 2022
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 452000, 'Statistics Canada'),

-- Federal spending by major category 2022
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 185000, 'Federal Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'HEALTH'), 85000, 'Federal Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'DEBT_SERVICE'), 26000, 'Federal Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'DEFENSE'), 23000, 'Federal Budget 2022'),

-- Federal social programs 2022
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'OAS'), 58000, 'ESDC Annual Report'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'GIS'), 12000, 'ESDC Annual Report'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'CCB'), 25000, 'CRA Statistics'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'EI'), 22000, 'ESDC Annual Report'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'CPP'), 15000, 'CPP Annual Report'),

-- 2021 Federal Spending Data
(2021, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 425000, 'Statistics Canada'),
(2021, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 175000, 'Federal Budget 2021'),
(2021, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'OAS'), 55000, 'ESDC Annual Report'),
(2021, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'CCB'), 24000, 'CRA Statistics'),
(2021, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'EI'), 28000, 'ESDC Annual Report'),

-- 2020 Federal Spending Data (COVID year)
(2020, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 380000, 'Statistics Canada'),
(2020, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 160000, 'Federal Budget 2020'),

-- Provincial Spending Examples - Ontario
-- 2022 Ontario Spending
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'ON'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 185000, 'Ontario Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'ON'), 
 (SELECT id FROM spending_categories WHERE category_code = 'HEALTH'), 75000, 'Ontario Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'ON'), 
 (SELECT id FROM spending_categories WHERE category_code = 'EDUCATION'), 35000, 'Ontario Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'ON'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 18000, 'Ontario Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'ON'), 
 (SELECT id FROM spending_categories WHERE category_code = 'WELFARE'), 8500, 'Ontario Works Statistics'),

-- Quebec Spending Examples
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'QC'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 125000, 'Quebec Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'QC'), 
 (SELECT id FROM spending_categories WHERE category_code = 'HEALTH'), 55000, 'Quebec Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'QC'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 15000, 'Quebec Budget 2022'),

-- British Columbia Spending Examples
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'BC'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 70000, 'BC Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'BC'), 
 (SELECT id FROM spending_categories WHERE category_code = 'HEALTH'), 28000, 'BC Budget 2022'),
(2022, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'BC'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 8000, 'BC Budget 2022');

-- Social Program Spending Details
INSERT INTO social_program_spending (year, program_id, amount_millions, beneficiaries, average_benefit_annual, data_source) VALUES
-- Canada Child Benefit
(2022, (SELECT id FROM social_programs WHERE program_code = 'CCB'), 25000, 3500000, 7142, 'CRA Statistics'),
(2021, (SELECT id FROM social_programs WHERE program_code = 'CCB'), 24000, 3400000, 7058, 'CRA Statistics'),

-- Old Age Security
(2022, (SELECT id FROM social_programs WHERE program_code = 'OAS'), 58000, 6800000, 8529, 'ESDC Annual Report'),
(2021, (SELECT id FROM social_programs WHERE program_code = 'OAS'), 55000, 6600000, 8333, 'ESDC Annual Report'),

-- Guaranteed Income Supplement
(2022, (SELECT id FROM social_programs WHERE program_code = 'GIS'), 12000, 2100000, 5714, 'ESDC Annual Report'),
(2021, (SELECT id FROM social_programs WHERE program_code = 'GIS'), 11500, 2050000, 5609, 'ESDC Annual Report'),

-- Employment Insurance
(2022, (SELECT id FROM social_programs WHERE program_code = 'EI'), 22000, 1800000, 12222, 'ESDC Annual Report'),
(2021, (SELECT id FROM social_programs WHERE program_code = 'EI'), 28000, 2200000, 12727, 'ESDC Annual Report'),

-- Ontario Works (example provincial program)
(2022, (SELECT id FROM social_programs WHERE program_code = 'ON_WORKS'), 3200, 350000, 9142, 'Ontario Ministry of Children, Community and Social Services'),
(2021, (SELECT id FROM social_programs WHERE program_code = 'ON_WORKS'), 3100, 340000, 9117, 'Ontario Ministry of Children, Community and Social Services');

-- Add more historical data for trend analysis
-- 2019 (pre-COVID baseline)
INSERT INTO government_spending (year, jurisdiction_id, category_id, amount_millions, data_source) VALUES
(2019, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 355000, 'Statistics Canada'),
(2019, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 145000, 'Federal Budget 2019'),
(2019, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'OAS'), 48000, 'ESDC Annual Report'),
(2019, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'CCB'), 23000, 'CRA Statistics'),
(2019, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'EI'), 19000, 'ESDC Annual Report');

-- 2018
INSERT INTO government_spending (year, jurisdiction_id, category_id, amount_millions, data_source) VALUES
(2018, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'TOTAL'), 338000, 'Statistics Canada'),
(2018, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'SOCIAL'), 140000, 'Federal Budget 2018'),
(2018, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'OAS'), 45000, 'ESDC Annual Report'),
(2018, (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'CA'), 
 (SELECT id FROM spending_categories WHERE category_code = 'CCB'), 22000, 'CRA Statistics');

-- Create a summary view for quick analysis
CREATE VIEW v_spending_summary AS
SELECT 
    year,
    SUM(CASE WHEN gj.jurisdiction_code = 'CA' AND sc.category_code = 'TOTAL' THEN amount_millions ELSE 0 END) as federal_total,
    SUM(CASE WHEN gj.jurisdiction_code = 'CA' AND sc.category_code = 'SOCIAL' THEN amount_millions ELSE 0 END) as federal_social,
    SUM(CASE WHEN gj.level_id = 2 AND sc.category_code = 'TOTAL' THEN amount_millions ELSE 0 END) as provincial_total,
    SUM(CASE WHEN sc.ubi_replaceable = TRUE THEN amount_millions * sc.replacement_percentage / 100 ELSE 0 END) as total_replaceable
FROM government_spending gs
JOIN government_jurisdictions gj ON gs.jurisdiction_id = gj.id
JOIN spending_categories sc ON gs.category_id = sc.id
GROUP BY year
ORDER BY year DESC;
