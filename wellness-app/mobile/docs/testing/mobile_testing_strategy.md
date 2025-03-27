# Mobile Frontend Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the Wellness App mobile frontend (/wellness-app/mobile). It builds upon the backend testing strategy while addressing the specific needs and challenges of React Native mobile application testing.

## Testing Pyramid

Our mobile testing strategy follows the testing pyramid approach with the following layers:

1. **Static Analysis** - ESLint and TypeScript for code quality and type checking
2. **Unit Tests** - Testing individual components, hooks, and utilities in isolation
3. **Component Tests** - Testing React Native components with their interactions
4. **Integration Tests** - Testing interactions between multiple components and services
5. **End-to-End Tests** - Testing complete user flows in a production-like environment

## Testing Tools

### Primary Tools

- **Jest**: Test runner and assertion library
- **React Native Testing Library (RNTL)**: Component testing utility
- **Mock Service Worker (MSW)**: API mocking
- **Detox**: End-to-end testing framework for React Native
- **TestContainers**: For backend integration testing

### Supporting Tools

- **ESLint**: Static code analysis
- **TypeScript**: Static type checking
- **React DevTools**: Component debugging
- **Flipper**: Mobile app debugging
- **TestContainers Cloud**: Cloud-based container infrastructure for CI/CD

## Testing Approaches

### 1. Static Analysis

Static analysis is the first line of defense against bugs and code quality issues.

**Implementation:**
- Configure ESLint with React Native specific rules
- Use TypeScript for type checking
- Integrate with CI/CD pipeline to run on every commit
- Enforce code style and best practices

**Benefits:**
- Catches errors before runtime
- Ensures consistent code style
- Improves code maintainability
- Provides immediate feedback during development

### 2. Unit Testing

Unit tests focus on testing individual functions, hooks, and utilities in isolation.

**Implementation:**
- Use Jest for test running and assertions
- Mock dependencies using Jest mock functions
- Test Redux reducers, selectors, and actions
- Test custom hooks with `@testing-library/react-hooks`
- Test utility functions with simple input/output assertions

**Key Areas to Test:**
- Redux state management (reducers, actions, selectors)
- API service functions
- Custom hooks
- Utility functions
- Data transformation logic

### 3. Component Testing

Component tests verify that UI components render correctly and respond appropriately to user interactions.

**Implementation:**
- Use React Native Testing Library for rendering and querying components
- Test component rendering, props handling, and state changes
- Test user interactions using RNTL's fireEvent
- Use snapshot testing for UI regression testing

**Key Areas to Test:**
- Screen components
- Reusable UI components
- Navigation flows
- Form components and validation
- Error states and loading indicators

### 4. Integration Testing

Integration tests verify that different parts of the application work together correctly.

**Implementation:**
- Test interactions between components and services
- Mock API responses using Mock Service Worker
- Test data flow through multiple components
- Test navigation between screens
- Test integration with device features (when applicable)

**Key Areas to Test:**
- Screen-to-screen navigation
- Data fetching and rendering
- Form submission flows
- Authentication flows
- Health data synchronization

### 5. End-to-End Testing

End-to-end tests verify complete user flows in a production-like environment.

**Implementation:**
- Use Detox for end-to-end testing on real or simulated devices
- Test critical user journeys from start to finish
- Test on both iOS and Android platforms
- Include backend integration where necessary

**Key Areas to Test:**
- User registration and login
- Health data synchronization with external APIs
- Dashboard data visualization
- Settings and profile management
- Offline functionality

## Test Data Management

### Approach

1. **Fixture Files**: Store test data in JSON files for reuse across tests
2. **Factory Functions**: Create test data programmatically with sensible defaults
3. **Mock API Responses**: Use MSW to intercept and mock API calls
4. **TestContainers**: For tests requiring real database interactions

### Implementation

```javascript
// Example factory function for health data
export function createMentalHealthData(overrides = {}) {
  return {
    id: 'mental-test-1',
    date: '2025-03-24',
    score: 85,
    stress: 30,
    anxiety: 25,
    mood: 90,
    ...overrides
  };
}
```

## Mocking Strategy

### External Dependencies

- **API Services**: Mock using MSW or Jest mock functions
- **Native Modules**: Mock using Jest manual mocks
- **Device Features**: Mock using React Native's jest preset
- **Third-party Libraries**: Mock or provide test implementations

### Example

```javascript
// Mocking a native module
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '100')
}));

// Mocking API with MSW
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('https://api.example.com/health/mental', (req, res, ctx) => {
    return res(ctx.json([createMentalHealthData()]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Test Environment Setup

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation|@react-native-community)/)'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/e2e/']
};
```

### Detox Configuration

```javascript
// e2e/config.json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/jest.config.js",
  "apps": {
    "ios": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/WellnessApp.app",
      "build": "xcodebuild -workspace ios/WellnessApp.xcworkspace -scheme WellnessApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd .."
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 14"
      }
    },
    "emulator": {
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_4_API_30"
      }
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Mobile Tests

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'wellness-app/mobile/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'wellness-app/mobile/**'

jobs:
  static-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
          cache-dependency-path: 'wellness-app/mobile/yarn.lock'
      - name: Install dependencies
        run: cd wellness-app/mobile && yarn install
      - name: Run ESLint
        run: cd wellness-app/mobile && yarn lint
      - name: Run TypeScript check
        run: cd wellness-app/mobile && yarn tsc --noEmit

  unit-and-component-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
          cache-dependency-path: 'wellness-app/mobile/yarn.lock'
      - name: Install dependencies
        run: cd wellness-app/mobile && yarn install
      - name: Install TestContainers Cloud agent
        run: |
          curl -L -o tc-cloud-agent.sh https://app.testcontainers.cloud/download/testcontainers-cloud-agent.sh
          sh tc-cloud-agent.sh --max-concurrency=4
      - name: Run tests
        run: cd wellness-app/mobile && yarn test
        env:
          TC_CLOUD_TOKEN: ${{ secrets.TC_CLOUD_TOKEN }}
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./wellness-app/mobile/coverage/lcov.info
          flags: mobile

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
          cache-dependency-path: 'wellness-app/mobile/yarn.lock'
      - name: Install dependencies
        run: cd wellness-app/mobile && yarn install
      - name: Install Detox dependencies
        run: |
          brew tap wix/brew
          brew install applesimutils
      - name: Build iOS app for testing
        run: cd wellness-app/mobile && yarn build:ios:e2e
      - name: Run Detox tests on iOS
        run: cd wellness-app/mobile && yarn test:e2e:ios
```

## Test Organization

### Directory Structure

```
wellness-app/mobile/
├── src/
│   ├── components/
│   ├── screens/
│   ├── redux/
│   └── ...
├── tests/
│   ├── __fixtures__/        # Test data fixtures
│   ├── __mocks__/           # Manual mocks
│   ├── unit/                # Unit tests
│   │   ├── redux/
│   │   ├── hooks/
│   │   └── utils/
│   ├── components/          # Component tests
│   │   ├── common/
│   │   └── screens/
│   ├── integration/         # Integration tests
│   │   ├── api/
│   │   └── flows/
│   └── setup.js             # Test setup file
├── e2e/                     # End-to-end tests
│   ├── flows/
│   ├── config.json
│   └── jest.config.js
└── jest.config.js
```

## Best Practices

### General

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Semantic Queries**: Query elements by role, text, or test ID, not by class or tag
3. **Test User Interactions**: Test how users interact with your app, not internal methods
4. **Keep Tests Independent**: Each test should be able to run independently
5. **Use Test Doubles Wisely**: Prefer realistic test doubles over simple stubs

### React Native Specific

1. **Mock Native Modules**: Use Jest's manual mocking system for native modules
2. **Handle Animations**: Disable animations in tests or mock the Animation API
3. **Test Platform-Specific Code**: Test iOS and Android specific code separately
4. **Use testID Props**: Add testID props to components for easier querying
5. **Test Accessibility**: Verify that components have proper accessibility labels

### Component Testing

1. **Render Components in Isolation**: Test components in isolation from their dependencies
2. **Test Component Props**: Verify that components handle props correctly
3. **Test User Interactions**: Use fireEvent to simulate user interactions
4. **Test State Changes**: Verify that components update correctly when state changes
5. **Use Snapshot Testing Sparingly**: Use snapshots for UI regression testing, but don't rely on them exclusively

## Implementation Plan

### Phase 1: Infrastructure Setup

1. Configure Jest and React Native Testing Library
2. Set up ESLint and TypeScript
3. Create test directory structure
4. Configure CI/CD pipeline

### Phase 2: Unit and Component Tests

1. Implement tests for Redux store (reducers, actions, selectors)
2. Implement tests for utility functions and hooks
3. Implement tests for reusable components
4. Implement tests for screen components

### Phase 3: Integration and E2E Tests

1. Set up Mock Service Worker for API mocking
2. Implement integration tests for key user flows
3. Configure Detox for E2E testing
4. Implement E2E tests for critical user journeys

### Phase 4: TestContainers Integration

1. Set up TestContainers for backend integration tests
2. Configure TestContainers Cloud for CI/CD
3. Implement tests that require real database interactions

## Conclusion

This comprehensive testing strategy for the Wellness App mobile frontend ensures high code quality, reliability, and maintainability. By implementing a multi-layered testing approach with the right tools and practices, we can deliver a robust mobile application that meets user needs and business requirements.
