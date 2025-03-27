# Testing and CI/CD Strategy for Wellness App MVP

## 1. Introduction

This document outlines a comprehensive testing and CI/CD strategy for the Wellness App MVP, leveraging Docker Test Containers and TestContainers Cloud to enhance the maturity of the application. The strategy focuses on replacing mocked components with real infrastructure testing, ensuring the reliability and robustness of the application's integration with third-party health APIs.

### 1.1 Current Testing Approach

The current testing approach relies heavily on mocking:
- Jest as the primary testing framework
- Supertest for API testing
- Mocked Neo4j models and API adapters
- Limited integration testing with real components

### 1.2 Goals of the Enhanced Testing Strategy

- Replace mocked Neo4j database with real Neo4j instances using TestContainers
- Implement comprehensive unit testing for all application layers
- Develop integration tests that validate API interactions
- Establish a robust CI/CD pipeline with TestContainers Cloud
- Ensure tests are reliable, repeatable, and maintainable

## 2. Testing Levels and Approaches

### 2.1 Unit Testing

Unit tests will focus on testing individual components in isolation:

#### Backend Unit Tests:
- **Controllers**: Test request handling, validation, and response formatting
- **Services**: Test business logic with mocked repositories
- **Models**: Test data transformation and validation
- **API Adapters**: Test adapter interfaces with mocked API responses

#### Mobile App Unit Tests:
- **Components**: Test UI components rendering and behavior
- **Redux Actions/Reducers**: Test state management
- **Utility Functions**: Test helper functions and utilities

#### Implementation Approach:
- Continue using Jest as the primary testing framework
- Use dependency injection to facilitate testing
- Implement test doubles (mocks, stubs) for external dependencies
- Aim for high code coverage (>80%)

### 2.2 Integration Testing

Integration tests will focus on testing interactions between components:

#### Backend Integration Tests:
- **API Endpoints**: Test complete request-response cycles
- **Database Integration**: Test Neo4j queries and transactions using TestContainers
- **Third-party API Integration**: Test health API integrations with mocked responses

#### Mobile-Backend Integration:
- **API Client**: Test mobile app communication with backend APIs
- **Authentication Flow**: Test complete authentication process

#### Implementation Approach:
- Use TestContainers for Neo4j database testing
- Implement API mocking for third-party services
- Test complete flows from API request to database operation

### 2.3 End-to-End Testing

End-to-end tests will validate complete user flows:

- **User Registration/Login**: Test complete authentication flow
- **Health Data Synchronization**: Test data flow from third-party APIs to database
- **Dashboard View**: Test data aggregation and presentation

#### Implementation Approach:
- Use TestContainers for all required infrastructure
- Implement controlled test environments with predefined data
- Focus on critical user journeys

## 3. TestContainers Implementation

### 3.1 Neo4j TestContainer Setup

```javascript
// neo4j.testcontainer.js
const { Neo4jContainer } = require('@testcontainers/neo4j');
const neo4j = require('neo4j-driver');

async function setupNeo4jContainer() {
  // Start Neo4j container
  const container = await new Neo4jContainer()
    .withPassword('testpassword')
    .start();
  
  // Create driver
  const driver = neo4j.driver(
    container.getBoltUri(),
    neo4j.auth.basic(container.getUsername(), container.getPassword())
  );
  
  return { container, driver };
}

async function teardownNeo4jContainer(container, driver) {
  await driver.close();
  await container.stop();
}

module.exports = {
  setupNeo4jContainer,
  teardownNeo4jContainer
};
```

### 3.2 Test Data Setup

```javascript
// test-data-setup.js
async function setupTestData(session) {
  // Create test user
  await session.run(`
    CREATE (u:User {id: 'test-user', name: 'Test User', email: 'test@example.com'})
    RETURN u
  `);
  
  // Create mental health data
  await session.run(`
    MATCH (u:User {id: 'test-user'})
    CREATE (m:MentalHealth {id: 'mental-1', date: '2025-03-17', score: 85, stress: 30, anxiety: 25, mood: 90})
    CREATE (u)-[:HAS_MENTAL_HEALTH]->(m)
    RETURN m
  `);
  
  // Create sleep data
  await session.run(`
    MATCH (u:User {id: 'test-user'})
    CREATE (s:Sleep {id: 'sleep-1', date: '2025-03-17', duration: 480, quality: 90, deep: 30, light: 50, rem: 15, awake: 5})
    CREATE (u)-[:HAS_SLEEP]->(s)
    RETURN s
  `);
  
  // Create nutrition data
  await session.run(`
    MATCH (u:User {id: 'test-user'})
    CREATE (n:Nutrition {id: 'nutrition-1', date: '2025-03-17', totalCalories: 450, totalProtein: 25, totalCarbs: 45, totalFat: 15})
    CREATE (u)-[:HAS_NUTRITION]->(n)
    RETURN n
  `);
  
  // Create fitness data
  await session.run(`
    MATCH (u:User {id: 'test-user'})
    CREATE (f:Fitness {id: 'fitness-1', date: '2025-03-17', activity_type: 'Run', duration: 60, distance: 10, calories: 500})
    CREATE (u)-[:HAS_FITNESS]->(f)
    RETURN f
  `);
}

async function clearTestData(session) {
  await session.run('MATCH (n) DETACH DELETE n');
}

module.exports = {
  setupTestData,
  clearTestData
};
```

### 3.3 Integration Test Example

```javascript
// health.integration.test.js
const { setupNeo4jContainer, teardownNeo4jContainer } = require('./neo4j.testcontainer');
const { setupTestData, clearTestData } = require('./test-data-setup');
const request = require('supertest');
const app = require('../src/app');

describe('Health API Integration Tests', () => {
  let container;
  let driver;
  let session;
  
  beforeAll(async () => {
    // Setup Neo4j container
    const setup = await setupNeo4jContainer();
    container = setup.container;
    driver = setup.driver;
    session = driver.session();
    
    // Configure app to use test container
    process.env.NEO4J_URI = container.getBoltUri();
    process.env.NEO4J_USERNAME = container.getUsername();
    process.env.NEO4J_PASSWORD = container.getPassword();
    
    // Initialize app with test container
    await require('../src/config/database').initializeDatabase();
  });
  
  afterAll(async () => {
    await session.close();
    await teardownNeo4jContainer(container, driver);
  });
  
  beforeEach(async () => {
    await clearTestData(session);
    await setupTestData(session);
  });
  
  test('GET /api/health/mental should return mental health data', async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const authToken = loginResponse.body.token;
    
    // Test mental health endpoint
    const response = await request(app)
      .get('/api/health/mental')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('score', 85);
  });
  
  // Additional tests for other health endpoints
});
```

## 4. CI/CD Pipeline Configuration

### 4.1 GitHub Actions Workflow

```yaml
# .github/workflows/test-and-deploy.yml
name: Test and Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install TestContainers Cloud agent
      run: |
        curl -L -o tc-cloud-agent.sh https://app.testcontainers.cloud/download/testcontainers-cloud-agent.sh
        sh tc-cloud-agent.sh --max-concurrency=4
      
    - name: Run unit tests
      run: npm run test:unit
      
    - name: Run integration tests
      run: npm run test:integration
      env:
        TC_CLOUD_TOKEN: ${{ secrets.TC_CLOUD_TOKEN }}
    
    - name: Build
      if: github.event_name == 'push'
      run: npm run build
    
    - name: Deploy to staging
      if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
      run: npm run deploy:staging
      env:
        DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
    
    - name: Deploy to production
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      run: npm run deploy:production
      env:
        DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### 4.2 TestContainers Cloud Configuration

```javascript
// testcontainers.config.js
module.exports = {
  // Configure TestContainers to use TestContainers Cloud
  // This file will be used by Jest to configure TestContainers
  
  // Project tag for monitoring in TestContainers Cloud
  projectTag: 'wellness-app-mvp',
  
  // Resource configuration
  resources: {
    // Memory limit per container
    memoryLimit: '1g',
    
    // CPU limit per container
    cpuLimit: 2
  },
  
  // Turbo mode configuration for parallel testing
  turboMode: {
    enabled: true,
    maxConcurrency: 4
  }
};
```

### 4.3 Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathIgnorePatterns=integration",
    "test:integration": "jest --testPathPattern=integration",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "...",
    "deploy:staging": "...",
    "deploy:production": "..."
  }
}
```

## 5. Implementation Plan

### 5.1 Phase 1: Setup TestContainers Infrastructure

1. Install TestContainers dependencies
   ```bash
   npm install --save-dev @testcontainers/neo4j
   ```

2. Create TestContainers configuration and helper files
   - neo4j.testcontainer.js
   - test-data-setup.js
   - testcontainers.config.js

3. Configure Jest to work with TestContainers
   - Update jest.config.js
   - Create setup and teardown scripts

### 5.2 Phase 2: Implement Unit Tests

1. Refactor existing unit tests to improve coverage
2. Implement additional unit tests for:
   - Controllers
   - Services
   - Models
   - API Adapters
   - Utility functions

3. Ensure all tests use proper mocking and isolation

### 5.3 Phase 3: Implement Integration Tests

1. Create Neo4j integration tests using TestContainers
2. Implement API integration tests
3. Test database operations and transactions
4. Validate API responses with real database interactions

### 5.4 Phase 4: Configure CI/CD Pipeline

1. Set up GitHub Actions workflow
2. Configure TestContainers Cloud integration
3. Implement staging and production deployment
4. Set up monitoring and notifications

### 5.5 Phase 5: Documentation and Knowledge Transfer

1. Document testing approach and best practices
2. Create examples and templates for future tests
3. Train team members on TestContainers usage
4. Establish testing standards and guidelines

## 6. Best Practices

### 6.1 TestContainers Best Practices

- Don't rely on fixed ports for tests
- Don't hardcode hostnames
- Don't hardcode container names
- Use container networks for multi-container tests
- Clean up resources after tests

### 6.2 Testing Best Practices

- Keep tests independent and isolated
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Test both success and failure scenarios
- Avoid test interdependencies

### 6.3 CI/CD Best Practices

- Run tests on every pull request
- Maintain separate environments for staging and production
- Implement automated deployments
- Monitor test performance and stability
- Regularly review and update tests

## 7. Conclusion

This testing and CI/CD strategy provides a comprehensive approach to enhancing the maturity of the Wellness App MVP. By implementing TestContainers for Neo4j testing and configuring TestContainers Cloud for CI/CD, we can ensure that the application is thoroughly tested and reliably deployed.

The strategy focuses on:
- Replacing mocked components with real infrastructure testing
- Implementing comprehensive unit and integration tests
- Establishing a robust CI/CD pipeline
- Following best practices for testing and deployment

By following this strategy, we can significantly improve the quality and reliability of the Wellness App MVP, ensuring it meets the requirements for a production-ready application.
