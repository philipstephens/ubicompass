# UBI Calculation Backend

This backend provides API endpoints for the UBI Calculation Component, supporting multiple taxation models including flat tax, progressive tax, and bell curve taxation.

## Database Setup

1. Make sure PostgreSQL is running on port 7000 (or update the `.env` file with your port)
2. Create a database named `UBIDatabase` if it doesn't exist
3. Run the database update script:

```bash
node update_db.js
```

This will:
- Create the necessary tables for the taxation models
- Insert sample data for testing

## API Endpoints

### Year Meta Data

- `GET /api/year-meta-data` - Get all years
- `GET /api/year-meta-data/:year` - Get a specific year by tax year
- `POST /api/year-meta-data` - Create a new year

### Tax Entries

- `GET /api/tax-entries/:ubiId` - Get tax entries for a specific UBI ID
- `POST /api/tax-entries` - Create a new tax entry

### Taxation Models

- `GET /api/taxation/models` - Get all taxation models
- `GET /api/taxation/models/:modelId` - Get a specific taxation model
- `GET /api/taxation/parameters/:modelId/:ubiId` - Get parameters for a specific model and UBI year
- `GET /api/taxation/brackets/:modelId/:ubiId` - Get tax brackets for a specific model and UBI year
- `GET /api/taxation/percentiles/:ubiId` - Get income percentiles for a specific UBI year
- `GET /api/taxation/data/:modelId/:ubiId` - Get all data for a specific model and UBI year

## Running the Server

```bash
node server.js
```

The server will run on port 8000 by default (or the port specified in your `.env` file).

## Taxation Models

### 1. Flat Tax

A simple flat tax rate applied to all income above an exemption amount.

Parameters:
- `exemption_amount` - Amount of income exempt from taxation
- `tax_rate` - Flat tax rate applied to income above exemption

### 2. Progressive Tax

Multiple tax brackets with increasing rates for higher incomes.

Parameters:
- `exemption_amount` - Amount of income exempt from taxation

Tax brackets:
- Each bracket has a `lower_bound`, `upper_bound`, and `tax_rate`
- Income within each bracket is taxed at the specified rate

### 3. Bell Curve

Tax rate based on income percentile, following a bell curve distribution.

Parameters:
- `exemption_amount` - Amount of income exempt from taxation
- `bell_curve_center` - Percentile at which the bell curve is centered (e.g., 90)
- `bell_curve_width` - Width parameter controlling the spread of the bell curve
- `max_tax_rate` - Maximum tax rate at the center of the bell curve
- `max_tax_amount` - Maximum tax amount cap

Income percentiles:
- Each percentile has a `lower_bound`, `upper_bound`, and `median_income`
