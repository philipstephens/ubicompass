/**
 * Jest configuration for UBI Compass testing
 */
module.exports = {
  preset: '@builder.io/qwik/testing',
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}'
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Module name mapping for imports
  moduleNameMapping: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/jest-setup.ts'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/test-utils/**',
    '!src/entry.*.ts',
    '!src/root.tsx',
  ],
  
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Timeout for tests
  testTimeout: 10000,
  
  // Global setup/teardown
  globalSetup: '<rootDir>/src/test-utils/global-setup.ts',
  globalTeardown: '<rootDir>/src/test-utils/global-teardown.ts',
};
