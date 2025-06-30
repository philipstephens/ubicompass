#!/usr/bin/env node

/**
 * Test execution script for UBI Compass
 * Runs tests in the correct order and provides detailed reporting
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkDependencies() {
  log('\n📦 Checking dependencies...', colors.blue);
  
  const requiredFiles = [
    'node_modules',
    'vitest.config.ts',
    'src/tests/setup.ts',
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(file));
  
  if (missingFiles.length > 0) {
    log(`❌ Missing required files: ${missingFiles.join(', ')}`, colors.red);
    log('Please run: npm install', colors.yellow);
    return false;
  }

  log('✅ All dependencies found', colors.green);
  return true;
}

async function runUnitTests() {
  log('\n🧪 Running Unit Tests...', colors.blue);
  log('=' .repeat(50), colors.cyan);
  
  try {
    await runCommand('npm', ['run', 'test:unit']);
    log('✅ Unit tests passed!', colors.green);
    return true;
  } catch (error) {
    log('❌ Unit tests failed!', colors.red);
    log(error.message, colors.red);
    return false;
  }
}

async function runIntegrationTests() {
  log('\n🔗 Running Integration Tests...', colors.blue);
  log('=' .repeat(50), colors.cyan);
  
  try {
    // Check if integration tests exist
    if (!existsSync('src/tests/integration')) {
      log('⚠️  No integration tests found, skipping...', colors.yellow);
      return true;
    }
    
    await runCommand('npm', ['run', 'test:integration']);
    log('✅ Integration tests passed!', colors.green);
    return true;
  } catch (error) {
    log('❌ Integration tests failed!', colors.red);
    log(error.message, colors.red);
    return false;
  }
}

async function runCoverageReport() {
  log('\n📊 Generating Coverage Report...', colors.blue);
  log('=' .repeat(50), colors.cyan);
  
  try {
    await runCommand('npm', ['run', 'test:coverage']);
    log('✅ Coverage report generated!', colors.green);
    log('📁 Check coverage/index.html for detailed report', colors.cyan);
    return true;
  } catch (error) {
    log('❌ Coverage generation failed!', colors.red);
    log(error.message, colors.red);
    return false;
  }
}

async function runE2ETests() {
  log('\n🌐 Running E2E Tests...', colors.blue);
  log('=' .repeat(50), colors.cyan);
  
  try {
    // Check if E2E tests exist
    if (!existsSync('tests') && !existsSync('e2e')) {
      log('⚠️  No E2E tests found, skipping...', colors.yellow);
      return true;
    }
    
    await runCommand('npm', ['run', 'test:e2e']);
    log('✅ E2E tests passed!', colors.green);
    return true;
  } catch (error) {
    log('❌ E2E tests failed!', colors.red);
    log(error.message, colors.red);
    return false;
  }
}

async function runLinting() {
  log('\n🔍 Running Linting...', colors.blue);
  log('=' .repeat(50), colors.cyan);
  
  try {
    await runCommand('npm', ['run', 'lint']);
    log('✅ Linting passed!', colors.green);
    return true;
  } catch (error) {
    log('❌ Linting failed!', colors.red);
    log(error.message, colors.red);
    return false;
  }
}

async function runTypeChecking() {
  log('\n📝 Running Type Checking...', colors.blue);
  log('=' .repeat(50), colors.cyan);
  
  try {
    await runCommand('npm', ['run', 'build.types']);
    log('✅ Type checking passed!', colors.green);
    return true;
  } catch (error) {
    log('❌ Type checking failed!', colors.red);
    log(error.message, colors.red);
    return false;
  }
}

function printSummary(results) {
  log('\n📋 Test Summary', colors.bright);
  log('=' .repeat(50), colors.cyan);
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    const color = result.passed ? colors.green : colors.red;
    log(`${icon} ${result.name}`, color);
  });
  
  log(`\n📊 Overall: ${passed}/${total} test suites passed`, 
      passed === total ? colors.green : colors.red);
  
  if (passed === total) {
    log('\n🎉 All tests passed! Ready for deployment.', colors.green);
  } else {
    log('\n⚠️  Some tests failed. Please fix issues before deployment.', colors.yellow);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const runAll = args.length === 0 || args.includes('--all');
  const runQuick = args.includes('--quick');
  const runCoverage = args.includes('--coverage');
  
  log('🚀 UBI Compass Test Suite', colors.bright);
  log('=' .repeat(50), colors.cyan);
  
  // Check dependencies first
  const depsOk = await checkDependencies();
  if (!depsOk) {
    process.exit(1);
  }
  
  const results = [];
  
  try {
    // Always run unit tests
    if (runAll || args.includes('--unit')) {
      const unitPassed = await runUnitTests();
      results.push({ name: 'Unit Tests', passed: unitPassed });
    }
    
    // Run integration tests if requested
    if (runAll || args.includes('--integration')) {
      const integrationPassed = await runIntegrationTests();
      results.push({ name: 'Integration Tests', passed: integrationPassed });
    }
    
    // Run linting and type checking for quick validation
    if (!runQuick) {
      const lintPassed = await runLinting();
      results.push({ name: 'Linting', passed: lintPassed });
      
      const typesPassed = await runTypeChecking();
      results.push({ name: 'Type Checking', passed: typesPassed });
    }
    
    // Run coverage if requested
    if (runCoverage || args.includes('--coverage')) {
      const coveragePassed = await runCoverageReport();
      results.push({ name: 'Coverage Report', passed: coveragePassed });
    }
    
    // Run E2E tests if requested (usually for full CI)
    if (args.includes('--e2e')) {
      const e2ePassed = await runE2ETests();
      results.push({ name: 'E2E Tests', passed: e2ePassed });
    }
    
    // Print summary
    printSummary(results);
    
    // Exit with error code if any tests failed
    const allPassed = results.every(r => r.passed);
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    log(`\n💥 Test execution failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('🚀 UBI Compass Test Runner', colors.bright);
  log('\nUsage: node run-tests.js [options]', colors.cyan);
  log('\nOptions:', colors.yellow);
  log('  --all         Run all tests (default)');
  log('  --unit        Run only unit tests');
  log('  --integration Run only integration tests');
  log('  --e2e         Run only E2E tests');
  log('  --coverage    Generate coverage report');
  log('  --quick       Skip linting and type checking');
  log('  --help, -h    Show this help message');
  log('\nExamples:', colors.yellow);
  log('  node run-tests.js                    # Run all tests');
  log('  node run-tests.js --unit --coverage  # Run unit tests with coverage');
  log('  node run-tests.js --quick            # Quick test run');
  process.exit(0);
}

// Run the main function
main().catch(error => {
  log(`💥 Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});
