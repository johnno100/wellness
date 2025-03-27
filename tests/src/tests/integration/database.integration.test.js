/**
 * Database Integration Tests using TestContainers
 * Tests the Neo4j database operations with a real Neo4j instance
 */

const { setupNeo4jContainer, teardownNeo4jContainer, clearDatabase } = require('./neo4j.testcontainer');
const { setupTestData } = require('./test-data-setup');

describe('Database Integration Tests', () => {
  let neo4jSetup;
  let neo4jModels;
  
  beforeAll(async () => {
    // Setup Neo4j container
    neo4jSetup = await setupNeo4jContainer();
    
    // Set environment variables for test
    process.env.NEO4J_URI = neo4jSetup.uri;
    process.env.NEO4J_USERNAME = neo4jSetup.username;
    process.env.NEO4J_PASSWORD = neo4jSetup.password;
    
    // Import models after setting environment variables
    neo4jModels = require('../../models/neo4j.models');
  }, 60000); // Increase timeout for container startup
  
  afterAll(async () => {
    // Teardown Neo4j container
    await teardownNeo4jContainer(neo4jSetup);
    
    // Clear environment variables
    delete process.env.NEO4J_URI;
    delete process.env.NEO4J_USERNAME;
    delete process.env.NEO4J_PASSWORD;
    
    // Clear module cache
    jest.resetModules();
  }, 60000); // Increase timeout for container shutdown
  
  beforeEach(async () => {
    // Clear database before each test
    await clearDatabase(neo4jSetup.session);
    
    // Setup test data
    await setupTestData(neo4jSetup.session);
  });
  
  describe('User Operations', () => {
    test('createUser should create a new user in the database', async () => {
      // Arrange
      const newUser = {
        name: 'New Database User',
        email: 'newdbuser@example.com',
        password: 'hashedpassword123'
      };
      
      // Act
      const result = await neo4jModels.createUser(newUser);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'New Database User');
      expect(result).toHaveProperty('email', 'newdbuser@example.com');
      
      // Verify user was created in database
      const dbResult = await neo4jSetup.session.run(
        'MATCH (u:User {email: $email}) RETURN u',
        { email: 'newdbuser@example.com' }
      );
      
      expect(dbResult.records.length).toBe(1);
    });
    
    test('getUserById should retrieve a user by ID', async () => {
      // Act
      const user = await neo4jModels.getUserById('test-user-id');
      
      // Assert
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id', 'test-user-id');
      expect(user).toHaveProperty('name', 'Test User');
      expect(user).toHaveProperty('email', 'test@example.com');
    });
    
    test('getUserByEmail should retrieve a user by email', async () => {
      // Act
      const user = await neo4jModels.getUserByEmail('test@example.com');
      
      // Assert
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id', 'test-user-id');
      expect(user).toHaveProperty('name', 'Test User');
      expect(user).toHaveProperty('email', 'test@example.com');
    });
    
    test('updateUser should update user properties', async () => {
      // Arrange
      const updates = {
        name: 'Updated Database User Name',
        bio: 'New user bio'
      };
      
      // Act
      const result = await neo4jModels.updateUser('test-user-id', updates);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('name', 'Updated Database User Name');
      expect(result).toHaveProperty('bio', 'New user bio');
      
      // Verify user was updated in database
      const dbResult = await neo4jSetup.session.run(
        'MATCH (u:User {id: $id}) RETURN u',
        { id: 'test-user-id' }
      );
      
      const user = dbResult.records[0].get('u').properties;
      expect(user.name).toBe('Updated Database User Name');
      expect(user.bio).toBe('New user bio');
    });
  });
  
  describe('Health Data Relationships', () => {
    test('should correctly establish relationships between users and health data', async () => {
      // Act
      const result = await neo4jSetup.session.run(`
        MATCH (u:User {id: 'test-user-id'})-[r]->(h)
        RETURN type(r) as relationship, labels(h) as labels
      `);
      
      // Assert
      const relationships = result.records.map(record => ({
        relationship: record.get('relationship'),
        labels: record.get('labels')[0]
      }));
      
      // Check that all expected relationships exist
      expect(relationships).toContainEqual({ relationship: 'HAS_MENTAL_HEALTH', labels: 'MentalHealth' });
      expect(relationships).toContainEqual({ relationship: 'HAS_SLEEP', labels: 'Sleep' });
      expect(relationships).toContainEqual({ relationship: 'HAS_NUTRITION', labels: 'Nutrition' });
      expect(relationships).toContainEqual({ relationship: 'HAS_FITNESS', labels: 'Fitness' });
      expect(relationships).toContainEqual({ relationship: 'HAS_CONNECTIONS', labels: 'Connections' });
    });
    
    test('should be able to traverse relationships to find correlated health data', async () => {
      // Act
      const result = await neo4jSetup.session.run(`
        MATCH (u:User {id: 'test-user-id'})-[:HAS_SLEEP]->(s:Sleep)
        MATCH (u)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
        WHERE s.date = m.date
        RETURN s.quality as sleepQuality, m.score as mentalScore
      `);
      
      // Assert
      expect(result.records.length).toBe(1);
      const record = result.records[0];
      expect(record.get('sleepQuality')).toBe(90);
      expect(record.get('mentalScore')).toBe(85);
    });
  });
  
  describe('Complex Queries', () => {
    test('getHealthCorrelations should analyze relationships between health domains', async () => {
      // Act
      const correlations = await neo4jModels.getHealthCorrelations('test-user-id');
      
      // Assert
      expect(correlations).toBeDefined();
      
      // The exact correlations will depend on the implementation, but we can check the structure
      if (correlations.sleepMental) {
        expect(correlations.sleepMental).toHaveProperty('domains');
        expect(correlations.sleepMental.domains).toContain('sleep');
        expect(correlations.sleepMental.domains).toContain('mental');
      }
      
      if (correlations.nutritionFitness) {
        expect(correlations.nutritionFitness).toHaveProperty('domains');
        expect(correlations.nutritionFitness.domains).toContain('nutrition');
        expect(correlations.nutritionFitness.domains).toContain('fitness');
      }
    });
    
    test('getWellnessScore should calculate overall wellness score from all domains', async () => {
      // Act
      const score = await neo4jModels.getWellnessScore('test-user-id');
      
      // Assert
      expect(score).toBeDefined();
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
