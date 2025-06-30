# UBI Compass Utilities

This directory contains utility scripts for the UBI Compass project, including:

- Database initialization and management
- Data import tools for Statistics Canada data
- Helper scripts for development and deployment

## Available Scripts

- `init-database.js` - Creates the necessary database tables
- `import-statscan-data.js` - Imports CSV data from Statistics Canada into the database

## Usage

To run these utilities:

```bash
# Initialize the database
node utilities/init-database.js

# Import Statistics Canada data
node utilities/import-statscan-data.js
```

Make sure you have the required dependencies installed:
```bash
npm install pg csv-parser
```