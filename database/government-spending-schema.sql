-- Government Spending Database Schema for UBI Compass
-- This schema supports federal, provincial, and municipal spending data
-- with categorization for UBI replacement analysis

-- Government levels (federal, provincial, municipal)
CREATE TABLE government_levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL UNIQUE, -- 'federal', 'provincial', 'municipal'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Government jurisdictions (Canada, provinces, territories, municipalities)
CREATE TABLE government_jurisdictions (
    id SERIAL PRIMARY KEY,
    jurisdiction_code VARCHAR(10) NOT NULL UNIQUE, -- 'CA', 'ON', 'QC', 'BC', etc.
    jurisdiction_name VARCHAR(100) NOT NULL,
    level_id INTEGER REFERENCES government_levels(id),
    parent_jurisdiction_id INTEGER REFERENCES government_jurisdictions(id), -- For hierarchical structure
    population INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spending categories with UBI replacement potential
CREATE TABLE spending_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(20) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INTEGER REFERENCES spending_categories(id),
    description TEXT,
    ubi_replaceable BOOLEAN DEFAULT FALSE, -- Can this be replaced by UBI?
    replacement_percentage DECIMAL(5,2) DEFAULT 0, -- What % could be replaced (0-100)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main government spending data table
CREATE TABLE government_spending (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    jurisdiction_id INTEGER REFERENCES government_jurisdictions(id),
    category_id INTEGER REFERENCES spending_categories(id),
    amount_millions DECIMAL(15,2) NOT NULL, -- Amount in millions of dollars
    currency VARCHAR(3) DEFAULT 'CAD',
    data_source VARCHAR(100), -- Statistics Canada, provincial budgets, etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique combinations
    UNIQUE(year, jurisdiction_id, category_id)
);

-- Social programs that could be replaced by UBI
CREATE TABLE social_programs (
    id SERIAL PRIMARY KEY,
    program_code VARCHAR(20) NOT NULL UNIQUE,
    program_name VARCHAR(100) NOT NULL,
    jurisdiction_id INTEGER REFERENCES government_jurisdictions(id),
    category_id INTEGER REFERENCES spending_categories(id),
    description TEXT,
    eligibility_criteria TEXT,
    ubi_replacement_scenario VARCHAR(50), -- 'full', 'partial', 'none'
    replacement_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Annual spending on specific social programs
CREATE TABLE social_program_spending (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    program_id INTEGER REFERENCES social_programs(id),
    amount_millions DECIMAL(15,2) NOT NULL,
    beneficiaries INTEGER, -- Number of people receiving benefits
    average_benefit_annual DECIMAL(10,2), -- Average annual benefit per person
    data_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(year, program_id)
);

-- Insert initial government levels
INSERT INTO government_levels (level_name, description) VALUES
('federal', 'Federal government of Canada'),
('provincial', 'Provincial and territorial governments'),
('municipal', 'Municipal and local governments');

-- Insert major jurisdictions
INSERT INTO government_jurisdictions (jurisdiction_code, jurisdiction_name, level_id, population) VALUES
('CA', 'Canada', 1, 38000000),
('ON', 'Ontario', 2, 15000000),
('QC', 'Quebec', 2, 8500000),
('BC', 'British Columbia', 2, 5200000),
('AB', 'Alberta', 2, 4400000),
('MB', 'Manitoba', 2, 1400000),
('SK', 'Saskatchewan', 2, 1200000),
('NS', 'Nova Scotia', 2, 1000000),
('NB', 'New Brunswick', 2, 800000),
('NL', 'Newfoundland and Labrador', 2, 520000),
('PE', 'Prince Edward Island', 2, 160000),
('NT', 'Northwest Territories', 2, 45000),
('YT', 'Yukon', 2, 42000),
('NU', 'Nunavut', 2, 39000);

-- Insert spending categories with UBI replacement potential
INSERT INTO spending_categories (category_code, category_name, description, ubi_replaceable, replacement_percentage) VALUES
-- Major categories
('TOTAL', 'Total Government Spending', 'All government expenditures', FALSE, 0),
('SOCIAL', 'Social Protection', 'Social security and welfare programs', TRUE, 60),
('HEALTH', 'Health', 'Healthcare spending', FALSE, 0),
('EDUCATION', 'Education', 'Education spending', FALSE, 0),
('DEFENSE', 'Defense', 'Military and defense spending', FALSE, 0),
('INFRASTRUCTURE', 'Infrastructure', 'Public works and infrastructure', FALSE, 0),
('DEBT_SERVICE', 'Debt Service', 'Interest payments on government debt', FALSE, 0),

-- Social protection subcategories (UBI replaceable)
('WELFARE', 'Social Assistance', 'Provincial welfare programs', TRUE, 90),
('EI', 'Employment Insurance', 'Federal employment insurance', TRUE, 70),
('CPP', 'Canada Pension Plan', 'Federal pension contributions', TRUE, 30),
('OAS', 'Old Age Security', 'Federal old age security', TRUE, 50),
('GIS', 'Guaranteed Income Supplement', 'Federal income supplement for seniors', TRUE, 95),
('CCB', 'Canada Child Benefit', 'Federal child benefits', TRUE, 80),
('DISABILITY', 'Disability Benefits', 'Disability support programs', TRUE, 40),
('HOUSING', 'Housing Assistance', 'Social housing and rent supplements', TRUE, 60),
('FOOD_SECURITY', 'Food Security Programs', 'Food banks and nutrition programs', TRUE, 70);

-- Insert some sample social programs
INSERT INTO social_programs (program_code, program_name, jurisdiction_id, category_id, description, ubi_replacement_scenario, replacement_percentage) VALUES
('CCB', 'Canada Child Benefit', 1, (SELECT id FROM spending_categories WHERE category_code = 'CCB'), 'Federal tax-free monthly payment to eligible families', 'partial', 80),
('OAS', 'Old Age Security', 1, (SELECT id FROM spending_categories WHERE category_code = 'OAS'), 'Monthly payment to seniors 65+', 'partial', 50),
('GIS', 'Guaranteed Income Supplement', 1, (SELECT id FROM spending_categories WHERE category_code = 'GIS'), 'Additional benefit for low-income seniors', 'full', 95),
('EI', 'Employment Insurance', 1, (SELECT id FROM spending_categories WHERE category_code = 'EI'), 'Temporary income support for unemployed', 'partial', 70),
('ON_WORKS', 'Ontario Works', (SELECT id FROM government_jurisdictions WHERE jurisdiction_code = 'ON'), (SELECT id FROM spending_categories WHERE category_code = 'WELFARE'), 'Ontario social assistance program', 'full', 90);

-- Create indexes for performance
CREATE INDEX idx_government_spending_year ON government_spending(year);
CREATE INDEX idx_government_spending_jurisdiction ON government_spending(jurisdiction_id);
CREATE INDEX idx_government_spending_category ON government_spending(category_id);
CREATE INDEX idx_social_program_spending_year ON social_program_spending(year);
CREATE INDEX idx_social_program_spending_program ON social_program_spending(program_id);

-- Create a view for easy querying of total spending by year and jurisdiction
CREATE VIEW v_total_spending_by_year AS
SELECT 
    gs.year,
    gj.jurisdiction_code,
    gj.jurisdiction_name,
    gl.level_name,
    SUM(gs.amount_millions) as total_spending_millions
FROM government_spending gs
JOIN government_jurisdictions gj ON gs.jurisdiction_id = gj.id
JOIN government_levels gl ON gj.level_id = gl.id
WHERE gs.category_id = (SELECT id FROM spending_categories WHERE category_code = 'TOTAL')
GROUP BY gs.year, gj.jurisdiction_code, gj.jurisdiction_name, gl.level_name
ORDER BY gs.year DESC, total_spending_millions DESC;

-- Create a view for UBI replaceable spending
CREATE VIEW v_ubi_replaceable_spending AS
SELECT 
    gs.year,
    gj.jurisdiction_code,
    gj.jurisdiction_name,
    sc.category_name,
    gs.amount_millions,
    sc.replacement_percentage,
    (gs.amount_millions * sc.replacement_percentage / 100) as replaceable_amount_millions
FROM government_spending gs
JOIN government_jurisdictions gj ON gs.jurisdiction_id = gj.id
JOIN spending_categories sc ON gs.category_id = sc.id
WHERE sc.ubi_replaceable = TRUE
ORDER BY gs.year DESC, replaceable_amount_millions DESC;
