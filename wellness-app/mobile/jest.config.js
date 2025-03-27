module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./tests/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation|@react-native-community)/)'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*',
    '!src/assets/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testEnvironment: 'node',
  verbose: true
};
