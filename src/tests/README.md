# UBI Compass Testing Guide

This directory contains comprehensive tests for the UBI Compass application, covering the new clean architecture implementation.

## Test Structure

```
src/tests/
├── unit/                    # Unit tests for individual components
│   ├── data/               # Tests for data layer
│   │   ├── year-contexts.test.ts
│   │   ├── static-translations.test.ts
│   │   └── population-estimates.test.ts
│   ├── services/           # Tests for service layer
│   │   ├── calculation-service.test.ts
│   │   ├── translation-service.test.ts
│   │   └── population-service.test.ts
│   └── components/         # Tests for UI components
│       └── simple-ubi-calculator.test.tsx
├── integration/            # Integration tests
│   └── service-integration.test.ts
├── e2e/                   # End-to-end tests (future)
├── setup.ts               # Test environment setup
└── README.md              # This file
```

## Running Tests

### Quick Start
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

### Using the Test Runner
```bash
# Run comprehensive test suite
node run-tests.js

# Run only unit tests
node run-tests.js --unit

# Quick test run (skip linting)
node run-tests.js --quick

# Generate coverage report
node run-tests.js --coverage

# Show help
node run-tests.js --help
```

## Test Categories

### Unit Tests

#### Data Layer Tests
- **year-contexts.test.ts**: Tests historical context data
  - Validates all years 2000-2022 have complete data
  - Checks economic indicators are realistic
  - Verifies major events are accurate

- **static-translations.test.ts**: Tests pre-translated text
  - Ensures all languages have consistent keys
  - Validates translation quality
  - Checks fallback mechanisms

- **population-estimates.test.ts**: Tests population data
  - Validates population growth over time
  - Checks age group calculations
  - Verifies economic data consistency

#### Service Layer Tests
- **calculation-service.test.ts**: Tests core UBI calculations
  - UBI cost calculations for all age groups
  - Tax revenue calculations
  - Feasibility assessment logic
  - Parameter validation
  - Currency and percentage formatting

- **translation-service.test.ts**: Tests translation functionality
  - Static mode translations
  - Dynamic mode with API calls
  - Caching mechanisms
  - Error handling and fallbacks

- **population-service.test.ts**: Tests population data access
  - Database vs static mode switching
  - Population breakdown calculations
  - Economic context retrieval
  - Data quality indicators

### Integration Tests

#### Service Integration
- **service-integration.test.ts**: Tests service interactions
  - Translation + Population service integration
  - Population + Calculation service workflows
  - Error handling across services
  - Data consistency during failures

## Test Configuration

### Vitest Configuration
The project uses Vitest for unit and integration testing:

- **Environment**: jsdom for DOM simulation
- **Coverage**: v8 provider with 80% thresholds
- **Setup**: Automatic mocking of fetch and localStorage
- **Globals**: Test functions available globally

### Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { calculateUBICosts } from '../../../services/calculation-service';

describe('UBI Cost Calculation', () => {
  it('should calculate child UBI costs correctly', () => {
    const population = { children: 1000000, /* ... */ };
    const parameters = { childUbiAmount: 500, /* ... */ };
    
    const costs = calculateUBICosts(parameters, population);
    
    expect(costs.childUbiCost).toBe(1000000 * 500 * 12);
  });
});
```

### Integration Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { TranslationService } from '../../services/translation-service';
import { PopulationService } from '../../services/population-service';

describe('Service Integration', () => {
  it('should work together correctly', async () => {
    const translationService = new TranslationService(true);
    const populationService = new PopulationService(false);
    
    // Test interaction between services
    const population = await populationService.getPopulationBreakdown(2022, 18, 18, 65);
    const description = populationService.getPopulationDescription(population, 18, 18, 65);
    
    expect(description.children).toContain('Children under 18');
  });
});
```

## Test Data

### Mock Data
Tests use realistic mock data based on Statistics Canada:
- Population: 38M total for 2022
- GDP: $2.74T for 2022
- Age distributions based on census data
- Economic indicators from historical records

### Test Scenarios
- **Realistic UBI**: $18k-24k adult UBI with 25-30% tax
- **Edge Cases**: Very high/low UBI amounts, extreme tax rates
- **Historical Years**: Tests across different economic periods
- **Language Support**: English, French, Spanish translations

## Continuous Integration

### GitHub Actions (Future)
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: node run-tests.js --coverage
      - uses: codecov/codecov-action@v3
```

### Pre-commit Hooks (Future)
```bash
# Install husky for git hooks
npm install --save-dev husky

# Run tests before commit
npx husky add .husky/pre-commit "npm run test:unit"
```

## Debugging Tests

### VS Code Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "--reporter=verbose"],
  "console": "integratedTerminal"
}
```

### Common Issues
1. **Import Errors**: Check file paths and exports
2. **Mock Failures**: Verify fetch and localStorage mocks
3. **Async Issues**: Ensure proper await usage
4. **Type Errors**: Check TypeScript configuration

## Performance Testing

### Benchmarks
- Unit tests should complete in < 5 seconds
- Integration tests should complete in < 15 seconds
- Memory usage should stay under 512MB
- No memory leaks during test runs

### Monitoring
```bash
# Run tests with memory monitoring
node --max-old-space-size=512 run-tests.js

# Profile test performance
npm run test -- --reporter=verbose --run
```

## Best Practices

### Test Organization
- One test file per source file
- Group related tests with `describe`
- Use descriptive test names
- Test both success and failure cases

### Test Quality
- Test behavior, not implementation
- Use realistic test data
- Mock external dependencies
- Verify error handling

### Maintenance
- Update tests when features change
- Remove obsolete tests
- Keep test data current
- Monitor coverage trends

## Future Enhancements

### Planned Additions
- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Accessibility tests
- [ ] Mobile device testing

### Test Automation
- [ ] Automated test generation
- [ ] Mutation testing
- [ ] Property-based testing
- [ ] Snapshot testing for UI components
