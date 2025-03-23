// Service layer for handling business logic
// This file contains services that use models and API adapters

const neo4jModels = require('../models/neo4j.models');
const ApiAdapterFactory = require('../api/adapters');

// Initialize API adapters
const sahhaAdapter = ApiAdapterFactory.createSahhaAdapter();
const asleepAdapter = ApiAdapterFactory.createAsleepAdapter();
const passioAdapter = ApiAdapterFactory.createPassioAdapter();
const stravaAdapter = ApiAdapterFactory.createStravaAdapter();

// User service
exports.createUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await neo4jModels.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create user in database
    const user = await neo4jModels.createUser(userData);
    return user;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

exports.findUserById = async (userId) => {
  try {
    const user = await neo4jModels.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Find user error:', error);
    throw error;
  }
};

exports.updateUser = async (userId, userData) => {
  try {
    const user = await neo4jModels.updateUser(userId, userData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Mental health service (Sahha.ai)
exports.syncMentalHealthData = async (userId) => {
  try {
    // In a real app, we would call the Sahha API
    // For MVP, we'll use mock data
    const mentalHealthData = await sahhaAdapter.getMockData();
    
    // Store in Neo4j
    const record = await neo4jModels.createMentalHealthRecord(userId, mentalHealthData);
    return record;
  } catch (error) {
    console.error('Sync mental health data error:', error);
    throw error;
  }
};

exports.getMentalHealthData = async (userId, limit = 10) => {
  try {
    const records = await neo4jModels.getMentalHealthRecords(userId, limit);
    return records;
  } catch (error) {
    console.error('Get mental health data error:', error);
    throw error;
  }
};

// Sleep service (Asleep.ai)
exports.syncSleepData = async (userId) => {
  try {
    // In a real app, we would call the Asleep API
    // For MVP, we'll use mock data
    const sleepData = await asleepAdapter.getMockData();
    
    // Store in Neo4j
    const record = await neo4jModels.createSleepRecord(userId, sleepData);
    return record;
  } catch (error) {
    console.error('Sync sleep data error:', error);
    throw error;
  }
};

exports.getSleepData = async (userId, limit = 10) => {
  try {
    const records = await neo4jModels.getSleepRecords(userId, limit);
    return records;
  } catch (error) {
    console.error('Get sleep data error:', error);
    throw error;
  }
};

// Nutrition service (Passio.ai)
exports.syncNutritionData = async (userId) => {
  try {
    // In a real app, we would call the Passio API
    // For MVP, we'll use mock data
    const nutritionData = await passioAdapter.getMockData();
    
    // Store in Neo4j
    const record = await neo4jModels.createNutritionRecord(userId, nutritionData);
    return record;
  } catch (error) {
    console.error('Sync nutrition data error:', error);
    throw error;
  }
};

exports.getNutritionData = async (userId, limit = 10) => {
  try {
    const records = await neo4jModels.getNutritionRecords(userId, limit);
    return records;
  } catch (error) {
    console.error('Get nutrition data error:', error);
    throw error;
  }
};

exports.logMeal = async (userId, mealData) => {
  try {
    // In a real app, we would validate the meal data with Passio API
    // For MVP, we'll just store the data
    
    // Get the latest nutrition record or create a new one
    let nutritionRecords = await neo4jModels.getNutritionRecords(userId, 1);
    let nutritionData;
    
    if (nutritionRecords.length === 0 || new Date(nutritionRecords[0].date).toDateString() !== new Date().toDateString()) {
      // Create a new nutrition record for today
      nutritionData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        meals: [mealData],
        totalCalories: mealData.calories,
        totalMacros: {
          protein: mealData.macros.protein,
          carbs: mealData.macros.carbs,
          fat: mealData.macros.fat
        }
      };
    } else {
      // Update existing nutrition record
      nutritionData = nutritionRecords[0];
      nutritionData.meals.push(mealData);
      nutritionData.totalCalories += mealData.calories;
      nutritionData.totalMacros.protein += mealData.macros.protein;
      nutritionData.totalMacros.carbs += mealData.macros.carbs;
      nutritionData.totalMacros.fat += mealData.macros.fat;
    }
    
    // Store in Neo4j
    const record = await neo4jModels.createNutritionRecord(userId, nutritionData);
    return record;
  } catch (error) {
    console.error('Log meal error:', error);
    throw error;
  }
};

// Fitness service (Strava)
exports.syncFitnessData = async (userId, accessToken) => {
  try {
    // In a real app, we would call the Strava API with the access token
    // For MVP, we'll use mock data
    const fitnessData = await stravaAdapter.getMockData();
    
    // Store in Neo4j
    const record = await neo4jModels.createFitnessRecord(userId, fitnessData);
    return record;
  } catch (error) {
    console.error('Sync fitness data error:', error);
    throw error;
  }
};

exports.getFitnessData = async (userId, limit = 10) => {
  try {
    const records = await neo4jModels.getFitnessRecords(userId, limit);
    return records;
  } catch (error) {
    console.error('Get fitness data error:', error);
    throw error;
  }
};

// Dashboard service (aggregated data)
exports.getDashboardData = async (userId) => {
  try {
    // Get the latest data from each category
    const mentalHealthRecords = await neo4jModels.getMentalHealthRecords(userId, 1);
    const sleepRecords = await neo4jModels.getSleepRecords(userId, 1);
    const nutritionRecords = await neo4jModels.getNutritionRecords(userId, 1);
    const fitnessRecords = await neo4jModels.getFitnessRecords(userId, 1);
    
    // Calculate overall wellness score (simplified for MVP)
    let overallScore = 0;
    let scoreCount = 0;
    
    if (mentalHealthRecords.length > 0) {
      overallScore += mentalHealthRecords[0].score;
      scoreCount++;
    }
    
    if (sleepRecords.length > 0) {
      overallScore += sleepRecords[0].quality;
      scoreCount++;
    }
    
    if (nutritionRecords.length > 0) {
      // Simplified nutrition score based on balanced macros
      const nutrition = nutritionRecords[0];
      const totalCalories = nutrition.totalCalories;
      const proteinCalories = nutrition.totalProtein * 4;
      const carbsCalories = nutrition.totalCarbs * 4;
      const fatCalories = nutrition.totalFat * 9;
      
      const proteinPercentage = proteinCalories / totalCalories;
      const carbsPercentage = carbsCalories / totalCalories;
      const fatPercentage = fatCalories / totalCalories;
      
      // Ideal: protein 25-35%, carbs 45-65%, fat 20-35%
      const nutritionScore = 100 - (
        Math.abs(proteinPercentage - 0.3) * 100 +
        Math.abs(carbsPercentage - 0.5) * 100 +
        Math.abs(fatPercentage - 0.2) * 100
      );
      
      overallScore += nutritionScore;
      scoreCount++;
    }
    
    if (fitnessRecords.length > 0) {
      // Simplified fitness score based on duration
      const fitnessScore = Math.min(100, fitnessRecords[0].duration / 60 * 100);
      overallScore += fitnessScore;
      scoreCount++;
    }
    
    // Calculate average score
    const finalScore = scoreCount > 0 ? Math.round(overallScore / scoreCount) : 0;
    
    return {
      mental: mentalHealthRecords.length > 0 ? mentalHealthRecords[0] : null,
      sleep: sleepRecords.length > 0 ? sleepRecords[0] : null,
      nutrition: nutritionRecords.length > 0 ? nutritionRecords[0] : null,
      fitness: fitnessRecords.length > 0 ? fitnessRecords[0] : null,
      overall_wellness_score: finalScore
    };
  } catch (error) {
    console.error('Get dashboard data error:', error);
    throw error;
  }
};

// Health insights service (correlations)
exports.getHealthInsights = async (userId) => {
  try {
    const correlations = await neo4jModels.getHealthCorrelations(userId);
    return {
      insights: Object.values(correlations)
    };
  } catch (error) {
    console.error('Get health insights error:', error);
    throw error;
  }
};

// Database initialization
exports.initializeDatabase = async () => {
  try {
    return await neo4jModels.initializeDatabase();
  } catch (error) {
    console.error('Initialize database error:', error);
    throw error;
  }
};
