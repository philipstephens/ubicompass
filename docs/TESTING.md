# UBI Compass Testing Guide

## Overview

This document describes the comprehensive testing strategy for the UBI Compass Redesigned GUI, including unit tests, integration tests, and testing best practices.

## Test Structure

### 📁 Test Organization

```
src/
├── components/
│   ├── ubi-amounts-control/
│   │   ├── ubi-amounts-control.tsx
│   │   └── ubi-amounts-control.test.tsx
│   ├── results-dashboard/
│   │   ├── results-dashboard.tsx
│   │   └── results-dashboard.test.tsx
│   └── ubi-compass-redesigned.test.tsx
├── contexts/
│   ├── ubi-compass-context.tsx
│   └── ubi-compass-context.test.tsx
├── test-utils/
│   ├── test-setup.ts
│   ├── jest-setup.ts
│   ├── global-setup.ts
│   └── global-teardown.ts
└── scripts/
    └── run-tests.sh
```

## Test Categories

### 🧪 Unit Tests

**Purpose**: Test individual components and functions in isolation

**Coverage**:
- ✅ UBI Amounts Control component
- ✅ Results Dashboard component  
- ✅ Central State Management (Context)
- ✅ Calculation functions
- ✅ Data formatting utilities

**Key Test Areas**:
- Component rendering
- Props handling
- State management
- Calculations accuracy
- Error handling
- Accessibility

### 🔗 Integration Tests

**Purpose**: Test component interactions and data flow

**Coverage**:
- ✅ UBI Compass main component
- ✅ Component communication
- ✅ Central state coordination
- ✅ Service integration
- ✅ End-to-end workflows

**Key Test Areas**:
- Data flow between components
- State synchronization
- Service mocking
- User interaction flows
- Performance under load

## Running Tests

### 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### 🛠️ Advanced Usage

```bash
# Run only unit tests
./scripts/run-tests.sh --unit

# Run only integration tests
./scripts/run-tests.sh --integration

# Run with coverage and verbose output
./scripts/run-tests.sh --coverage --verbose

# Watch mode for development
./scripts/run-tests.sh --watch
```

## Test Utilities

### 🔧 Mock Factories

```typescript
// Create mock UBI context
const mockContext = createMockUbiCompassContext({
  ubiAmounts: { child: 300, youth: 500, adult: 1300, senior: 1600 }
});

// Create test population data
const population = createTestPopulationData({
  childPopulation: 6000000
});

// Create test UBI amounts
const amounts = createTestUbiAmounts({
  adult: 1500
});
```

### 📊 Calculation Helpers

```typescript
// Calculate expected UBI cost
const expectedCost = calculateExpectedUbiCost(ubiAmounts, populationData);

// Calculate expected tax revenue
const expectedTax = calculateExpectedTaxRevenue(populationData, taxParameters);

// Assertion helpers
expectCurrencyFormat(value, 123.4); // Expects $123.4B format
expectPercentageFormat(value, 45.6); // Expects 45.6% format
```

### 🎭 Service Mocking

```typescript
// Mock government spending service
jest.mock('../services/government-spending-service', () => ({
  getGovernmentSpendingSummary: jest.fn().mockResolvedValue(mockSummary),
  getSocialProgramsData: jest.fn().mockResolvedValue(mockPrograms),
  calculateUbiReplacementAnalysis: jest.fn().mockResolvedValue(mockAnalysis),
}));
```

## Test Coverage Goals

### 📈 Coverage Targets

- **Lines**: 70% minimum
- **Functions**: 70% minimum  
- **Branches**: 70% minimum
- **Statements**: 70% minimum

### 🎯 Priority Areas

**High Priority** (90%+ coverage):
- Central state management
- UBI cost calculations
- Tax revenue calculations
- Program savings analysis

**Medium Priority** (80%+ coverage):
- Component rendering
- User interactions
- Data formatting
- Error handling

**Lower Priority** (60%+ coverage):
- Styling and layout
- Animation effects
- Development utilities

## Test Scenarios

### 💰 UBI Calculations

```typescript
describe('UBI Cost Calculations', () => {
  it('should calculate total annual UBI cost correctly', () => {
    // Test: (200*5M + 400*3M + 1200*15M + 1500*7M) * 12 = $368.4B
    const result = calculateUbiCost(amounts, population);
    expect(result).toBeCloseTo(368400000000, -6);
  });
});
```

### 🏛️ Government Integration

```typescript
describe('Program Savings Integration', () => {
  it('should show before/after comparison', () => {
    // Test program replacement impact
    const beforeCost = ubiCost - taxRevenue;
    const afterCost = ubiCost - taxRevenue - programSavings;
    expect(afterCost).toBeLessThan(beforeCost);
  });
});
```

### 📊 Results Dashboard

```typescript
describe('Feasibility Analysis', () => {
  it('should determine correct feasibility status', () => {
    // Test feasibility logic
    if (isSelfFunded) expect(status).toBe('feasible');
    else if (fundingPercentage >= 75) expect(status).toBe('challenging');
    else expect(status).toBe('unfeasible');
  });
});
```

## Accessibility Testing

### ♿ A11y Test Areas

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Sufficient contrast ratios for text and backgrounds
- **Focus Management**: Logical focus order and visible focus indicators

### 🧪 A11y Test Examples

```typescript
it('should support keyboard navigation', () => {
  const sliders = screen.querySelectorAll('[role="slider"]');
  sliders.forEach(slider => {
    expect(slider.getAttribute('tabindex')).not.toBe('-1');
    expect(slider.getAttribute('aria-valuemin')).toBeTruthy();
    expect(slider.getAttribute('aria-valuemax')).toBeTruthy();
  });
});
```

## Performance Testing

### ⚡ Performance Metrics

- **Component Render Time**: < 100ms for initial render
- **State Update Time**: < 50ms for state changes
- **Calculation Time**: < 10ms for UBI cost calculations
- **Memory Usage**: No memory leaks during extended use

### 📊 Performance Test Examples

```typescript
it('should calculate results efficiently', () => {
  const startTime = performance.now();
  const result = calculateUbiCost(largePopulation, ubiAmounts);
  const endTime = performance.now();
  
  expect(endTime - startTime).toBeLessThan(10); // < 10ms
  expect(result).toBeGreaterThan(0);
});
```

## Continuous Integration

### 🔄 CI/CD Pipeline

1. **Pre-commit**: Run linting and type checking
2. **Pull Request**: Run full test suite with coverage
3. **Main Branch**: Run tests + generate coverage report
4. **Release**: Run all tests + performance benchmarks

### 📋 Test Commands

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "./scripts/run-tests.sh --unit",
    "test:integration": "./scripts/run-tests.sh --integration",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Best Practices

### ✅ Do's

- **Test behavior, not implementation**
- **Use descriptive test names**
- **Mock external dependencies**
- **Test edge cases and error conditions**
- **Keep tests focused and isolated**
- **Use realistic test data**

### ❌ Don'ts

- **Don't test internal implementation details**
- **Don't write overly complex test setups**
- **Don't ignore failing tests**
- **Don't skip accessibility testing**
- **Don't test third-party library functionality**

## Debugging Tests

### 🐛 Common Issues

1. **Component not rendering**: Check mock context setup
2. **Calculations incorrect**: Verify test data matches expectations
3. **Async operations failing**: Ensure proper async/await usage
4. **Mock not working**: Check mock import order and setup

### 🔍 Debug Tools

```typescript
// Debug component output
screen.debug(); // Prints DOM tree

// Debug specific element
screen.debug(screen.getByTestId('ubi-cost'));

// Check what queries are available
screen.logTestingPlaygroundURL();
```

## Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Ensure 70%+ coverage** for new code
3. **Add integration tests** for component interactions
4. **Update test documentation** for new test patterns
5. **Run full test suite** before submitting PR

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Qwik Testing Guide](https://qwik.builder.io/docs/testing/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Web Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)
