// Unit tests for health service
const healthService = require('../src/services/health.service');
const neo4jModels = require('../src/models/neo4j.models');
const ApiAdapterFactory = require('../src/api/adapters');

// Mock the Neo4j models
jest.mock('../src/models/neo4j.models');

// Mock the API adapters
jest.mock('../src/api/adapters', () => {
  return {
    createSahhaAdapter: jest.fn().mockReturnValue({
      getMockData: jest.fn().mockResolvedValue({
        userId: 'user123',
        date: '2025-03-17T11:00:00.000Z',
        score: 85,
        factors: {
          stress: 30,
          anxiety: 25,
          mood: 90
        }
      })
    }),
    createAsleepAdapter: jest.fn().mockReturnValue({
      getMockData: jest.fn().mockResolvedValue({
        userId: 'user123',
        date: '2025-03-17T11:00:00.000Z',
        duration: 480,
        quality: 90,
        stages: {
          deep: 30,
          light: 50,
          rem: 15,
          awake: 5
        }
      })
    }),
    createPassioAdapter: jest.fn().mockReturnValue({
      getMockData: jest.fn().mockResolvedValue({
        userId: 'user123',
        date: '2025-03-17T11:00:00.000Z',
        meals: [
          {
            name: 'Breakfast',
            calories: 450,
            macros: {
              protein: 25,
              carbs: 45,
              fat: 15
            }
          }
        ],
        totalCalories: 450,
        totalMacros: {
          protein: 25,
          carbs: 45,
          fat: 15
        }
      })
    }),
    createStravaAdapter: jest.fn().mockReturnValue({
      getMockData: jest.fn().mockResolvedValue({
        id: 'activity123',
        date: '2025-03-17T11:00:00.000Z',
        activity_type: 'Run',
        duration: 60,
        distance: 10,
        calories: 500,
        metrics: {
          avg_speed: 10,
          max_speed: 15,
          elevation_gain: 100
        }
      })
    })
  };
});

describe('Health Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mental Health Service', () => {
    test('syncMentalHealthData should create a mental health record', async () => {
      // Mock the Neo4j model function
      neo4jModels.createMentalHealthRecord.mockResolvedValue({
        id: 'mental123',
        date: '2025-03-17T11:00:00.000Z',
        score: 85,
        stress: 30,
        anxiety: 25,
        mood: 90
      });

      // Call the service function
      const result = await healthService.syncMentalHealthData('user123');

      // Assertions
      expect(neo4jModels.createMentalHealthRecord).toHaveBeenCalledWith('user123', expect.any(Object));
      expect(result).toEqual({
        id: 'mental123',
        date: '2025-03-17T11:00:00.000Z',
        score: 85,
        stress: 30,
        anxiety: 25,
        mood: 90
      });
    });

    test('getMentalHealthData should return mental health records', async () => {
      // Mock the Neo4j model function
      neo4jModels.getMentalHealthRecords.mockResolvedValue([
        {
          id: 'mental123',
          date: '2025-03-17T11:00:00.000Z',
          score: 85,
          stress: 30,
          anxiety: 25,
          mood: 90
        }
      ]);

      // Call the service function
      const result = await healthService.getMentalHealthData('user123');

      // Assertions
      expect(neo4jModels.getMentalHealthRecords).toHaveBeenCalledWith('user123', 10);
      expect(result).toEqual([
        {
          id: 'mental123',
          date: '2025-03-17T11:00:00.000Z',
          score: 85,
          stress: 30,
          anxiety: 25,
          mood: 90
        }
      ]);
    });
  });

  describe('Sleep Service', () => {
    test('syncSleepData should create a sleep record', async () => {
      // Mock the Neo4j model function
      neo4jModels.createSleepRecord.mockResolvedValue({
        id: 'sleep123',
        date: '2025-03-17T11:00:00.000Z',
        duration: 480,
        quality: 90,
        deep: 30,
        light: 50,
        rem: 15,
        awake: 5
      });

      // Call the service function
      const result = await healthService.syncSleepData('user123');

      // Assertions
      expect(neo4jModels.createSleepRecord).toHaveBeenCalledWith('user123', expect.any(Object));
      expect(result).toEqual({
        id: 'sleep123',
        date: '2025-03-17T11:00:00.000Z',
        duration: 480,
        quality: 90,
        deep: 30,
        light: 50,
        rem: 15,
        awake: 5
      });
    });

    test('getSleepData should return sleep records', async () => {
      // Mock the Neo4j model function
      neo4jModels.getSleepRecords.mockResolvedValue([
        {
          id: 'sleep123',
          date: '2025-03-17T11:00:00.000Z',
          duration: 480,
          quality: 90,
          deep: 30,
          light: 50,
          rem: 15,
          awake: 5
        }
      ]);

      // Call the service function
      const result = await healthService.getSleepData('user123');

      // Assertions
      expect(neo4jModels.getSleepRecords).toHaveBeenCalledWith('user123', 10);
      expect(result).toEqual([
        {
          id: 'sleep123',
          date: '2025-03-17T11:00:00.000Z',
          duration: 480,
          quality: 90,
          deep: 30,
          light: 50,
          rem: 15,
          awake: 5
        }
      ]);
    });
  });

  describe('Nutrition Service', () => {
    test('syncNutritionData should create a nutrition record', async () => {
      // Mock the Neo4j model function
      neo4jModels.createNutritionRecord.mockResolvedValue({
        id: 'nutrition123',
        date: '2025-03-17T11:00:00.000Z',
        totalCalories: 450,
        totalProtein: 25,
        totalCarbs: 45,
        totalFat: 15
      });

      // Call the service function
      const result = await healthService.syncNutritionData('user123');

      // Assertions
      expect(neo4jModels.createNutritionRecord).toHaveBeenCalledWith('user123', expect.any(Object));
      expect(result).toEqual({
        id: 'nutrition123',
        date: '2025-03-17T11:00:00.000Z',
        totalCalories: 450,
        totalProtein: 25,
        totalCarbs: 45,
        totalFat: 15
      });
    });

    test('getNutritionData should return nutrition records', async () => {
      // Mock the Neo4j model function
      neo4jModels.getNutritionRecords.mockResolvedValue([
        {
          id: 'nutrition123',
          date: '2025-03-17T11:00:00.000Z',
          totalCalories: 450,
          totalProtein: 25,
          totalCarbs: 45,
          totalFat: 15,
          meals: [
            {
              name: 'Breakfast',
              calories: 450,
              protein: 25,
              carbs: 45,
              fat: 15
            }
          ]
        }
      ]);

      // Call the service function
      const result = await healthService.getNutritionData('user123');

      // Assertions
      expect(neo4jModels.getNutritionRecords).toHaveBeenCalledWith('user123', 10);
      expect(result).toEqual([
        {
          id: 'nutrition123',
          date: '2025-03-17T11:00:00.000Z',
          totalCalories: 450,
          totalProtein: 25,
          totalCarbs: 45,
          totalFat: 15,
          meals: [
            {
              name: 'Breakfast',
              calories: 450,
              protein: 25,
              carbs: 45,
              fat: 15
            }
          ]
        }
      ]);
    });
  });

  describe('Fitness Service', () => {
    test('syncFitnessData should create a fitness record', async () => {
      // Mock the Neo4j model function
      neo4jModels.createFitnessRecord.mockResolvedValue({
        id: 'fitness123',
        date: '2025-03-17T11:00:00.000Z',
        activity_type: 'Run',
        duration: 60,
        distance: 10,
        calories: 500,
        avg_speed: 10,
        max_speed: 15,
        elevation_gain: 100
      });

      // Call the service function
      const result = await healthService.syncFitnessData('user123');

      // Assertions
      expect(neo4jModels.createFitnessRecord).toHaveBeenCalledWith('user123', expect.any(Object));
      expect(result).toEqual({
        id: 'fitness123',
        date: '2025-03-17T11:00:00.000Z',
        activity_type: 'Run',
        duration: 60,
        distance: 10,
        calories: 500,
        avg_speed: 10,
        max_speed: 15,
        elevation_gain: 100
      });
    });

    test('getFitnessData should return fitness records', async () => {
      // Mock the Neo4j model function
      neo4jModels.getFitnessRecords.mockResolvedValue([
        {
          id: 'fitness123',
          date: '2025-03-17T11:00:00.000Z',
          activity_type: 'Run',
          duration: 60,
          distance: 10,
          calories: 500,
          avg_speed: 10,
          max_speed: 15,
          elevation_gain: 100
        }
      ]);

      // Call the service function
      const result = await healthService.getFitnessData('user123');

      // Assertions
      expect(neo4jModels.getFitnessRecords).toHaveBeenCalledWith('user123', 10);
      expect(result).toEqual([
        {
          id: 'fitness123',
          date: '2025-03-17T11:00:00.000Z',
          activity_type: 'Run',
          duration: 60,
          distance: 10,
          calories: 500,
          avg_speed: 10,
          max_speed: 15,
          elevation_gain: 100
        }
      ]);
    });
  });

  describe('Dashboard Service', () => {
    test('getDashboardData should return aggregated health data', async () => {
      // Mock the Neo4j model functions
      neo4jModels.getMentalHealthRecords.mockResolvedValue([
        {
          id: 'mental123',
          date: '2025-03-17T11:00:00.000Z',
          score: 85
        }
      ]);
      
      neo4jModels.getSleepRecords.mockResolvedValue([
        {
          id: 'sleep123',
          date: '2025-03-17T11:00:00.000Z',
          quality: 90
        }
      ]);
      
      neo4jModels.getNutritionRecords.mockResolvedValue([
        {
          id: 'nutrition123',
          date: '2025-03-17T11:00:00.000Z',
          totalCalories: 450,
          totalProtein: 25,
          totalCarbs: 45,
          totalFat: 15
        }
      ]);
      
      neo4jModels.getFitnessRecords.mockResolvedValue([
        {
          id: 'fitness123',
          date: '2025-03-17T11:00:00.000Z',
          duration: 60
        }
      ]);

      // Call the service function
      const result = await healthService.getDashboardData('user123');

      // Assertions
      expect(neo4jModels.getMentalHealthRecords).toHaveBeenCalledWith('user123', 1);
      expect(neo4jModels.getSleepRecords).toHaveBeenCalledWith('user123', 1);
      expect(neo4jModels.getNutritionRecords).toHaveBeenCalledWith('user123', 1);
      expect(neo4jModels.getFitnessRecords).toHaveBeenCalledWith('user123', 1);
      
      expect(result).toHaveProperty('mental');
      expect(result).toHaveProperty('sleep');
      expect(result).toHaveProperty('nutrition');
      expect(result).toHaveProperty('fitness');
      expect(result).toHaveProperty('overall_wellness_score');
    });
  });

  describe('Health Insights Service', () => {
    test('getHealthInsights should return health correlations', async () => {
      // Mock the Neo4j model function
      neo4jModels.getHealthCorrelations.mockResolvedValue({
        sleepMental: {
          type: 'correlation',
          domains: ['sleep', 'mental'],
          strength: 0.75,
          description: 'Your mental health score tends to be higher on days following good sleep.'
        },
        fitnessSleep: {
          type: 'correlation',
          domains: ['fitness', 'sleep'],
          strength: 0.65,
          description: 'Days with physical activity are associated with better sleep quality.'
        }
      });

      // Call the service function
      const result = await healthService.getHealthInsights('user123');

      // Assertions
      expect(neo4jModels.getHealthCorrelations).toHaveBeenCalledWith('user123');
      expect(result).toHaveProperty('insights');
      expect(result.insights).toHaveLength(2);
      expect(result.insights[0]).toHaveProperty('type', 'correlation');
      expect(result.insights[0]).toHaveProperty('domains');
      expect(result.insights[0]).toHaveProperty('strength');
      expect(result.insights[0]).toHaveProperty('description');
    });
  });
});
