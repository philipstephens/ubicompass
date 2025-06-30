/**
 * Global teardown for Jest tests
 * Runs once after all tests
 */

export default async function globalTeardown() {
  console.log('🧹 Cleaning up UBI Compass test environment...');
  
  // Clean up any test files or resources
  // Reset environment variables
  delete process.env.QWIK_TEST_MODE;
  delete process.env.TEST_DATA_DIR;
  delete process.env.TEST_TIMEOUT;
  
  console.log('✅ Test environment cleanup complete');
}
