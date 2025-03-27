/**
 * Unit tests for API adapters using TestContainers
 * Tests the API adapters with mocked responses
 */

const { setupNeo4jContainer, teardownNeo4jContainer } = require('./neo4j.testcontainer');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('API Adapters Unit Tests', () => {
  let neo4jSetup;
  
  beforeAll(async () => {
    // Setup Neo4j container
    neo4jSetup = await setupNeo4jContainer();
    
    // Mock the database configuration to use the test container
    jest.mock('../../config/database', () => ({
      getDriver: jest.fn().mockReturnValue(neo4jSetup.driver)
    }));
    
    // Import API adapters after mocking
    this.ApiAdapterFactory = require('../../api/adapters');
  }, 60000); // Increase timeout for container startup
  
  afterAll(async () => {
    // Teardown Neo4j container
    await teardownNeo4jContainer(neo4jSetup);
    
    // Clear mocks
    jest.resetModules();
  }, 60000); // Increase timeout for container shutdown
  
  beforeEach(() => {
    // Clear mock calls
    jest.clearAllMocks();
  });
  
  describe('Sahha Adapter', () => {
    test('getMentalHealthData should fetch and transform mental health data', async () => {
      // Arrange
      const mockResponse = {
        data: {
          userId: 'test-user',
          date: '2025-03-18T10:00:00Z',
          mentalHealthScore: 88,
          stressLevel: 25,
          anxietyLevel: 20,
          moodScore: 92
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      const sahhaAdapter = this.ApiAdapterFactory.createSahhaAdapter({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.sahha.ai'
      });
      
      // Act
      const result = await sahhaAdapter.getMentalHealthData('test-user');
      
      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('https://api.sahha.ai'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('test-api-key')
          })
        })
      );
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('userId', 'test-user');
      expect(result).toHaveProperty('score', 88);
      expect(result).toHaveProperty('factors');
      expect(result.factors).toHaveProperty('stress', 25);
      expect(result.factors).toHaveProperty('anxiety', 20);
      expect(result.factors).toHaveProperty('mood', 92);
    });
    
    test('authenticate should handle authentication flow', async () => {
      // Arrange
      const mockResponse = {
        data: {
          token: 'test-auth-token',
          expires_in: 3600
        }
      };
      
      axios.post.mockResolvedValue(mockResponse);
      
      const sahhaAdapter = this.ApiAdapterFactory.createSahhaAdapter({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.sahha.ai'
      });
      
      // Act
      const result = await sahhaAdapter.authenticate();
      
      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('https://api.sahha.ai/auth'),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key'
          })
        })
      );
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('token', 'test-auth-token');
      expect(result).toHaveProperty('expires_in', 3600);
    });
  });
  
  describe('Asleep Adapter', () => {
    test('getSleepData should fetch and transform sleep data', async () => {
      // Arrange
      const mockResponse = {
        data: {
          userId: 'test-user',
          date: '2025-03-18',
          sleepDuration: 490,
          sleepQuality: 92,
          sleepStages: {
            deepSleep: 32,
            lightSleep: 48,
            remSleep: 18,
            awake: 2
          }
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      const asleepAdapter = this.ApiAdapterFactory.createAsleepAdapter({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.asleep.ai'
      });
      
      // Act
      const result = await asleepAdapter.getSleepData('test-user');
      
      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('https://api.asleep.ai'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key'
          })
        })
      );
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('userId', 'test-user');
      expect(result).toHaveProperty('duration', 490);
      expect(result).toHaveProperty('quality', 92);
      expect(result).toHaveProperty('stages');
      expect(result.stages).toHaveProperty('deep', 32);
      expect(result.stages).toHaveProperty('light', 48);
      expect(result.stages).toHaveProperty('rem', 18);
      expect(result.stages).toHaveProperty('awake', 2);
    });
  });
  
  describe('Passio Adapter', () => {
    test('getNutritionData should fetch and transform nutrition data', async () => {
      // Arrange
      const mockResponse = {
        data: {
          userId: 'test-user',
          date: '2025-03-18',
          meals: [
            {
              name: 'Lunch',
              calories: 520,
              protein: 28,
              carbs: 48,
              fat: 18
            }
          ],
          dailyTotal: {
            calories: 520,
            protein: 28,
            carbs: 48,
            fat: 18
          }
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      const passioAdapter = this.ApiAdapterFactory.createPassioAdapter({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.passio.ai'
      });
      
      // Act
      const result = await passioAdapter.getNutritionData('test-user');
      
      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('https://api.passio.ai'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key'
          })
        })
      );
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('userId', 'test-user');
      expect(result).toHaveProperty('meals');
      expect(result.meals.length).toBe(1);
      expect(result.meals[0]).toHaveProperty('name', 'Lunch');
      expect(result.meals[0]).toHaveProperty('calories', 520);
      expect(result).toHaveProperty('totalCalories', 520);
      expect(result).toHaveProperty('totalMacros');
      expect(result.totalMacros).toHaveProperty('protein', 28);
      expect(result.totalMacros).toHaveProperty('carbs', 48);
      expect(result.totalMacros).toHaveProperty('fat', 18);
    });
  });
  
  describe('Strava Adapter', () => {
    test('getFitnessData should fetch and transform fitness data', async () => {
      // Arrange
      const mockResponse = {
        data: {
          id: 'activity-123',
          type: 'Ride',
          start_date: '2025-03-18T14:30:00Z',
          elapsed_time: 4500, // 75 minutes
          distance: 20000, // 20 km
          total_elevation_gain: 120,
          average_speed: 16,
          max_speed: 22,
          calories: 600
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      const stravaAdapter = this.ApiAdapterFactory.createStravaAdapter({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        baseUrl: 'https://www.strava.com/api/v3'
      });
      
      // Act
      const result = await stravaAdapter.getFitnessData('activity-123');
      
      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('https://www.strava.com/api/v3'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-access-token'
          })
        })
      );
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 'activity-123');
      expect(result).toHaveProperty('activity_type', 'Ride');
      expect(result).toHaveProperty('duration', 75);
      expect(result).toHaveProperty('distance', 20);
      expect(result).toHaveProperty('calories', 600);
      expect(result).toHaveProperty('metrics');
      expect(result.metrics).toHaveProperty('avg_speed', 16);
      expect(result.metrics).toHaveProperty('max_speed', 22);
      expect(result.metrics).toHaveProperty('elevation_gain', 120);
    });
    
    test('refreshToken should handle token refresh flow', async () => {
      // Arrange
      const mockResponse = {
        data: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 21600
        }
      };
      
      axios.post.mockResolvedValue(mockResponse);
      
      const stravaAdapter = this.ApiAdapterFactory.createStravaAdapter({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        refreshToken: 'test-refresh-token',
        baseUrl: 'https://www.strava.com/api/v3'
      });
      
      // Act
      const result = await stravaAdapter.refreshToken();
      
      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('https://www.strava.com/api/v3/oauth/token'),
        expect.objectContaining({
          client_id: 'test-client-id',
          client_secret: 'test-client-secret',
          refresh_token: 'test-refresh-token',
          grant_type: 'refresh_token'
        })
      );
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken', 'new-access-token');
      expect(result).toHaveProperty('refreshToken', 'new-refresh-token');
      expect(result).toHaveProperty('expiresIn', 21600);
    });
  });
});
