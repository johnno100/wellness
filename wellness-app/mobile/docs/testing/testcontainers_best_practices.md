# TestContainers Best Practices for Neo4j Integration Testing

## General TestContainers Best Practices

1. **Don't rely on fixed ports for tests**
   - Use dynamic port mapping capabilities
   - Avoid port collisions in CI environments
   - Allow for parallel test execution

2. **Don't hardcode the hostname**
   - Use container.getHost() instead of "localhost"
   - Makes tests portable across different environments
   - Essential for remote Docker daemons and CI environments

3. **Don't hardcode container names**
   - Allow TestContainers to manage container naming
   - Prevents conflicts when running multiple tests in parallel
   - Especially important in CI environments

4. **Copy files into containers instead of mounting volumes**
   - More portable across environments
   - Avoids path-related issues
   - Better isolation between test runs

5. **Use container networks for multi-container tests**
   - Allows containers to communicate with each other
   - Simulates real-world deployment scenarios
   - Enables testing of distributed systems

## Neo4j-Specific Best Practices

1. **Use the official Neo4j TestContainers module**
   - For Node.js: `@testcontainers/neo4j`
   - Provides convenient methods for Neo4j configuration
   - Handles authentication and connection setup

2. **Configure Neo4j with appropriate settings**
   - Set authentication credentials
   - Configure memory limits
   - Set appropriate Neo4j configuration options

3. **Initialize database with test data**
   - Use Cypher queries to populate test data
   - Consider using seed data files
   - Create appropriate indexes and constraints

4. **Clean up between tests**
   - Delete all nodes and relationships
   - Reset database state
   - Ensure test isolation

5. **Test with the same Neo4j version as production**
   - Specify exact version tags
   - Test against multiple versions if needed
   - Consider testing upgrades

## TestContainers Cloud Integration

1. **Local Development Setup**
   - Install TestContainers Desktop
   - Enable "Run with TestContainers Cloud"
   - Configure appropriate memory limits

2. **CI/CD Integration**
   - Use TestContainers Cloud agent in CI pipelines
   - Configure via environment variables
   - Set appropriate concurrency limits

3. **Turbo Mode for Parallel Testing**
   - Enable Turbo mode for parallel test execution
   - Configure max concurrency based on test suite needs
   - Optimize resource usage

4. **Project Tagging**
   - Tag test sessions by project
   - Use environment variables or container labels
   - Helps with monitoring and debugging

5. **Resource Optimization**
   - Terminate workers eagerly when tests finish
   - Fine-tune Turbo mode settings
   - Monitor resource usage

## Implementation Examples for Node.js and Neo4j

### Basic Neo4j Container Setup

```javascript
const { Neo4jContainer } = require('@testcontainers/neo4j');
const neo4j = require('neo4j-driver');

describe('Neo4j Integration Tests', () => {
  let container;
  let driver;
  let session;

  beforeAll(async () => {
    // Start Neo4j container
    container = await new Neo4jContainer()
      .withPassword('testpassword')
      .start();
    
    // Connect to Neo4j
    driver = neo4j.driver(
      container.getBoltUri(),
      neo4j.auth.basic(container.getUsername(), container.getPassword())
    );
    
    session = driver.session();
  });

  afterAll(async () => {
    // Clean up resources
    await session.close();
    await driver.close();
    await container.stop();
  });

  test('should create and retrieve a node', async () => {
    // Create a node
    await session.run(
      'CREATE (n:Person {name: $name}) RETURN n',
      { name: 'Test User' }
    );
    
    // Retrieve the node
    const result = await session.run('MATCH (n:Person) RETURN n');
    const node = result.records[0].get(0);
    
    expect(node.properties.name).toBe('Test User');
  });
});
```

### Advanced Configuration with Custom Cypher Setup

```javascript
const { Neo4jContainer } = require('@testcontainers/neo4j');
const neo4j = require('neo4j-driver');
const fs = require('fs');
const path = require('path');

describe('Advanced Neo4j Integration Tests', () => {
  let container;
  let driver;
  let session;

  beforeAll(async () => {
    // Start Neo4j container with custom configuration
    container = await new Neo4jContainer()
      .withPassword('testpassword')
      .withNeo4jConfig('dbms.memory.heap.max_size', '512m')
      .start();
    
    // Connect to Neo4j
    driver = neo4j.driver(
      container.getBoltUri(),
      neo4j.auth.basic(container.getUsername(), container.getPassword())
    );
    
    session = driver.session();
    
    // Initialize database with schema and test data
    const setupCypher = fs.readFileSync(
      path.resolve(__dirname, './test-data/setup.cypher'),
      'utf8'
    );
    
    await session.run(setupCypher);
  });

  afterAll(async () => {
    // Clean up resources
    await session.close();
    await driver.close();
    await container.stop();
  });

  beforeEach(async () => {
    // Clean database between tests
    await session.run('MATCH (n) DETACH DELETE n');
    
    // Set up test data for each test
    await session.run(`
      CREATE (u:User {id: 'user123', name: 'Test User'})
      CREATE (m:MentalHealth {id: 'mental123', score: 85})
      CREATE (s:Sleep {id: 'sleep123', quality: 90})
      CREATE (u)-[:HAS_MENTAL_HEALTH]->(m)
      CREATE (u)-[:HAS_SLEEP]->(s)
    `);
  });

  test('should find correlations between sleep and mental health', async () => {
    const result = await session.run(`
      MATCH (u:User)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
      MATCH (u)-[:HAS_SLEEP]->(s:Sleep)
      RETURN m.score as mentalScore, s.quality as sleepQuality
    `);
    
    const record = result.records[0];
    expect(record.get('mentalScore')).toBe(85);
    expect(record.get('sleepQuality')).toBe(90);
  });
});
```

### Integration with TestContainers Cloud in CI/CD

```yaml
# GitHub Actions workflow example
name: Run Integration Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install TestContainers Cloud agent
      run: |
        curl -L -o tc-cloud-agent.sh https://app.testcontainers.cloud/download/testcontainers-cloud-agent.sh
        sh tc-cloud-agent.sh
      
    - name: Run tests with TestContainers Cloud
      run: npm test
      env:
        TC_CLOUD_TOKEN: ${{ secrets.TC_CLOUD_TOKEN }}
        TC_CLOUD_CONCURRENCY: 4
```

## Adapting TestContainers for the Wellness App

For the Wellness App MVP, we should implement TestContainers to:

1. Replace mocked Neo4j models with real Neo4j database testing
2. Test API integrations with third-party health services
3. Ensure data flows correctly through all layers of the application
4. Validate graph relationships and queries
5. Test the entire system end-to-end

This approach will significantly enhance the maturity of the MVP by ensuring that all components work together correctly in a production-like environment.
