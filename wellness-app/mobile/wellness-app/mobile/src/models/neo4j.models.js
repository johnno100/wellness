// Neo4j models for the Wellness app
// This file defines the data models and their relationships in Neo4j

const neo4j = require('../config/neo4j.config');

// User model
exports.createUser = async (userData) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      CREATE (u:User {
        id: $id,
        name: $name,
        email: $email,
        password: $password,
        created_at: datetime(),
        updated_at: datetime()
      })
      RETURN u
      `,
      {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password
      }
    );
    
    return result.records[0].get('u').properties;
  } finally {
    await session.close();
  }
};

exports.findUserById = async (userId) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $id})
      RETURN u
      `,
      { id: userId }
    );
    
    if (result.records.length === 0) {
      return null;
    }
    
    return result.records[0].get('u').properties;
  } finally {
    await session.close();
  }
};

exports.findUserByEmail = async (email) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN u
      `,
      { email }
    );
    
    if (result.records.length === 0) {
      return null;
    }
    
    return result.records[0].get('u').properties;
  } finally {
    await session.close();
  }
};

exports.updateUser = async (userId, userData) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $id})
      SET u += $userData, u.updated_at = datetime()
      RETURN u
      `,
      {
        id: userId,
        userData: {
          name: userData.name,
          email: userData.email
        }
      }
    );
    
    if (result.records.length === 0) {
      return null;
    }
    
    return result.records[0].get('u').properties;
  } finally {
    await session.close();
  }
};

// Mental Health model (Sahha.ai)
exports.createMentalHealthRecord = async (userId, mentalHealthData) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (m:MentalHealth {
        id: $id,
        date: datetime($date),
        score: $score,
        stress: $stress,
        anxiety: $anxiety,
        mood: $mood,
        created_at: datetime()
      })
      CREATE (u)-[:HAS_MENTAL_HEALTH]->(m)
      RETURN m
      `,
      {
        userId,
        id: mentalHealthData.id,
        date: mentalHealthData.date,
        score: mentalHealthData.score,
        stress: mentalHealthData.factors.stress,
        anxiety: mentalHealthData.factors.anxiety,
        mood: mentalHealthData.factors.mood
      }
    );
    
    return result.records[0].get('m').properties;
  } finally {
    await session.close();
  }
};

exports.getMentalHealthRecords = async (userId, limit = 10) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
      RETURN m
      ORDER BY m.date DESC
      LIMIT $limit
      `,
      { userId, limit: neo4j.int(limit) }
    );
    
    return result.records.map(record => record.get('m').properties);
  } finally {
    await session.close();
  }
};

// Sleep model (Asleep.ai)
exports.createSleepRecord = async (userId, sleepData) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (s:Sleep {
        id: $id,
        date: datetime($date),
        duration: $duration,
        quality: $quality,
        deep: $deep,
        light: $light,
        rem: $rem,
        awake: $awake,
        created_at: datetime()
      })
      CREATE (u)-[:HAS_SLEEP]->(s)
      RETURN s
      `,
      {
        userId,
        id: sleepData.id,
        date: sleepData.date,
        duration: neo4j.int(sleepData.duration),
        quality: neo4j.int(sleepData.quality),
        deep: neo4j.int(sleepData.stages.deep),
        light: neo4j.int(sleepData.stages.light),
        rem: neo4j.int(sleepData.stages.rem),
        awake: neo4j.int(sleepData.stages.awake)
      }
    );
    
    return result.records[0].get('s').properties;
  } finally {
    await session.close();
  }
};

exports.getSleepRecords = async (userId, limit = 10) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_SLEEP]->(s:Sleep)
      RETURN s
      ORDER BY s.date DESC
      LIMIT $limit
      `,
      { userId, limit: neo4j.int(limit) }
    );
    
    return result.records.map(record => record.get('s').properties);
  } finally {
    await session.close();
  }
};

// Nutrition model (Passio.ai)
exports.createNutritionRecord = async (userId, nutritionData) => {
  const session = neo4j.getSession();
  try {
    // First create the nutrition record
    const nutritionResult = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (n:Nutrition {
        id: $id,
        date: datetime($date),
        totalCalories: $totalCalories,
        totalProtein: $totalProtein,
        totalCarbs: $totalCarbs,
        totalFat: $totalFat,
        created_at: datetime()
      })
      CREATE (u)-[:HAS_NUTRITION]->(n)
      RETURN n
      `,
      {
        userId,
        id: nutritionData.id,
        date: nutritionData.date,
        totalCalories: neo4j.int(nutritionData.totalCalories),
        totalProtein: neo4j.int(nutritionData.totalMacros.protein),
        totalCarbs: neo4j.int(nutritionData.totalMacros.carbs),
        totalFat: neo4j.int(nutritionData.totalMacros.fat)
      }
    );
    
    const nutritionRecord = nutritionResult.records[0].get('n').properties;
    
    // Then create meal nodes for each meal
    for (const meal of nutritionData.meals) {
      await session.run(
        `
        MATCH (n:Nutrition {id: $nutritionId})
        CREATE (m:Meal {
          name: $name,
          calories: $calories,
          protein: $protein,
          carbs: $carbs,
          fat: $fat,
          created_at: datetime()
        })
        CREATE (n)-[:INCLUDES_MEAL]->(m)
        `,
        {
          nutritionId: nutritionData.id,
          name: meal.name,
          calories: neo4j.int(meal.calories),
          protein: neo4j.int(meal.macros.protein),
          carbs: neo4j.int(meal.macros.carbs),
          fat: neo4j.int(meal.macros.fat)
        }
      );
    }
    
    return nutritionRecord;
  } finally {
    await session.close();
  }
};

exports.getNutritionRecords = async (userId, limit = 10) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_NUTRITION]->(n:Nutrition)
      OPTIONAL MATCH (n)-[:INCLUDES_MEAL]->(m:Meal)
      RETURN n, collect(m) as meals
      ORDER BY n.date DESC
      LIMIT $limit
      `,
      { userId, limit: neo4j.int(limit) }
    );
    
    return result.records.map(record => {
      const nutrition = record.get('n').properties;
      const meals = record.get('meals').map(meal => meal.properties);
      return {
        ...nutrition,
        meals
      };
    });
  } finally {
    await session.close();
  }
};

// Fitness model (Strava)
exports.createFitnessRecord = async (userId, fitnessData) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (f:Fitness {
        id: $id,
        date: datetime($date),
        activity_type: $activityType,
        duration: $duration,
        distance: $distance,
        calories: $calories,
        avg_speed: $avgSpeed,
        max_speed: $maxSpeed,
        elevation_gain: $elevationGain,
        created_at: datetime()
      })
      CREATE (u)-[:HAS_FITNESS]->(f)
      RETURN f
      `,
      {
        userId,
        id: fitnessData.id,
        date: fitnessData.date,
        activityType: fitnessData.activity_type,
        duration: neo4j.int(fitnessData.duration),
        distance: fitnessData.distance,
        calories: neo4j.int(fitnessData.calories),
        avgSpeed: fitnessData.metrics.avg_speed,
        maxSpeed: fitnessData.metrics.max_speed,
        elevationGain: neo4j.int(fitnessData.metrics.elevation_gain)
      }
    );
    
    return result.records[0].get('f').properties;
  } finally {
    await session.close();
  }
};

exports.getFitnessRecords = async (userId, limit = 10) => {
  const session = neo4j.getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_FITNESS]->(f:Fitness)
      RETURN f
      ORDER BY f.date DESC
      LIMIT $limit
      `,
      { userId, limit: neo4j.int(limit) }
    );
    
    return result.records.map(record => record.get('f').properties);
  } finally {
    await session.close();
  }
};

// Correlation analysis between different health domains
exports.getHealthCorrelations = async (userId) => {
  const session = neo4j.getSession();
  try {
    // Example: Find correlation between sleep quality and mental health score
    const sleepMentalResult = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_SLEEP]->(s:Sleep)
      MATCH (u)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
      WHERE date(s.date).year = date(m.date).year 
        AND date(s.date).month = date(m.date).month 
        AND date(s.date).day = date(m.date).day
      RETURN s.quality as sleepQuality, m.score as mentalScore
      `,
      { userId }
    );
    
    // Example: Find correlation between fitness activity and sleep quality
    const fitnessSleepResult = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_FITNESS]->(f:Fitness)
      MATCH (u)-[:HAS_SLEEP]->(s:Sleep)
      WHERE date(f.date).year = date(s.date).year 
        AND date(f.date).month = date(s.date).month 
        AND date(f.date).day = date(s.date).day
      RETURN f.duration as fitnessDuration, s.quality as sleepQuality
      `,
      { userId }
    );
    
    // Example: Find correlation between nutrition and mental health
    const nutritionMentalResult = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_NUTRITION]->(n:Nutrition)
      MATCH (u)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
      WHERE date(n.date).year = date(m.date).year 
        AND date(n.date).month = date(m.date).month 
        AND date(n.date).day = date(m.date).day
      RETURN n.totalCalories as calories, m.score as mentalScore
      `,
      { userId }
    );
    
    // Process and return correlations
    // In a real app, we would calculate actual correlation coefficients
    return {
      sleepMental: {
        type: 'correlation',
        domains: ['sleep', 'mental'],
        strength: sleepMentalResult.records.length > 0 ? 0.75 : 0,
        description: 'Your mental health score tends to be higher on days following good sleep.'
      },
      fitnessSleep: {
        type: 'correlation',
        domains: ['fitness', 'sleep'],
        strength: fitnessSleepResult.records.length > 0 ? 0.65 : 0,
        description: 'Days with physical activity are associated with better sleep quality.'
      },
      nutritionMental: {
        type: 'correlation',
        domains: ['nutrition', 'mental'],
        strength: nutritionMentalResult.records.length > 0 ? 0.5 : 0,
        description: 'Your mood appears to be better on days with balanced nutrition.'
      }
    };
  } finally {
    await session.close();
  }
};

// Initialize database with constraints and indexes
exports.initializeDatabase = async () => {
  const session = neo4j.getSession();
  try {
    // Create constraints
    await session.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT user_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE');
    await session.run('CREATE CONSTRAINT mental_health_id IF NOT EXISTS FOR (m:MentalHealth) REQUIRE m.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT sleep_id IF NOT EXISTS FOR (s:Sleep) REQUIRE s.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT nutrition_id IF NOT EXISTS FOR (n:Nutrition) REQUIRE n.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT fitness_id IF NOT EXISTS FOR (f:Fitness) REQUIRE f.id IS UNIQUE');
    
    // Create indexes
    await session.run('CREATE INDEX user_name IF NOT EXISTS FOR (u:User) ON (u.name)');
    await session.run('CREATE INDEX mental_health_date IF NOT EXISTS FOR (m:MentalHealth) ON (m.date)');
    await session.run('CREATE INDEX sleep_date IF NOT EXISTS FOR (s:Sleep) ON (s.date)');
    await session.run('CREATE INDEX nutrition_date IF NOT EXISTS FOR (n:Nutrition) ON (n.date)');
    await session.run('CREATE INDEX fitness_date IF NOT EXISTS FOR (f:Fitness) ON (f.date)');
    
    console.log('Database initialized with constraints and indexes');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  } finally {
    await session.close();
  }
};
