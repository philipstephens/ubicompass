/**
 * Jest setup file - runs before each test
 */
import '@testing-library/jest-dom';

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeEach(() => {
  // Reset console mocks before each test
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  // Restore original console methods after each test
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for responsive components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame for animation tests
global.requestAnimationFrame = jest.fn().mockImplementation(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn().mockImplementation(id => clearTimeout(id));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch for API calls
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Custom matchers for UBI Compass testing
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toBeValidCurrency(received: string) {
    const currencyRegex = /^\$\d{1,3}(,\d{3})*(\.\d{1,2})?[BMK]?$/;
    const pass = currencyRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be valid currency format`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be valid currency format`,
        pass: false,
      };
    }
  },

  toBeValidPercentage(received: string) {
    const percentageRegex = /^\d{1,3}(\.\d{1,2})?%$/;
    const pass = percentageRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be valid percentage format`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be valid percentage format`,
        pass: false,
      };
    }
  },
});

// Declare custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
      toBeValidCurrency(): R;
      toBeValidPercentage(): R;
    }
  }
}
