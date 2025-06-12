-- metadata countryId, country, referenceYear, citation1, citation2
-- yearStatistics yearStatsId, year, taxPayers, countryId
-- yearStatsBefore ysbId, decile, upperIncomeLimit, shareOfIncome, averageIncome, yearStatsId
-- yearStatsAfter ysaId, decile, upperIncomeLimit, shareOfIncome, averageIncome, yearStatsId

-- PostgreSQL syntax for conditional table creation

-- Drop tables in correct order (child tables first)
DROP TABLE IF EXISTS yearStatsBefore CASCADE;
DROP TABLE IF EXISTS yearStatsAfter CASCADE;
DROP TABLE IF EXISTS yearStatistics CASCADE;
DROP TABLE IF EXISTS metadata CASCADE;

-- Create tables in correct order (parent tables first)
CREATE TABLE metadata (
    "countryID" SERIAL PRIMARY KEY,
    "country" VARCHAR(30) NOT NULL,
    "referenceYear" INT NOT NULL,
    "incomeCitation" VARCHAR(255) NOT NULL,
    "numTaxPayersCitation" VARCHAR(255) NOT NULL
);

CREATE TABLE yearStatistics (
    "yearStatsId" INT NOT NULL PRIMARY KEY,
    "year" INT NOT NULL,
    "taxPayers" INT NOT NULL,
    "countryId" INT NOT NULL,
    FOREIGN KEY ("countryId") REFERENCES metadata ("countryID")
);

CREATE TABLE yearStatsBefore (
    "ysbId" SERIAL PRIMARY KEY,
    "decile" INT NOT NULL CHECK ("decile" >= 1 and "decile" <= 11),
    "upperIncomeLimit" INT NOT NULL,
    "shareOfIncome" DECIMAL(5,2) NOT NULL,
    "averageIncome" INT NOT NULL,
    "yearStatsId" INT NOT NULL,
    FOREIGN KEY ("yearStatsId") REFERENCES yearStatistics ("yearStatsId")
);

CREATE TABLE yearStatsAfter (
    "ysaId" SERIAL PRIMARY KEY,
    "decile" INT NOT NULL CHECK ("decile" >= 1 and "decile" <= 11),
    "upperIncomeLimit" INT NOT NULL,
    "shareOfIncome" DECIMAL(5,2) NOT NULL,
    "averageIncome" INT NOT NULL,
    "yearStatsId" INT NOT NULL,
    FOREIGN KEY ("yearStatsId") REFERENCES yearStatistics ("yearStatsId")
);

-- Insert metadata first
INSERT INTO metadata ("countryID", "country", "referenceYear", "incomeCitation", "numTaxPayersCitation")
VALUES (1, 'Canada', 2000, 'Statistics Canada Income Data', 'Statistics Canada Taxpayer Data');

-- == 2000 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (1, 2000, 22131680, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20400, 2.2, 13600, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 28400, 3.9, 24600, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 36400, 5.2, 32300, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 44600, 6.5, 40500, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 52500, 7.8, 48500, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 61400, 9.1, 56800, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 71200, 10.6, 66300, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 84900, 12.5, 77700, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 107500, 15.2, 94700, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0, 27.1, 169000, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0, 100, 62400, 1);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 19800, 2.4, 12200, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 26600, 4.7, 23400, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 32500, 5.9, 29600, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 38300, 7.1, 35400, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 44000, 8.2, 41100, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 50400, 9.4, 47200, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 57900, 10.8, 54100, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 67800, 12.5, 62500, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 83600, 14.9, 74600, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0, 24.2, 121200, 1);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0, 100, 50100, 1);

-- == 2001 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (2, 2001, 22709910, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20900,2.2,13900,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 29400,4.0,25400,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 37000,5.2,33000,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 45000,6.5,40900,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 53100,7.7,49000,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 62000,9.1,57500,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 72500,10.6,67000,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 85800,12.4,78800,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 109100,15.2,96300,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,27.1,171400,2);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,63300,2);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20600,2.6,13600,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 27800,4.7,24500,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 33500,5.9,30600,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 39400,7.0,36500,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 45500,8.1,42400,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 52000,9.4,48700,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 60200,10.7,55900,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 70100,12.5,65000,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 86700,14.9,77600,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,24.2,126300,2);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,52100,2);

-- == 2002 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (3, 2002, 22798980, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20800,2.2,14000,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 29000,4.0,25200,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 37100,5.2,33100,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 45200,6.5,41200,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 53300,7.8,49300,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 61900,9.1,57500,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 72700,10.6,67000,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 86900,12.5,79000,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 109000,15.3,96900,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.9,170700,3);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome" , "yearStatsId") VALUES (11, 0,100,63400,3);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20400,2.6,13500,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 27500,4.6,24200,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 33700,5.8,30600,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 39700,7.0,36700,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 46000,8.2,42900,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 52400,9.4,49100,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 60100,10.8,56300,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 70800,12.5,65300,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 88000,15.0,78400,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,24.1,126300,3);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,52300,3);

-- == 2003 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (4, 2003, 23070200, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20800,2.2,14100,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 29000,4.0,25100,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 36800,5.2,32800,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 45000,6.5,40900,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 53300,7.8,49100,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 61900,9.1,57600,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 72700,10.6,67200,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 86900,12.6,79300,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 109000,15.4,97200,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.6,168000,4);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,63100,4);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20500,2.6,13800,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 27400,4.6,24100,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 33400,5.8,30300,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 39500,7.0,36500,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 45900,8.2,42700,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 52400,9.4,49100,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 60200,10.8,56100,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 70900,12.5,65200,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 87300,15.1,78300,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,23.8,124100,4);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,52000,4);

-- == 2004 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (5, 2004, 23408890, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20800,2.2,14000,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 29200,3.9,25200,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 37400,5.1,33300,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 45600,6.4,41500,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 54100,7.7,49800,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 63400,9.1,58700,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 73700,10.6,68400,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 88600,12.5,80600,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 111900,15.3,99100,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,27.2,176200,5);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,64700,5);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 20500,2.5,13600,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 27700,4.6,24300,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 34100,5.8,30800,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 40100,7.0,37200,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 46500,8.1,43400,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 53600,9.4,50000,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 61300,10.8,57400,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 72000,12.5,66400,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 89900,15.0,80000,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,24.4,130000,5);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,53300,5);

-- == 2005 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (6, 2005, 23715660, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 21700,2.2,14300,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 30000,4.0,26000,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 38300,5.2,34200,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 46400,6.5,42400,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 54900,7.7,50600,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 64800,9.1,59800,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 75500,10.7,69900,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 90000,12.6,82400,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 115300,15.4,100600,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.6,173800,6);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome" , "yearStatsId") VALUES (11, 0,100,65400,6);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 21300,2.6,13800,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 28500,4.6,25000,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 34800,5.9,31700,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 41200,7.0,38000,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 47500,8.2,44200,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 54900,9.5,51200,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 63000,10.8,58700,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 73500,12.6,68000,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 90900,15.0,81100,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,23.9,129200,6);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,54100,6);

-- == 2006 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (7, 2006, 24113140, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 21400,2.3,15000,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 30600,4.0,26200,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 38700,5.2,34700,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 47300,6.5,43000,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 55900,7.8,51600,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 65500,9.2,60700,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 76400,10.7,70900,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 91700,12.7,83900,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 116400,15.5,102700,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.2,173800,7);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome" , "yearStatsId") VALUES (11, 0,100,66300,7);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 21100,2.6,14500,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 29000,4.6,25300,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 35400,5.8,32200,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 41800,7.0,38600,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 48400,8.2,45100,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 55700,9.5,52100,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 64100,10.8,59700,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 75300,12.6,69500,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 93100,15.1,83000,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,23.7,130600,7);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,55000,7);

-- == 2007 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (8, 2007, 24351240, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 22700,2.3,15800,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 31500,4.0,27100,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 40000,5.2,35700,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 48400,6.5,44100,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 57100,7.7,52600,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 67300,9.1,62000,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 78500,10.6,72700,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 94600,12.6,86000,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 119900,15.5,10600,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.5,180900,8);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,68300,8);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 22300,2.7,15300,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 30000,4.6,26300,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 36800,5.9,33400,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 43300,7.0,40100,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 49900,8.2,46600,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 57500,9.4,53700,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 66300,10.8,61700,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 77900,12.5,71600,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 96000,15.1,86000,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,23.8,136100,8);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,57100,8);

-- == 2008 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (9, 2008, 24731470, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 23300,2.3,16000,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 31800,4.0,27700,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 41100,5.2,36400,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 50100,6.5,45700,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 58800,7.8,54400,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 69100,9.1,63800,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 80600,10.7,74700,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 96500,12.6,88000,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 122500,15.5,107800,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.3,183200,9);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,69800,9);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 22900,2.7,15700,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 30500,4.6,27000,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 37900,5.9,34200,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 44800,7.1,41300,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 51600,8.2,48000,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 59100,9.5,55300,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 67700,10.8,63300,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 79400,12.6,73300,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 97900,15.0,87500,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,23.7,138100,9);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,58400,9);

-- == 2009 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (10, 2009, 24964290, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 22900,2.3,15600,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 31500,3.9,27300,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 40300,5.2,35900,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 49700,6.5,45000,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 58600,7.8,54000,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 68900,9.2,63600,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 80100,10.7,74100,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 96400,12.7,87700,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 122000,15.5,107400,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.1,180500,10);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,69100,10);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 22700,2.6,15400,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 30400,4.6,26700,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 37700,5.8,34100,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 44700,7.1,41300,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 51800,8.3,48200,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 59600,9.5,55800,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 67900,10.9,63500,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 80100,12.6,73700,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 98900,15.1,88300,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,23.6,137800,10);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,58500,10);

-- == 2010 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (11, 2010, 25227050, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 23400, 2.4, 16400,11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 31600, 4.0, 27600, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 40400, 5.2, 36100, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 49700, 6.5, 45000, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 58900, 7.8, 54200, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 68700, 9.2, 63800, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 80200, 10.6, 74000, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 96300, 12.6, 87700, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 121800, 15.5, 107600, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0, 26.4, 183300, 11);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0, 100, 69600, 11);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,23000,2.7,15700,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,30500,4.6,27000,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,38000,5.8,34300,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,44900,7.0,41300,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,51900,8.2,48400,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,59400,9.5,55800,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,67800,10.8,63400,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,80000,12.5,73400,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,98900,15.1,88400,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.7,58700,11);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,139100,11);

-- == 2011 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (12, 2011, 25599300, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 23500, 2.3, 16300, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 32500, 4.0, 28100, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 41300, 5.2, 36900, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 50400, 6.5, 46100, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 60000, 7.8, 55100, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 70200, 9.2, 64900, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 81900, 10.7, 75600, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 97700, 12.7, 89300, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 123600, 15.6, 109500, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0, 25.8, 181800, 12);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0, 100, 70400, 12);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 23100, 2.7,16000,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 31300,4.6,27500,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,38400,5.9,34800,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,45500,7.1,41900,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,52500,8.3,481900,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,60100,9.5,56200,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,69100,10.9,64400,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,81000,12.6,74500,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,100200,15.1,89700,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.3,137900,12);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,59200,12);

-- == 2012 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (13, 2012, 25797510, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 23800, 2.2, 16000, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 33200, 4.0, 28600, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 42200, 5.3, 37600, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 51400, 6.5, 46800, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 61000, 7.9, 56200, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 71200, 9.2, 66100, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 82900, 10.7, 76900, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 98400, 12.6, 90200, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 125100, 15.4, 110100, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0, 26.2, 187200, 13);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0, 100, 71600, 13);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,23400,2.6,15600,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,31700,4.6,27800,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,38900,5.9,35300,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,46000,7.1,42500,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,53700,8.2,49700,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,61300,9.5,57400,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,70300,10.9,65500,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,81700,12.6,75600,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,101000,15.0,90100,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.7,142800,13);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100.0,60200,13);

-- == 2013 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (14, 2013, 26172530, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 23800, 2.2, 15800, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 33100, 3.9, 28600,  14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 43000, 5.2, 37700, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 52200, 6.5, 47600, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 61500,7.8, 56900, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 72200, 9.2, 66800, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 85700, 10.8, 78700, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 102400,12.8,93600, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 129800,15.6,114000, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.0,189800, 14);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,73000,14);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,23400,2.5,15500,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,31800,4.6,27900,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,39500,5.8,35500,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,46800,7.0,43200,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,53800,8.2,50300,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,62200,9.5,58000,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,72200,10.9,67000,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,84800,12.8,78300,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,104500,15.2,93300,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.5,143900,14);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,61300,14);

-- == 2014 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (15, 2014, 26618560, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 25000,2.3,17100, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 34800,4.0,29900, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 44300,5.4,39700, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 53100,6.6,48700, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 62500,7.8,57800, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 73200,9.1,67700, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 85200,10.7,79100, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 102000,12.6,93200, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 129500,15.4,113900, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.0,192600, 15);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11, 0,100,74000, 15);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 24700, 2.6,16400,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,33100,4.7,29000,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,40800,6.0,37100,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,47600,7.2,44200,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,54700,8.3,51100,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,62500,9.5,58500,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,72000,10.9,67200,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,84200,12.6,77600,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,103700,15.0,92500,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.4,144900,15);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100.0,61900,15);

-- == 2015 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (16, 2015, 26810840, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1, 24800,2.3,16900, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2, 34200,3.9,29400, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3, 44300,5.3,39300, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4, 53500,6.6,48900, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 63500,7.9,58600, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 73800,9.2,68700, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7, 85900,10.7,79400, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8, 103000,12.6,93800, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9, 131700,15.5,115600, 16);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10, 0,26.1,194600, 16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,74500,16);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,24400,2.6,16400,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,32600,4.6,28500,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,40500,5.9,36600,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,48200,7.1,44300,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,55600,8.3,51800,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,63300,9.5,59400,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,72000,10.8,67400,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,84800,12.5,78200,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,105800,15.1,94200,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.5,62400,16);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,146700,16);

-- == 2016 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (17, 2016, 27090400, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,25400,2.3,17200, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,35100,4.1,30200, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,44300,5.4,39700, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,53600,6.6,48900, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 63400,7.9,58500, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6, 73300,9.2,68100, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,85500,10.7,79100, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,101600,12.6,93000, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,127600,15.3,113000, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,25.8,190400, 17);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0, 100,62000, 17);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,25100,2.7,16700, 17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,33300,4.7,29400,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,40900,6.0,37300,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,48000,7.2,44400,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,55500,8.4,51800,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,63100,9.6,59400,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,72200,10.9,67500,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,83900,12.5,77700,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,103500,15.0,92700,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,23.1,143000,17);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,100.0,62000,17);

-- == 2017 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (18, 2017, 27465380, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,25900,2.3,17800, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,35600,4.1,30900, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,44900,5.3,40200, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,54500,6.5,49600, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,64400,7.8,59400, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,75000,9.2,69700, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,87700,10.7,81100, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,104500,12.6,95700, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,132200,15.4,116800, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,26.2,198800, 18);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,76000, 18);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,25500,2.7,17300,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,34200,4.7,30000,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,41400,5.9,37800,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,48700,7.1,45100,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,56400,8.3,52600,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,64700,9.5,60500,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,73900,10.8,69000,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,86200,12.6,80000,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,107100,15.0,95400,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.4,148600,18);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,63600,18);

-- == 2018 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (19, 2018, 28044140, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,26600, 2.4, 18200, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,36700,4.1,31700, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,46200,5.4,41500, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,55800,6.7,51000, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,65100,7.9,60400, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,75700,9.2,70400, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,88200,10.7,81700, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,104900,12.5,96000, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,132200,15.3,117000, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,25.8,197300, 19);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,100,76500, 19);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,26200,2.7,17300, 19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,35000,4.8,30700,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,42500,6.1,38700,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,49600,7.2,46100,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,56800,8.3,53300,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,64900,9.5,60800,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,74200,10.8,69400,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,86600,12.5,79900,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,106900,15.0,95600,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.1,147400,19);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,63900,19);

-- == 2019 == 
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (20, 2019, 28504260, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,27400,2.5,18900,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,37200,4.2,32400,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,47100,5.5,42200,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,56500,6.7,51800,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5, 66200,8.0,61300,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,76300,9.3,71200,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,89100,10.8,82600,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,105700,12.7,97400,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,132200,15.3,117700,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,25.0,192200,20);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,76800,20);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,27000,2.8,18200,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,35300,4.9,31400,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,43000,6.1,39300,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,50400,7.2,46700,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,57900,8.4,54100,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,65600,9.6,61800,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,74900,10.9,70300,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,87800,12.6,81100,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,107600,14.9,96500,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,25.0,146000,20);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,64500,20);

-- == 2020 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (21, 2020, 28696810, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,31900,2.9,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,41900,4.6,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,51000,5.6,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,60200,6.9,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,69600,8.0,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,80100,9.2,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,92500,10.6,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,109200,12.4,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,136900,14.8,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,24.6,23600,21);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,80900,21);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,27000,2.8,18200,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,35300,4.9,31400,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,43000,6.1,39300,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,50400,7.2,46700,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,57900,8.4,54100,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,65600,9.6,61800,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,74900,10.9,70300,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,87800,12.6,81100,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,107600,14.9,96500,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,22,149700,21);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,68000,21);

-- == 2021 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (22, 2021, 28931530, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,30900,2.8,22700,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,41600,4.4,36400,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,51000,5.6,46300,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,60500,6.8,55800,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,70000,8.0,64700,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,80400,9.2,75200,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,92900,10.5,86500,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,109200,12.3,100700,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,138100,14.8,121700,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,24.6,199200,22);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,80900,22);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,29700,3.0,20200,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,38800,5.1,34500,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,46400,6.3,42700,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,53500,7.4,50000,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,60700,8.4,57100,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,68600,9.5,64500,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,77900,10.8,73000,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,89400,12.3,83300,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,110200,14.5,98500,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,22.7,153500,22);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,67700,22);

-- == 2022 ==
INSERT INTO yearStatistics ("yearStatsId", "year", "taxPayers", "countryId") VALUES (23, 2022, 29769800, 1);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,28800,2.5,20100,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,39600,4.2,34300,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,49600,5.5,44700,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,59300,6.7,54500,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,69200,7.9,64200,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,79900,9.1,74400,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,92800,10.5,86100,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,109800,12.3,100700,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,139700,15.0,122900,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,26.4,215700,23);
INSERT INTO yearStatsBefore ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,81800,23);

INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (1,28000,2.7,17900,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (2,37300,4.9,32900,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (3,45100,6.2,41300,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (4,52500,7.3,48800,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (5,60000,8.4,56200,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (6,67800,9.5,63900,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (7,77400,10.8,72500,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (8,89700,12.4,83200,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (9,110400,14.7,99000,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (10,0,23.2,155700,23);
INSERT INTO yearStatsAfter ("decile", "upperIncomeLimit", "shareOfIncome", "averageIncome", "yearStatsId") VALUES (11,0,100,67100,23);
