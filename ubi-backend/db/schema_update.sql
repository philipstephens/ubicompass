-- Schema update for UBI database to support bell curve taxation and percentile-based models

-- Create TaxationModels table
CREATE TABLE IF NOT EXISTS TaxationModels (
    model_id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create IncomePercentiles table
CREATE TABLE IF NOT EXISTS IncomePercentiles (
    percentile_id SERIAL PRIMARY KEY,
    ubiid INTEGER REFERENCES YearMetaData(ubiid),
    percentile INTEGER NOT NULL CHECK (percentile BETWEEN 1 AND 100),
    lower_bound DECIMAL(15, 2) NOT NULL,
    upper_bound DECIMAL(15, 2) NOT NULL,
    median_income DECIMAL(15, 2) NOT NULL
);

-- Create TaxModelParameters table
CREATE TABLE IF NOT EXISTS TaxModelParameters (
    parameter_id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES TaxationModels(model_id),
    ubiid INTEGER REFERENCES YearMetaData(ubiid),
    parameter_name VARCHAR(100) NOT NULL,
    parameter_value DECIMAL(15, 6) NOT NULL
);

-- Create TaxBrackets table for progressive taxation
CREATE TABLE IF NOT EXISTS TaxBrackets (
    bracket_id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES TaxationModels(model_id),
    ubiid INTEGER REFERENCES YearMetaData(ubiid),
    lower_bound DECIMAL(15, 2) NOT NULL,
    upper_bound DECIMAL(15, 2),  -- NULL for the highest bracket
    tax_rate DECIMAL(5, 2) NOT NULL  -- Percentage
);

-- Modify YearMetaData table to include default taxation model
ALTER TABLE YearMetaData 
ADD COLUMN IF NOT EXISTS default_model_id INTEGER REFERENCES TaxationModels(model_id);

-- Insert default taxation models
INSERT INTO TaxationModels (model_name, description) VALUES
('Flat Tax', 'Simple flat tax rate applied to all income above exemption'),
('Progressive Tax', 'Multiple tax brackets with increasing rates for higher incomes'),
('Bell Curve', 'Tax rate based on income percentile, following a bell curve distribution');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_income_percentiles_ubiid ON IncomePercentiles(ubiid);
CREATE INDEX IF NOT EXISTS idx_tax_model_params_model_id ON TaxModelParameters(model_id);
CREATE INDEX IF NOT EXISTS idx_tax_model_params_ubiid ON TaxModelParameters(ubiid);
CREATE INDEX IF NOT EXISTS idx_tax_brackets_model_id ON TaxBrackets(model_id);
CREATE INDEX IF NOT EXISTS idx_tax_brackets_ubiid ON TaxBrackets(ubiid);
