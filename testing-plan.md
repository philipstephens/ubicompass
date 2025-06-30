# UBI Compass Testing Plan

## Overview
This testing plan covers the new clean architecture implementation with both unit tests and integration tests for the refactored UBI Compass application.

## Testing Strategy

### 1. Unit Tests
Test individual components and services in isolation.

### 2. Integration Tests
Test how components work together and with external dependencies.

### 3. End-to-End Tests
Test complete user workflows in the browser.

### 4. Manual Testing
Verify user experience and edge cases.

---

## Phase 1: Unit Tests

### Data Layer Tests

#### `src/data/year-contexts.ts`
- ✅ **Test year context retrieval**
  - Valid years return correct context
  - Invalid years return null
  - All years 2000-2022 have complete data
  - Brief descriptions are non-empty

#### `src/data/static-translations.ts`
- ✅ **Test translation retrieval**
  - English translations exist for all keys
  - French and Spanish translations exist for all keys
  - Fallback to English works correctly
  - Supported languages list is correct

#### `src/data/population-estimates.ts`
- ✅ **Test population calculations**
  - Population totals are reasonable (30M-40M for Canada)
  - Age group breakdowns sum to total
  - Population grows over time (2000 < 2022)
  - Economic data is realistic

### Service Layer Tests

#### `src/services/calculation-service.ts`
- ✅ **Test UBI cost calculations**
  - Child UBI cost = children × monthly amount × 12
  - Youth UBI cost = youth × monthly amount × 12
  - Adult UBI cost = (adults + seniors) × annual amount
  - Senior bonus cost = seniors × monthly bonus × 12
  - Gross cost = sum of all UBI costs

- ✅ **Test tax revenue calculations**
  - Tax revenue = (income + UBI - exemption) × tax rate × taxpayers
  - Handles negative taxable income (sets to 0)
  - Only adults and seniors pay taxes

- ✅ **Test feasibility assessment**
  - < 5% GDP = FEASIBLE
  - 5-10% GDP = CHALLENGING
  - > 10% GDP = DIFFICULT

- ✅ **Test parameter validation**
  - Negative amounts rejected
  - Age cutoffs in logical order
  - Tax percentage 0-100%

#### `src/services/translation-service.ts`
- ✅ **Test static mode**
  - Returns pre-translated text for supported languages
  - Falls back to English for unsupported languages
  - Cache operations work correctly

- ✅ **Test dynamic mode**
  - API calls formatted correctly
  - Cache prevents duplicate API calls
  - Progress tracking works
  - Error handling falls back to English

#### `src/services/population-service.ts`
- ✅ **Test static mode**
  - Returns population estimates
  - Marks data as estimated
  - Handles missing years gracefully

- ✅ **Test database mode**
  - API calls formatted correctly
  - Falls back to estimates on failure
  - Marks data correctly (estimated vs actual)

---

## Phase 2: Integration Tests

### Component Integration

#### `src/components/simple-ubi-calculator.tsx`
- ✅ **Test parameter changes**
  - Year selection updates calculations
  - UBI amount sliders update results
  - Tax parameter changes affect feasibility
  - Age cutoff changes affect population breakdown

- ✅ **Test calculation flow**
  - Parameters → Population Service → Calculation Service → Results
  - Error handling when services fail
  - Loading states display correctly

- ✅ **Test translation integration**
  - Language changes update all text
  - Static translations work in all supported languages
  - Missing translations fall back to English

### Service Integration

#### Translation + Population Services
- ✅ **Test combined usage**
  - Population descriptions translate correctly
  - Economic context labels translate
  - Year contexts remain in English (as specified)

#### Calculation + Population Services
- ✅ **Test data flow**
  - Population data feeds into calculations correctly
  - Economic context affects feasibility assessment
  - Age cutoffs properly segment population

---

## Phase 3: End-to-End Tests

### User Workflows

#### Basic UBI Analysis
1. **Load application**
   - Page loads without errors
   - Default parameters are reasonable
   - Initial calculation displays

2. **Change parameters**
   - Year selection updates context
   - UBI amounts affect costs
   - Tax settings change feasibility

3. **Review results**
   - Feasibility status is clear
   - Key metrics are formatted correctly
   - Economic context provides useful information

#### Language Switching
1. **Switch to French**
   - All UI text translates
   - Numbers format correctly
   - Year contexts remain in English

2. **Switch to Spanish**
   - All UI text translates
   - Currency formatting works
   - Population descriptions translate

#### Edge Cases
1. **Extreme parameters**
   - Very high UBI amounts
   - Very low tax rates
   - Unusual age cutoffs

2. **Data edge cases**
   - Years with limited data
   - Population estimation fallbacks
   - Economic data missing

---

## Phase 4: Manual Testing Checklist

### User Experience
- [ ] **Visual Design**
  - Components have proper spacing
  - Colors match design system
  - Responsive layout works on mobile
  - Loading states are clear

- [ ] **Usability**
  - Sliders are easy to use
  - Results update in real-time
  - Error messages are helpful
  - Navigation is intuitive

### Performance
- [ ] **Load Times**
  - Initial page load < 3 seconds
  - Parameter changes update < 500ms
  - Translation switching < 1 second
  - No memory leaks during extended use

### Accessibility
- [ ] **Screen Reader Support**
  - All controls have labels
  - Results are announced
  - Navigation works with keyboard
  - Color contrast meets standards

### Browser Compatibility
- [ ] **Modern Browsers**
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

### Mobile Testing
- [ ] **Responsive Design**
  - Layout adapts to small screens
  - Touch controls work properly
  - Text remains readable
  - Performance acceptable on mobile

---

## Test Implementation Plan

### Step 1: Create Test Files
```
src/
├── tests/
│   ├── unit/
│   │   ├── data/
│   │   │   ├── year-contexts.test.ts
│   │   │   ├── static-translations.test.ts
│   │   │   └── population-estimates.test.ts
│   │   ├── services/
│   │   │   ├── calculation-service.test.ts
│   │   │   ├── translation-service.test.ts
│   │   │   └── population-service.test.ts
│   │   └── components/
│   │       └── simple-ubi-calculator.test.tsx
│   ├── integration/
│   │   ├── service-integration.test.ts
│   │   └── component-integration.test.tsx
│   └── e2e/
│       ├── basic-workflow.test.ts
│       ├── language-switching.test.ts
│       └── edge-cases.test.ts
```

### Step 2: Set Up Testing Framework
- Install Vitest for unit/integration tests
- Install Playwright for E2E tests
- Configure test environment
- Set up CI/CD pipeline

### Step 3: Write Tests (Priority Order)
1. **High Priority**: Calculation service tests
2. **High Priority**: Simple calculator component tests
3. **Medium Priority**: Data layer tests
4. **Medium Priority**: Service integration tests
5. **Low Priority**: E2E tests

### Step 4: Test Execution
1. Run unit tests locally
2. Fix any failing tests
3. Run integration tests
4. Perform manual testing
5. Execute E2E tests

---

## Success Criteria

### Unit Tests
- ✅ 90%+ code coverage
- ✅ All critical calculations tested
- ✅ Error handling verified
- ✅ Edge cases covered

### Integration Tests
- ✅ Service interactions work correctly
- ✅ Component state management verified
- ✅ Translation integration confirmed

### E2E Tests
- ✅ Complete user workflows function
- ✅ Cross-browser compatibility verified
- ✅ Performance benchmarks met

### Manual Testing
- ✅ User experience is smooth
- ✅ Accessibility requirements met
- ✅ Mobile experience acceptable
- ✅ No critical bugs found

---

## Risk Mitigation

### High-Risk Areas
1. **Calculation accuracy** - Extensive unit tests with known values
2. **Translation integration** - Mock API responses for testing
3. **Population data accuracy** - Validate against Statistics Canada
4. **Performance with large datasets** - Load testing with realistic data

### Fallback Plans
1. **Service failures** - Graceful degradation to estimates
2. **Translation failures** - Fallback to English
3. **Performance issues** - Lazy loading and caching
4. **Browser compatibility** - Progressive enhancement

This testing plan ensures the new architecture is robust, reliable, and provides an excellent user experience across all scenarios.
