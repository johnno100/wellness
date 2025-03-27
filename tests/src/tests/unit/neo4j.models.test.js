/**
 * Unit tests for Neo4j models using TestContainers
 * Tests the Neo4j database operations with a real Neo4j instance
 */

const { setupNeo4jContainer, teardownNeo4jContainer, clearDatabase } = require('./neo4j.testcontainer');
const { setupHealthTestData } = require('./test-data-setup');

describe('Neo4j Models Unit Tests', () => {
  let neo4jSetup;
  
  beforeAll(async () => {
    // Setup Neo4j container
    neo4jSetup = await setupNeo4jContainer();
    
    // Mock the database configuration to use the test container
    jest.mock('../../config/database', () => ({
      getDriver: jest.fn().mockReturnValue(neo4jSetup.driver)
    }));
    
    // Import models after mocking the database configuration
    this.neo4jModels = require('../../models/neo4j.models');
  }, 60000); // Increase timeout for container startup
  
  afterAll(async () => {
    // Teardown Neo4j container
    await teardownNeo4jContainer(neo4jSetup);
    
    // Clear mocks
    jest.resetModules();
  }, 60000); // Increase timeout for container shutdown
  
  beforeEach(async () => {
    // Clear database before each test
    await clearDatabase(neo4jSetup.session);
    
    // Setup test data
    await setupHealthTestData(neo4jSetup.session);
  });
  
  describe('Mental Health Records', () => {
    test('getMentalHealthRecords should return mental health records for a user', async () => {
      // Act
      const records = await this.neo4jModels.getMentalHealthRecords('test-user', 10);
      
      // Assert
      expect(records).toBeDefined();
      expect(records.length).toBe(1);
      expect(records[0]).toHaveProperty('id', 'mental-1');
      expect(records[0]).toHaveProperty('score', 85);
      expect(records[0]).toHaveProperty('stress', 30);
      expect(records[0]).toHaveProperty('anxiety', 25);
      expect(records[0]).toHaveProperty('mood', 90);
    });
    
    test('createMentalHealthRecord should create a new mental health record', async () => {
      // Arrange
      const newRecord = {
        date: '2025-03-18',
        score: 90,
        stress: 20,
        anxiety: 15,
        mood: 95
      };
      
      // Act
      const result = await this.neo4jModels.createMentalHealthRecord('test-user', newRecord);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('date', '2025-03-18');
      expect(result).toHaveProperty('score', 90);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getMentalHealthRecords('test-user', 10);
      expect(records.length).toBe(2);
    });
  });
  
  describe('Sleep Records', () => {
    test('getSleepRecords should return sleep records for a user', async () => {
      // Act
      const records = await this.neo4jModels.getSleepRecords('test-user', 10);
      
      // Assert
      expect(records).toBeDefined();
      expect(records.length).toBe(1);
      expect(records[0]).toHaveProperty('id', 'sleep-1');
      expect(records[0]).toHaveProperty('duration', 480);
      expect(records[0]).toHaveProperty('quality', 90);
    });
    
    test('createSleepRecord should create a new sleep record', async () => {
      // Arrange
      const newRecord = {
        date: '2025-03-18',
        duration: 500,
        quality: 95,
        deep: 35,
        light: 45,
        rem: 20,
        awake: 0
      };
      
      // Act
      const result = await this.neo4jModels.createSleepRecord('test-user', newRecord);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('date', '2025-03-18');
      expect(result).toHaveProperty('duration', 500);
      expect(result).toHaveProperty('quality', 95);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getSleepRecords('test-user', 10);
      expect(records.length).toBe(2);
    });
  });
  
  describe('Nutrition Records', () => {
    test('getNutritionRecords should return nutrition records for a user', async () => {
      // Act
      const records = await this.neo4jModels.getNutritionRecords('test-user', 10);
      
      // Assert
      expect(records).toBeDefined();
      expect(records.length).toBe(1);
      expect(records[0]).toHaveProperty('id', 'nutrition-1');
      expect(records[0]).toHaveProperty('totalCalories', 450);
      expect(records[0]).toHaveProperty('totalProtein', 25);
      expect(records[0]).toHaveProperty('totalCarbs', 45);
      expect(records[0]).toHaveProperty('totalFat', 15);
    });
    
    test('createNutritionRecord should create a new nutrition record', async () => {
      // Arrange
      const newRecord = {
        date: '2025-03-18',
        totalCalories: 550,
        totalProtein: 30,
        totalCarbs: 50,
        totalFat: 20,
        meals: [
          {
            name: 'Breakfast',
            calories: 550,
            protein: 30,
            carbs: 50,
            fat: 20
          }
        ]
      };
      
      // Act
      const result = await this.neo4jModels.createNutritionRecord('test-user', newRecord);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('date', '2025-03-18');
      expect(result).toHaveProperty('totalCalories', 550);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getNutritionRecords('test-user', 10);
      expect(records.length).toBe(2);
    });
  });
  
  describe('Fitness Records', () => {
    test('getFitnessRecords should return fitness records for a user', async () => {
      // Act
      const records = await this.neo4jModels.getFitnessRecords('test-user', 10);
      
      // Assert
      expect(records).toBeDefined();
      expect(records.length).toBe(1);
      expect(records[0]).toHaveProperty('id', 'fitness-1');
      expect(records[0]).toHaveProperty('activity_type', 'Run');
      expect(records[0]).toHaveProperty('duration', 60);
      expect(records[0]).toHaveProperty('distance', 10);
      expect(records[0]).toHaveProperty('calories', 500);
    });
    
    test('createFitnessRecord should create a new fitness record', async () => {
      // Arrange
      const newRecord = {
        date: '2025-03-18',
        activity_type: 'Cycling',
        duration: 90,
        distance: 25,
        calories: 650,
        avg_speed: 16.7,
        max_speed: 22,
        elevation_gain: 150
      };
      
      // Act
      const result = await this.neo4jModels.createFitnessRecord('test-user', newRecord);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('date', '2025-03-18');
      expect(result).toHaveProperty('activity_type', 'Cycling');
      expect(result).toHaveProperty('duration', 90);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getFitnessRecords('test-user', 10);
      expect(records.length).toBe(2);
    });
  });
  
  describe('Health Correlations', () => {
    test('getHealthCorrelations should return correlations between health domains', async () => {
      // Act
      const correlations = await this.neo4jModels.getHealthCorrelations('test-user');
      
      // Assert
      expect(correlations).toBeDefined();
      expect(correlations).toHaveProperty('sleepMental');
      expect(correlations.sleepMental).toHaveProperty('domains');
      expect(correlations.sleepMental.domains).toContain('sleep');
      expect(correlations.sleepMental.domains).toContain('mental');
    });
  });
});
