# Test Implementation Guide

This guide provides practical implementation details for setting up and executing the testing strategy for the Wellness App.

## 1. Test Setup Instructions

### 1.1 Backend Test Setup

#### Installation

```bash
# Install testing dependencies
cd backend
npm install --save-dev jest supertest mock-service-worker @types/jest 
npm install --save-dev neo4j-testcontainers testcontainers
```

#### Jest Configuration

Create `jest.config.js` in the backend directory:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/index.{js,ts}',
    '!src/config/*.{js,ts}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    'src/services/**/*.{js,ts}': {
      branches: 90,
      functions: 90,
      lines: 90
    },
    'src/utils/**/*.{js,ts}': {
      branches: 90,
      functions: 90,
      lines: 90
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,ts}',
    '<rootDir>/src/**/*.{spec,test}.{js,ts}'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts']
};
```

#### Test Setup File

Create `src/test/setup.ts`:

```typescript
// Global test setup
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test timeout
jest.setTimeout(30000);

// Mock console methods if needed
global.console = {
  ...console,
  // Uncomment to disable console.log during tests
  // log: jest.fn(),
  // info: jest.fn(),
  // error: jest.fn(),
};

// Global teardown
afterAll(async () => {
  // Close any open handles
});
```

### 1.2 Mobile Test Setup

#### Installation

```bash
# Install testing dependencies
cd mobile
npm install --save-dev @testing-library/react-native @testing-library/jest-native 
npm install --save-dev jest-expo msw react-test-renderer
```

#### Jest Configuration

Create `jest.config.js` in the mobile directory:

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/src/test/setup.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!src/**/__tests__/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    'src/redux/slices/**/*.{js,jsx,ts,tsx}': {
      branches: 95,
      functions: 95,
      lines: 95
    }
  }
};
```

#### Test Setup File

Create `src/test/setup.js`:

```javascript
// React Native specific setup
import 'react-native-gesture-handler/jestSetup';
import { mockImplementation as mockRNCNetInfo } from '@react-native-community/netinfo/jest/netinfo-mock.js';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  ...mockRNCNetInfo,
}));

// Mock deviceinfo
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0'),
  getBuildNumber: jest.fn(() => '1'),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

## 2. Test Examples

### 2.1 Backend Test Examples

#### Unit Test Example - User Service

Create `src/services/__tests__/user.service.test.js`:

```javascript
const userService = require('../../services/user.service');
const neo4j = require('../../config/neo4j');
const ApiError = require('../../utils/ApiError');

// Mock Neo4j
jest.mock('../../config/neo4j');

describe('User Service', () => {
  // Mock session and transaction
  const mockSession = {
    run: jest.fn(),
    close: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    neo4j.getSession.mockReturnValue(mockSession);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Mock data
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      // Mock database response
      mockSession.run.mockResolvedValueOnce({
        records: [{
          get: jest.fn().mockReturnValue({
            properties: {
              id: '123',
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
            }
          })
        }]
      });

      // Call service method
      const result = await userService.createUser(userData);

      // Assertions
      expect(neo4j.getSession).toHaveBeenCalled();
      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('CREATE (u:User'),
        expect.objectContaining({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        })
      );
      
      expect(result).toMatchObject({
        id: '123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should throw an error if user creation fails', async () => {
      // Mock data
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock database error
      mockSession.run.mockResolvedValueOnce({
        records: []
      });

      // Call and assert
      await expect(userService.createUser(userData)).rejects.toThrow(ApiError);
      expect(mockSession.close).toHaveBeenCalled();
    });
  });
});
```

#### Integration Test Example - Health Controller

Create `src/controllers/__tests__/health.controller.test.js`:

```javascript
const request = require('supertest');
const express = require('express');
const healthController = require('../../controllers/health.controller');
const healthService = require('../../services/health.service');
const { authenticate } = require('../../middleware/auth');

// Mock dependencies
jest.mock('../../services/health.service');
jest.mock('../../middleware/auth');

describe('Health Controller', () => {
  let app;

  beforeEach(() => {
    // Create Express app for testing
    app = express();
    app.use(express.json());
    
    // Mock authentication middleware
    authenticate.mockImplementation((req, res, next) => {
      req.user = { id: 'user-123' };
      next();
    });
    
    // Setup routes
    app.get('/health/dashboard', authenticate, healthController.getDashboard);
    app.post('/health/mental/sync', authenticate, healthController.syncMentalHealth);
  });

  describe('GET /health/dashboard', () => {
    it('should return dashboard data', async () => {
      // Mock service response
      const mockDashboardData = {
        mental: { stressLevel: 30 },
        sleep: { sleepDuration: 480 },
        nutrition: { caloriesConsumed: 2000 },
        fitness: { stepsCount: 8000 },
        overall_wellness_score: 75
      };
      
      healthService.getDashboardData.mockResolvedValueOnce(mockDashboardData);

      // Execute request
      const response = await request(app)
        .get('/health/dashboard')
        .expect('Content-Type', /json/)
        .expect(200);

      // Assertions
      expect(healthService.getDashboardData).toHaveBeenCalledWith('user-123');
      expect(response.body).toEqual(mockDashboardData);
    });

    it('should handle errors', async () => {
      // Mock service error
      healthService.getDashboardData.mockRejectedValueOnce(new Error('Database error'));

      // Execute request
      const response = await request(app)
        .get('/health/dashboard')
        .expect(500);

      // Assertions
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /health/mental/sync', () => {
    it('should sync mental health data', async () => {
      // Mock request data
      const requestData = {
        source: 'sahha',
        data: {
          stressLevel: 30,
          moodScore: 80
        }
      };

      // Mock service response
      const mockResponseData = {
        id: 'mental-123',
        source: 'sahha',
        stressLevel: 30,
        moodScore: 80,
        date: '2023-01-01T00:00:00Z'
      };

      healthService.syncMentalHealthData.mockResolvedValueOnce(mockResponseData);

      // Execute request
      const response = await request(app)
        .post('/health/mental/sync')
        .send(requestData)
        .expect('Content-Type', /json/)
        .expect(200);

      // Assertions
      expect(healthService.syncMentalHealthData).toHaveBeenCalledWith(
        'user-123',
        requestData.source,
        requestData.data
      );
      expect(response.body).toEqual(mockResponseData);
    });
  });
});
```

### 2.2 Mobile Test Examples

#### Redux Slice Test

Create `src/redux/slices/__tests__/authSlice.test.js`:

```javascript
import authReducer, { 
  loginUser, 
  logoutUser, 
  resetAuthError, 
  setUser 
} from '../authSlice';
import { authService } from '../../../services/auth';

// Mock auth service
jest.mock('../../../services/auth');
jest.mock('../../../utils/storage', () => ({
  storage: {
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }
}));

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle resetAuthError', () => {
      const actual = authReducer(
        { ...initialState, error: 'Some error' },
        resetAuthError()
      );
      expect(actual.error).toBeNull();
    });

    it('should handle setUser', () => {
      const user = { id: '123', email: 'test@example.com' };
      const actual = authReducer(initialState, setUser(user));
      expect(actual.user).toEqual(user);
      expect(actual.isAuthenticated).toBe(true);
    });
  });

  describe('extra reducers', () => {
    it('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle loginUser.fulfilled', () => {
      const user = { id: '123', email: 'test@example.com' };
      const action = { type: loginUser.fulfilled.type, payload: user };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle loginUser.rejected', () => {
      const error = 'Authentication failed';
      const action = { type: loginUser.rejected.type, payload: error };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });

    it('should handle logoutUser.fulfilled', () => {
      const state = {
        user: { id: '123' },
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      const action = { type: logoutUser.fulfilled.type };
      const newState = authReducer(state, action);
      expect(newState.user).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
    });
  });

  describe('thunks', () => {
    it('should handle successful login', async () => {
      // Mock data
      const credentials = { email: 'test@example.com', password: 'password' };
      const userData = { id: '123', email: credentials.email };
      const response = { user: userData, tokens: { accessToken: 'token' } };
      
      // Mock service response
      authService.login.mockResolvedValueOnce(response);
      
      // Dispatch thunk
      const dispatch = jest.fn();
      const thunk = loginUser(credentials);
      await thunk(dispatch, () => ({}));
      
      // Check dispatch calls
      const pendingAction = dispatch.mock.calls[0][0];
      const fulfilledAction = dispatch.mock.calls[1][0];
      
      expect(pendingAction.type).toBe(loginUser.pending.type);
      expect(fulfilledAction.type).toBe(loginUser.fulfilled.type);
      expect(fulfilledAction.payload).toEqual(userData);
    });
  });
});
```

#### Component Test Example

Create `src/components/dashboard/__tests__/WellnessScore.test.js`:

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import WellnessScore from '../WellnessScore';

describe('WellnessScore Component', () => {
  it('renders the wellness score correctly', () => {
    const score = 75;
    render(<WellnessScore score={score} />);
    
    // Check that the score is displayed
    const scoreText = screen.getByText('75');
    expect(scoreText).toBeTruthy();
  });

  it('displays the correct color for high score', () => {
    const score = 85;
    const { getByTestId } = render(<WellnessScore score={score} />);
    
    // Check that the score circle has the correct color
    const scoreCircle = getByTestId('score-circle');
    expect(scoreCircle.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.stringMatching(/green|#00/) })
    );
  });

  it('displays the correct color for medium score', () => {
    const score = 65;
    const { getByTestId } = render(<WellnessScore score={score} />);
    
    // Check that the score circle has the correct color
    const scoreCircle = getByTestId('score-circle');
    expect(scoreCircle.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.stringMatching(/yellow|amber|#ff/) })
    );
  });

  it('displays the correct color for low score', () => {
    const score = 35;
    const { getByTestId } = render(<WellnessScore score={score} />);
    
    // Check that the score circle has the correct color
    const scoreCircle = getByTestId('score-circle');
    expect(scoreCircle.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.stringMatching(/red|#f/) })
    );
  });

  it('displays "N/A" when score is not available', () => {
    render(<WellnessScore score={null} />);
    
    // Check that N/A is displayed
    const naText = screen.getByText('N/A');
    expect(naText).toBeTruthy();
  });
});
```

### 2.3 E2E Test Example with Detox

#### Setup Detox

Add to `package.json` in the mobile directory:

```json
{
  "detox": {
    "configurations": {
      "ios.sim.debug": {
        "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/WellnessApp.app",
        "build": "xcodebuild -workspace ios/WellnessApp.xcworkspace -scheme WellnessApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
        "type": "ios.simulator",
        "device": {
          "type": "iPhone 13"
        }
      },
      "android.emu.debug": {
        "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
        "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..",
        "type": "android.emulator",
        "device": {
          "avdName": "Pixel_4_API_30"
        }
      }
    },
    "test-runner": "jest"
  }
}
```

Create `e2e/config.json`:

```json
{
  "setupFilesAfterEnv": ["./init.js"],
  "testEnvironment": "node",
  "reporters": ["detox/runners/jest/streamlineReporter"],
  "verbose": true
}
```

Create `e2e/init.js`:

```javascript
const { device, element, by, waitFor } = require('detox');

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  await device.reloadReactNative();
});
```

#### Login E2E Test

Create `e2e/login.test.js`:

```javascript
describe('Login Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.id('email-input'))).toBeVisible();
    await expect(element(by.id('password-input'))).toBeVisible();
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('should show error on invalid login', async () => {
    await element(by.id('email-input')).typeText('invalid@example.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();
    
    await waitFor(element(by.text('Invalid credentials')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should login with valid credentials and navigate to dashboard', async () => {
    // Using test account
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    // Check navigation to dashboard
    await waitFor(element(by.id('dashboard-screen')))
      .toBeVisible()
      .withTimeout(2000);
    
    // Verify dashboard elements
    await expect(element(by.id('wellness-score'))).toBeVisible();
    await expect(element(by.id('sync-button'))).toBeVisible();
  });
});
```

## 3. CI/CD Integration

### 3.1 GitHub Actions Workflow for Testing

Create `.github/workflows/test.yml`:

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:

jobs:
  backend-test:
    name: Backend Tests
    runs-on: ubuntu-latest
    
    services:
      neo4j:
        image: neo4j:5.9.0
        env:
          NEO4J_AUTH: neo4j/password
          NEO4J_dbms_memory_pagecache_size: 1G
          NEO4J_dbms_memory_heap_initial__size: 1G
          NEO4J_dbms_memory_heap_max__size: 1G
        ports:
          - 7474:7474
          - 7687:7687
        options: >-
          --health-cmd "cypher-shell -u neo4j -p password 'RETURN 1;'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Lint
        working-directory: ./backend
        run: npm run lint
      
      - name: Run unit tests
        working-directory: ./backend
        run: npm run test:unit
        env:
          NODE_ENV: test
          NEO4J_URI: bolt://localhost:7687
          NEO4J_USERNAME: neo4j
          NEO4J_PASSWORD: password
          JWT_SECRET: test-jwt-secret
      
      - name: Run integration tests
        working-directory: ./backend
        run: npm run test:integration
        env:
          NODE_ENV: test
          NEO4J_URI: bolt://localhost:7687
          NEO4J_USERNAME: neo4j
          NEO4J_PASSWORD: password
          JWT_SECRET: test-jwt-secret
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage
          flags: backend
  
  mobile-test:
    name: Mobile Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: mobile/package-lock.json
      
      - name: Install dependencies
        working-directory: ./mobile
        run: npm ci
      
      - name: Lint
        working-directory: ./mobile
        run: npm run lint
      
      - name: Type check
        working-directory: ./mobile
        run: npm run typecheck
      
      - name: Run unit tests
        working-directory: ./mobile
        run: npm run test:unit
        env:
          NODE_ENV: test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./mobile/coverage
          flags: mobile

  sonarcloud:
    name: SonarCloud Analysis
    runs-on: ubuntu-latest
    needs: [backend-test, mobile-test]
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 3.2 SonarCloud Configuration

Create `sonar-project.properties`:

```properties
sonar.projectKey=wellness-app
sonar.organization=wellness-org

# Sources
sonar.sources=backend/src,mobile/src
sonar.exclusions=**/__tests__/**,**/*.test.*,**/*.spec.*,**/test/**

# Tests
sonar.tests=backend/src,mobile/src
sonar.test.inclusions=**/__tests__/**,**/*.test.*,**/*.spec.*

# Coverage
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,mobile/coverage/lcov.info
sonar.coverage.exclusions=**/__tests__/**,**/*.test.*,**/*.spec.*,**/test/**

# Duplications
sonar.cpd.exclusions=**/__tests__/**,**/*.test.*,**/*.spec.*
```

## 4. Test Results and Reporting

### 4.1 GitHub Actions Job Summary

Add to GitHub Actions workflow:

```yaml
- name: Generate test summary
  run: |
    echo "# Test Results Summary" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "## Backend Tests" >> $GITHUB_STEP_SUMMARY
    echo "- Total: $(jq '.numTotalTests' backend/test-report.json)" >> $GITHUB_STEP_SUMMARY
    echo "- Passed: $(jq '.numPassedTests' backend/test-report.json)" >> $GITHUB_STEP_SUMMARY
    echo "- Failed: $(jq '.numFailedTests' backend/test-report.json)" >> $GITHUB_STEP_SUMMARY
    echo "- Coverage: $(jq '.coverageMap.total.lines.pct' backend/coverage/coverage-summary.json)%" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "## Mobile Tests" >> $GITHUB_STEP_SUMMARY
    echo "- Total: $(jq '.numTotalTests' mobile/test-report.json)" >> $GITHUB_STEP_SUMMARY
    echo "- Passed: $(jq '.numPassedTests' mobile/test-report.json)" >> $GITHUB_STEP_SUMMARY
    echo "- Failed: $(jq '.numFailedTests' mobile/test-report.json)" >> $GITHUB_STEP_SUMMARY
    echo "- Coverage: $(jq '.coverageMap.total.lines.pct' mobile/coverage/coverage-summary.json)%" >> $GITHUB_STEP_SUMMARY
```

### 4.2 Codecov Configuration

Create `codecov.yml`:

```yaml
coverage:
  precision: 2
  round: down
  range: "70...100"
  status:
    project:
      default:
        target: 80%
        threshold: 1%
    patch:
      default:
        target: 80%
        threshold: 1%

parsers:
  javascript:
    enable_partials: yes

comment:
  layout: "reach, diff, flags, files"
  behavior: default
  require_changes: false
  require_base: no
  require_head: yes
  branches: null
```

## 5. Package Scripts

### 5.1 Backend package.json Scripts

Add to `backend/package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=src/.*\\.spec\\.js$ --coverage",
    "test:integration": "jest --testPathPattern=src/.*\\.test\\.js$ --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --reporters=default --reporters=jest-junit",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix"
  }
}
```

### 5.2 Mobile package.json Scripts

Add to `mobile/package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --reporters=default --reporters=jest-junit",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "typecheck": "tsc --noEmit",
    "e2e:build": "detox build",
    "e2e:test": "detox test"
  }
}
```
