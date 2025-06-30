/**
 * Global setup for Jest tests
 * Runs once before all tests
 */

export default async function globalSetup() {
  console.log('🧪 Setting up UBI Compass test environment...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.QWIK_TEST_MODE = 'true';
  
  // Mock database connection for tests
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_ubi_database';
  
  // Set up test data directory
  process.env.TEST_DATA_DIR = './src/test-utils/test-data';
  
  // Configure test timeouts
  process.env.TEST_TIMEOUT = '10000';
  
  console.log('✅ Test environment setup complete');
}
