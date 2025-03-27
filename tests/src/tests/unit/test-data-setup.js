/**
 * Test data setup utilities for Neo4j tests
 * This file provides functions for setting up test data in Neo4j
 */

/**
 * Sets up test data for health-related tests
 * @param {Session} session - The Neo4j session
 * @returns {Promise<void>}
 */
async function setupHealthTestData(session) {
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

/**
 * Sets up test data for user-related tests
 * @param {Session} session - The Neo4j session
 * @returns {Promise<void>}
 */
async function setupUserTestData(session) {
  // Create multiple test users
  await session.run(`
    CREATE (u1:User {id: 'user-1', name: 'User One', email: 'user1@example.com'})
    CREATE (u2:User {id: 'user-2', name: 'User Two', email: 'user2@example.com'})
    CREATE (u3:User {id: 'user-3', name: 'User Three', email: 'user3@example.com'})
    RETURN u1, u2, u3
  `);
  
  // Create user connections
  await session.run(`
    MATCH (u1:User {id: 'user-1'})
    MATCH (u2:User {id: 'user-2'})
    CREATE (u1)-[:FOLLOWS]->(u2)
    RETURN u1, u2
  `);
}

/**
 * Sets up test data for API connection tests
 * @param {Session} session - The Neo4j session
 * @returns {Promise<void>}
 */
async function setupApiConnectionTestData(session) {
  // Create test user with API connections
  await session.run(`
    CREATE (u:User {id: 'api-test-user', name: 'API Test User', email: 'apitest@example.com'})
    CREATE (c:Connections {
      id: 'conn-1',
      sahha: true,
      sahhaToken: 'test-sahha-token',
      asleep: true,
      asleepToken: 'test-asleep-token',
      passio: true,
      passioToken: 'test-passio-token',
      strava: true,
      stravaToken: 'test-strava-token',
      stravaRefreshToken: 'test-strava-refresh-token'
    })
    CREATE (u)-[:HAS_CONNECTIONS]->(c)
    RETURN u, c
  `);
}

module.exports = {
  setupHealthTestData,
  setupUserTestData,
  setupApiConnectionTestData
};
