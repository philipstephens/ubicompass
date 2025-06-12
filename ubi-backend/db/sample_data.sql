-- Sample data for UBI taxation models

-- Assuming we have a YearMetaData entry with ubiid = 1 (2023, $2000 UBI, 30% flat tax)
-- Update it to use the flat tax model (model_id = 1)
UPDATE YearMetaData SET default_model_id = 1 WHERE ubiid = 1;

-- Add parameters for the flat tax model
INSERT INTO TaxModelParameters (model_id, ubiid, parameter_name, parameter_value) VALUES
(1, 1, 'exemption_amount', 24000.00),  -- $24,000 exemption
(1, 1, 'tax_rate', 30.00);             -- 30% flat tax rate

-- Add parameters for the progressive tax model
INSERT INTO TaxModelParameters (model_id, ubiid, parameter_name, parameter_value) VALUES
(2, 1, 'exemption_amount', 24000.00);  -- $24,000 exemption

-- Add tax brackets for the progressive model
INSERT INTO TaxBrackets (model_id, ubiid, lower_bound, upper_bound, tax_rate) VALUES
(2, 1, 0.00, 24000.00, 0.00),          -- 0% on first $24,000 (exemption)
(2, 1, 24000.01, 50000.00, 10.00),     -- 10% from $24,000 to $50,000
(2, 1, 50000.01, 100000.00, 20.00),    -- 20% from $50,000 to $100,000
(2, 1, 100000.01, 250000.00, 30.00),   -- 30% from $100,000 to $250,000
(2, 1, 250000.01, 500000.00, 35.00),   -- 35% from $250,000 to $500,000
(2, 1, 500000.01, NULL, 40.00);        -- 40% on income above $500,000

-- Add parameters for the bell curve model
INSERT INTO TaxModelParameters (model_id, ubiid, parameter_name, parameter_value) VALUES
(3, 1, 'exemption_amount', 24000.00),  -- $24,000 exemption
(3, 1, 'bell_curve_center', 90.00),    -- Center at 90th percentile
(3, 1, 'bell_curve_width', 30.00),     -- Width parameter
(3, 1, 'max_tax_rate', 40.00),         -- Maximum tax rate of 40%
(3, 1, 'max_tax_amount', 1000000.00);  -- Maximum tax amount of $1,000,000

-- Add income percentile data (simplified to quintiles for now)
-- These values are approximate and would need to be replaced with actual data
INSERT INTO IncomePercentiles (ubiid, percentile, lower_bound, upper_bound, median_income) VALUES
-- Quintile 1 (0-20%)
(1, 10, 0.00, 15000.00, 10000.00),
(1, 20, 15000.01, 30000.00, 25000.00),
-- Quintile 2 (21-40%)
(1, 30, 30000.01, 45000.00, 38000.00),
(1, 40, 45000.01, 60000.00, 52000.00),
-- Quintile 3 (41-60%)
(1, 50, 60000.01, 75000.00, 68000.00),
(1, 60, 75000.01, 90000.00, 82000.00),
-- Quintile 4 (61-80%)
(1, 70, 90000.01, 120000.00, 105000.00),
(1, 80, 120000.01, 150000.00, 135000.00),
-- Quintile 5 (81-100%)
(1, 90, 150000.01, 300000.00, 200000.00),
(1, 100, 300000.01, 1000000.00, 450000.00);
