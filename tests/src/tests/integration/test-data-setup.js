/**
 * Test data setup utilities for integration tests
 * This file provides functions for setting up test data in Neo4j
 */

/**
 * Sets up test data for API integration tests
 * @param {Session} session - The Neo4j session
 * @returns {Promise<void>}
 */
async function setupTestData(session) {
  // Create test user
  await session.run(`
    CREATE (u:User {
      id: 'test-user-id', 
      name: 'Test User', 
      email: 'test@example.com',
      password: '$2b$10$X7KAdjz5DlUmzU/RbPNO/OQ9FXGFZOmVA8qqXUO1YMrCdYQZXMXSi' // hashed 'password123'
    })
    RETURN u
  `);
  
  // Create mental health data
  await session.run(`
    MATCH (u:User {id: 'test-user-id'})
    CREATE (m:MentalHealth {
      id: 'mental-1', 
      date: '2025-03-17', 
      score: 85, 
      stress: 30, 
      anxiety: 25, 
      mood: 90
    })
    CREATE (u)-[:HAS_MENTAL_HEALTH]->(m)
    RETURN m
  `);
  
  // Create sleep data
  await session.run(`
    MATCH (u:User {id: 'test-user-id'})
    CREATE (s:Sleep {
      id: 'sleep-1', 
      date: '2025-03-17', 
      duration: 480, 
      quality: 90, 
      deep: 30, 
      light: 50, 
      rem: 15, 
      awake: 5
    })
    CREATE (u)-[:HAS_SLEEP]->(s)
    RETURN s
  `);
  
  // Create nutrition data
  await session.run(`
    MATCH (u:User {id: 'test-user-id'})
    CREATE (n:Nutrition {
      id: 'nutrition-1', 
      date: '2025-03-17', 
      totalCalories: 450, 
      totalProtein: 25, 
      totalCarbs: 45, 
      totalFat: 15
    })
    CREATE (u)-[:HAS_NUTRITION]->(n)
    RETURN n
  `);
  
  // Create fitness data
  await session.run(`
    MATCH (u:User {id: 'test-user-id'})
    CREATE (f:Fitness {
      id: 'fitness-1', 
      date: '2025-03-17', 
      activity_type: 'Run', 
      duration: 60, 
      distance: 10, 
      calories: 500,
      avg_speed: 10,
      max_speed: 15,
      elevation_gain: 100
    })
    CREATE (u)-[:HAS_FITNESS]->(f)
    RETURN f
  `);
  
  // Create API connections
  await session.run(`
    MATCH (u:User {id: 'test-user-id'})
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
    RETURN c
  `);
}

module.exports = {
  setupTestData
};
