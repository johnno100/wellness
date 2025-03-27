/**
 * Unit tests for health service using TestContainers
 * Tests the health service with a real Neo4j instance
 */

const { setupNeo4jContainer, teardownNeo4jContainer, clearDatabase } = require('./neo4j.testcontainer');
const { setupHealthTestData } = require('./test-data-setup');
const ApiAdapterFactory = require('../../api/adapters');

describe('Health Service Unit Tests', () => {
  let neo4jSetup;
  
  beforeAll(async () => {
    // Setup Neo4j container
    neo4jSetup = await setupNeo4jContainer();
    
    // Mock the database configuration to use the test container
    jest.mock('../../config/database', () => ({
      getDriver: jest.fn().mockReturnValue(neo4jSetup.driver)
    }));
    
    // Mock the API adapters
    jest.mock('../../api/adapters', () => ({
      createSahhaAdapter: jest.fn().mockReturnValue({
        getMentalHealthData: jest.fn().mockResolvedValue({
          userId: 'test-user',
          date: '2025-03-18',
          score: 88,
          factors: {
            stress: 25,
            anxiety: 20,
            mood: 92
          }
        })
      }),
      createAsleepAdapter: jest.fn().mockReturnValue({
        getSleepData: jest.fn().mockResolvedValue({
          userId: 'test-user',
          date: '2025-03-18',
          duration: 490,
          quality: 92,
          stages: {
            deep: 32,
            light: 48,
            rem: 18,
            awake: 2
          }
        })
      }),
      createPassioAdapter: jest.fn().mockReturnValue({
        getNutritionData: jest.fn().mockResolvedValue({
          userId: 'test-user',
          date: '2025-03-18',
          meals: [
            {
              name: 'Lunch',
              calories: 520,
              macros: {
                protein: 28,
                carbs: 48,
                fat: 18
              }
            }
          ],
          totalCalories: 520,
          totalMacros: {
            protein: 28,
            carbs: 48,
            fat: 18
          }
        })
      }),
      createStravaAdapter: jest.fn().mockReturnValue({
        getFitnessData: jest.fn().mockResolvedValue({
          id: 'activity-new',
          date: '2025-03-18',
          activity_type: 'Cycling',
          duration: 75,
          distance: 20,
          calories: 600,
          metrics: {
            avg_speed: 16,
            max_speed: 22,
            elevation_gain: 120
          }
        })
      })
    }));
    
    // Import models and service after mocking
    this.neo4jModels = require('../../models/neo4j.models');
    this.healthService = require('../../services/health.service');
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
    
    // Clear mock calls
    jest.clearAllMocks();
  });
  
  describe('Mental Health Service', () => {
    test('syncMentalHealthData should fetch data from API and create a record', async () => {
      // Act
      const result = await this.healthService.syncMentalHealthData('test-user');
      
      // Assert
      expect(ApiAdapterFactory.createSahhaAdapter).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('score', 88);
      expect(result).toHaveProperty('stress', 25);
      expect(result).toHaveProperty('anxiety', 20);
      expect(result).toHaveProperty('mood', 92);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getMentalHealthRecords('test-user', 10);
      expect(records.length).toBe(2); // Original + new record
      expect(records.some(r => r.score === 88)).toBe(true);
    });
    
    test('getMentalHealthData should return mental health records', async () => {
      // Act
      const result = await this.healthService.getMentalHealthData('test-user');
      
      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('score', 85);
    });
  });
  
  describe('Sleep Service', () => {
    test('syncSleepData should fetch data from API and create a record', async () => {
      // Act
      const result = await this.healthService.syncSleepData('test-user');
      
      // Assert
      expect(ApiAdapterFactory.createAsleepAdapter).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('duration', 490);
      expect(result).toHaveProperty('quality', 92);
      expect(result).toHaveProperty('deep', 32);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getSleepRecords('test-user', 10);
      expect(records.length).toBe(2); // Original + new record
      expect(records.some(r => r.quality === 92)).toBe(true);
    });
    
    test('getSleepData should return sleep records', async () => {
      // Act
      const result = await this.healthService.getSleepData('test-user');
      
      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('quality', 90);
    });
  });
  
  describe('Nutrition Service', () => {
    test('syncNutritionData should fetch data from API and create a record', async () => {
      // Act
      const result = await this.healthService.syncNutritionData('test-user');
      
      // Assert
      expect(ApiAdapterFactory.createPassioAdapter).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('totalCalories', 520);
      expect(result).toHaveProperty('totalProtein', 28);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getNutritionRecords('test-user', 10);
      expect(records.length).toBe(2); // Original + new record
      expect(records.some(r => r.totalCalories === 520)).toBe(true);
    });
    
    test('getNutritionData should return nutrition records', async () => {
      // Act
      const result = await this.healthService.getNutritionData('test-user');
      
      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('totalCalories', 450);
    });
  });
  
  describe('Fitness Service', () => {
    test('syncFitnessData should fetch data from API and create a record', async () => {
      // Act
      const result = await this.healthService.syncFitnessData('test-user');
      
      // Assert
      expect(ApiAdapterFactory.createStravaAdapter).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('activity_type', 'Cycling');
      expect(result).toHaveProperty('duration', 75);
      
      // Verify record was created in database
      const records = await this.neo4jModels.getFitnessRecords('test-user', 10);
      expect(records.length).toBe(2); // Original + new record
      expect(records.some(r => r.activity_type === 'Cycling')).toBe(true);
    });
    
    test('getFitnessData should return fitness records', async () => {
      // Act
      const result = await this.healthService.getFitnessData('test-user');
      
      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('activity_type', 'Run');
    });
  });
  
  describe('Dashboard Service', () => {
    test('getDashboardData should return aggregated health data', async () => {
      // Act
      const result = await this.healthService.getDashboardData('test-user');
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('mental');
      expect(result).toHaveProperty('sleep');
      expect(result).toHaveProperty('nutrition');
      expect(result).toHaveProperty('fitness');
      expect(result).toHaveProperty('overall_wellness_score');
      
      // Verify data is correctly aggregated
      expect(result.mental).toHaveProperty('latest_score', 85);
      expect(result.sleep).toHaveProperty('latest_quality', 90);
      expect(result.nutrition).toHaveProperty('latest_calories', 450);
      expect(result.fitness).toHaveProperty('latest_activity', 'Run');
    });
  });
});
