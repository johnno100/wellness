/**
 * API Integration Tests using TestContainers
 * Tests the complete flow from API endpoints through services to database operations
 */

const { setupNeo4jContainer, teardownNeo4jContainer, clearDatabase } = require('./neo4j.testcontainer');
const { setupTestData } = require('./test-data-setup');
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('API Integration Tests', () => {
  let neo4jSetup;
  let app;
  let authToken;
  
  beforeAll(async () => {
    // Setup Neo4j container
    neo4jSetup = await setupNeo4jContainer();
    
    // Set environment variables for test
    process.env.NEO4J_URI = neo4jSetup.uri;
    process.env.NEO4J_USERNAME = neo4jSetup.username;
    process.env.NEO4J_PASSWORD = neo4jSetup.password;
    process.env.JWT_SECRET = 'test-jwt-secret';
    
    // Import app after setting environment variables
    app = require('../../app');
    
    // Create auth token for test user
    authToken = jwt.sign(
      { id: 'test-user-id', email: 'test@example.com' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }, 60000); // Increase timeout for container startup
  
  afterAll(async () => {
    // Teardown Neo4j container
    await teardownNeo4jContainer(neo4jSetup);
    
    // Clear environment variables
    delete process.env.NEO4J_URI;
    delete process.env.NEO4J_USERNAME;
    delete process.env.NEO4J_PASSWORD;
    delete process.env.JWT_SECRET;
    
    // Clear module cache
    jest.resetModules();
  }, 60000); // Increase timeout for container shutdown
  
  beforeEach(async () => {
    // Clear database before each test
    await clearDatabase(neo4jSetup.session);
    
    // Setup test data
    await setupTestData(neo4jSetup.session);
  });
  
  describe('Authentication API', () => {
    test('POST /api/auth/register should register a new user', async () => {
      // Arrange
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };
      
      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'New User');
      expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
      expect(response.body).toHaveProperty('token');
      
      // Verify user was created in database
      const result = await neo4jSetup.session.run(
        'MATCH (u:User {email: $email}) RETURN u',
        { email: 'newuser@example.com' }
      );
      
      expect(result.records.length).toBe(1);
    });
    
    test('POST /api/auth/login should authenticate a user', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('token');
    });
    
    test('POST /api/auth/login should reject invalid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      
      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);
      
      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
  
  describe('User API', () => {
    test('GET /api/users/profile should return user profile', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'test-user-id');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });
    
    test('PUT /api/users/profile should update user profile', async () => {
      // Arrange
      const updatedProfile = {
        name: 'Updated User Name'
      };
      
      // Act
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedProfile);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user).toHaveProperty('name', 'Updated User Name');
      
      // Verify profile was updated in database
      const result = await neo4jSetup.session.run(
        'MATCH (u:User {id: $id}) RETURN u',
        { id: 'test-user-id' }
      );
      
      const user = result.records[0].get('u').properties;
      expect(user.name).toBe('Updated User Name');
    });
    
    test('GET /api/users/connections should return user API connections', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/connections')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sahha', true);
      expect(response.body).toHaveProperty('asleep', true);
      expect(response.body).toHaveProperty('passio', true);
      expect(response.body).toHaveProperty('strava', true);
    });
  });
  
  describe('Health API', () => {
    test('GET /api/health/mental should return mental health data', async () => {
      // Act
      const response = await request(app)
        .get('/api/health/mental')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('score', 85);
      expect(response.body.data[0]).toHaveProperty('stress', 30);
      expect(response.body.data[0]).toHaveProperty('anxiety', 25);
      expect(response.body.data[0]).toHaveProperty('mood', 90);
    });
    
    test('GET /api/health/sleep should return sleep data', async () => {
      // Act
      const response = await request(app)
        .get('/api/health/sleep')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('quality', 90);
      expect(response.body.data[0]).toHaveProperty('duration', 480);
    });
    
    test('GET /api/health/nutrition should return nutrition data', async () => {
      // Act
      const response = await request(app)
        .get('/api/health/nutrition')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('totalCalories', 450);
      expect(response.body.data[0]).toHaveProperty('totalProtein', 25);
      expect(response.body.data[0]).toHaveProperty('totalCarbs', 45);
      expect(response.body.data[0]).toHaveProperty('totalFat', 15);
    });
    
    test('GET /api/health/fitness should return fitness data', async () => {
      // Act
      const response = await request(app)
        .get('/api/health/fitness')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('activity_type', 'Run');
      expect(response.body.data[0]).toHaveProperty('duration', 60);
      expect(response.body.data[0]).toHaveProperty('distance', 10);
      expect(response.body.data[0]).toHaveProperty('calories', 500);
    });
    
    test('GET /api/health/dashboard should return dashboard data', async () => {
      // Act
      const response = await request(app)
        .get('/api/health/dashboard')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mental');
      expect(response.body).toHaveProperty('sleep');
      expect(response.body).toHaveProperty('nutrition');
      expect(response.body).toHaveProperty('fitness');
      expect(response.body).toHaveProperty('overall_wellness_score');
      
      // Verify specific data points
      expect(response.body.mental).toHaveProperty('latest_score', 85);
      expect(response.body.sleep).toHaveProperty('latest_quality', 90);
      expect(response.body.nutrition).toHaveProperty('latest_calories', 450);
      expect(response.body.fitness).toHaveProperty('latest_activity', 'Run');
    });
    
    test('GET /api/health/insights should return health insights', async () => {
      // Act
      const response = await request(app)
        .get('/api/health/insights')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('insights');
      expect(Array.isArray(response.body.insights)).toBe(true);
      
      // Insights may vary based on the algorithm, so we just check the structure
      if (response.body.insights.length > 0) {
        expect(response.body.insights[0]).toHaveProperty('type');
        expect(response.body.insights[0]).toHaveProperty('domains');
        expect(response.body.insights[0]).toHaveProperty('description');
      }
    });
  });
});
