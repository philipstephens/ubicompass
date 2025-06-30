/**
 * Test setup file for Vitest
 * Configures global test environment and mocks
 */

import { vi } from 'vitest';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock window object
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
  },
  writable: true,
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
