module.exports = {
  // Specify test environment
  testEnvironment: 'node',
  
  // Specify test file patterns
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],
  
  // Exclude patterns
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // Test setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/jest.setup.js'
  ],
  
  // Test timeout (increased for TestContainers)
  testTimeout: 60000,
  
  // Verbose output
  verbose: true,
  
  // Global variables
  globals: {
    'NODE_ENV': 'test'
  }
};
