// API integration tests
const request = require('supertest');
const app = require('../src/app');
const neo4jModels = require('../src/models/neo4j.models');

// Mock the Neo4j models
jest.mock('../src/models/neo4j.models');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication API', () => {
    test('POST /api/auth/register should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    test('POST /api/auth/login should authenticate a user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    test('GET /api/auth/strava should redirect to Strava authorization', async () => {
      const response = await request(app)
        .get('/api/auth/strava');

      expect(response.status).toBe(302); // Redirect
      expect(response.header.location).toContain('strava.com/oauth/authorize');
    });
  });

  describe('User API', () => {
    let authToken;

    beforeEach(async () => {
      // Login to get auth token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      authToken = loginResponse.body.token;
    });

    test('GET /api/users/profile should return user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
    });

    test('PUT /api/users/profile should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user).toHaveProperty('name', 'Updated Name');
    });

    test('POST /api/users/connect/sahha should connect Sahha.ai', async () => {
      const response = await request(app)
        .post('/api/users/connect/sahha')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          apiKey: 'test_api_key'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Sahha.ai connected successfully');
      expect(response.body).toHaveProperty('connections');
      expect(response.body.connections).toHaveProperty('sahha', true);
    });
  });

  describe('Health API', () => {
    let authToken;

    beforeEach(async () => {
      // Login to get auth token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      authToken = loginResponse.body.token;

      // Mock Neo4j model responses
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
    });

    test('GET /api/health/mental should return mental health data', async () => {
      const response = await request(app)
        .get('/api/health/mental')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('score', 85);
    });

    test('POST /api/health/mental/sync should sync mental health data', async () => {
      neo4jModels.createMentalHealthRecord.mockResolvedValue({
        id: 'mental123',
        date: '2025-03-17T11:00:00.000Z',
        score: 85,
        stress: 30,
        anxiety: 25,
        mood: 90
      });

      const response = await request(app)
        .post('/api/health/mental/sync')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Mental health data synced successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('score', 85);
    });

    test('GET /api/health/sleep should return sleep data', async () => {
      const response = await request(app)
        .get('/api/health/sleep')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('quality', 90);
    });

    test('POST /api/health/sleep/sync should sync sleep data', async () => {
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

      const response = await request(app)
        .post('/api/health/sleep/sync')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Sleep data synced successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('quality', 90);
    });

    test('GET /api/health/nutrition should return nutrition data', async () => {
      const response = await request(app)
        .get('/api/health/nutrition')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('totalCalories', 450);
    });

    test('POST /api/health/nutrition/sync should sync nutrition data', async () => {
      neo4jModels.createNutritionRecord.mockResolvedValue({
        id: 'nutrition123',
        date: '2025-03-17T11:00:00.000Z',
        totalCalories: 450,
        totalProtein: 25,
        totalCarbs: 45,
        totalFat: 15
      });

      const response = await request(app)
        .post('/api/health/nutrition/sync')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Nutrition data synced successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalCalories', 450);
    });

    test('GET /api/health/fitness should return fitness data', async () => {
      const response = await request(app)
        .get('/api/health/fitness')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('activity_type', 'Run');
    });

    test('POST /api/health/fitness/sync should sync fitness data', async () => {
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

      const response = await request(app)
        .post('/api/health/fitness/sync')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Fitness data synced successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('activity_type', 'Run');
    });

    test('GET /api/health/dashboard should return dashboard data', async () => {
      const response = await request(app)
        .get('/api/health/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mental');
      expect(response.body).toHaveProperty('sleep');
      expect(response.body).toHaveProperty('nutrition');
      expect(response.body).toHaveProperty('fitness');
      expect(response.body).toHaveProperty('overall_wellness_score');
    });

    test('GET /api/health/insights should return health insights', async () => {
      const response = await request(app)
        .get('/api/health/insights')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('insights');
      expect(response.body.insights).toHaveLength(2);
      expect(response.body.insights[0]).toHaveProperty('type', 'correlation');
      expect(response.body.insights[0]).toHaveProperty('domains');
      expect(response.body.insights[0]).toHaveProperty('strength');
      expect(response.body.insights[0]).toHaveProperty('description');
    });
  });
});
