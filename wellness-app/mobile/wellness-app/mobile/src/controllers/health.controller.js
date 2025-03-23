// Health controller for handling health data operations
// This controller integrates with all four APIs: sahha.ai, asleep.ai, passio.ai, and Strava

// Mock health data for MVP
const healthData = {
  mental: [],
  sleep: [],
  nutrition: [],
  fitness: []
};

// Mental health data (Sahha.ai)
exports.getMentalHealthData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would retrieve data from Neo4j
    // For MVP, we'll return mock data
    return res.status(200).json({
      data: healthData.mental
    });
  } catch (error) {
    console.error('Get mental health data error:', error);
    return res.status(500).json({ message: 'Error retrieving mental health data' });
  }
};

exports.syncMentalHealthData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would call the Sahha.ai API and store the data in Neo4j
    // For MVP, we'll add mock data
    
    const newData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: Math.floor(Math.random() * 100),
      factors: {
        stress: Math.floor(Math.random() * 100),
        anxiety: Math.floor(Math.random() * 100),
        mood: Math.floor(Math.random() * 100)
      }
    };
    
    healthData.mental.push(newData);
    
    return res.status(200).json({
      message: 'Mental health data synced successfully',
      data: newData
    });
  } catch (error) {
    console.error('Sync mental health data error:', error);
    return res.status(500).json({ message: 'Error syncing mental health data' });
  }
};

// Sleep data (Asleep.ai)
exports.getSleepData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would retrieve data from Neo4j
    // For MVP, we'll return mock data
    return res.status(200).json({
      data: healthData.sleep
    });
  } catch (error) {
    console.error('Get sleep data error:', error);
    return res.status(500).json({ message: 'Error retrieving sleep data' });
  }
};

exports.syncSleepData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would call the Asleep.ai API and store the data in Neo4j
    // For MVP, we'll add mock data
    
    const newData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: Math.floor(Math.random() * 600) + 300, // 5-10 hours in minutes
      quality: Math.floor(Math.random() * 100),
      stages: {
        deep: Math.floor(Math.random() * 40) + 10,
        light: Math.floor(Math.random() * 40) + 30,
        rem: Math.floor(Math.random() * 30) + 10,
        awake: Math.floor(Math.random() * 10)
      }
    };
    
    healthData.sleep.push(newData);
    
    return res.status(200).json({
      message: 'Sleep data synced successfully',
      data: newData
    });
  } catch (error) {
    console.error('Sync sleep data error:', error);
    return res.status(500).json({ message: 'Error syncing sleep data' });
  }
};

// Nutrition data (Passio.ai)
exports.getNutritionData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would retrieve data from Neo4j
    // For MVP, we'll return mock data
    return res.status(200).json({
      data: healthData.nutrition
    });
  } catch (error) {
    console.error('Get nutrition data error:', error);
    return res.status(500).json({ message: 'Error retrieving nutrition data' });
  }
};

exports.syncNutritionData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would call the Passio.ai API and store the data in Neo4j
    // For MVP, we'll add mock data
    
    const newData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      meals: [
        {
          name: 'Breakfast',
          calories: Math.floor(Math.random() * 500) + 300,
          macros: {
            protein: Math.floor(Math.random() * 30) + 10,
            carbs: Math.floor(Math.random() * 50) + 30,
            fat: Math.floor(Math.random() * 20) + 5
          }
        },
        {
          name: 'Lunch',
          calories: Math.floor(Math.random() * 700) + 400,
          macros: {
            protein: Math.floor(Math.random() * 40) + 20,
            carbs: Math.floor(Math.random() * 60) + 40,
            fat: Math.floor(Math.random() * 30) + 10
          }
        }
      ],
      totalCalories: 0,
      totalMacros: {
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };
    
    // Calculate totals
    newData.totalCalories = newData.meals.reduce((sum, meal) => sum + meal.calories, 0);
    newData.totalMacros.protein = newData.meals.reduce((sum, meal) => sum + meal.macros.protein, 0);
    newData.totalMacros.carbs = newData.meals.reduce((sum, meal) => sum + meal.macros.carbs, 0);
    newData.totalMacros.fat = newData.meals.reduce((sum, meal) => sum + meal.macros.fat, 0);
    
    healthData.nutrition.push(newData);
    
    return res.status(200).json({
      message: 'Nutrition data synced successfully',
      data: newData
    });
  } catch (error) {
    console.error('Sync nutrition data error:', error);
    return res.status(500).json({ message: 'Error syncing nutrition data' });
  }
};

exports.logMeal = (req, res) => {
  try {
    const userId = req.userId;
    const { name, calories, macros } = req.body;
    
    // In a real app, we would store this in Neo4j
    // For MVP, we'll add to the latest nutrition entry or create a new one
    
    let nutritionEntry;
    
    if (healthData.nutrition.length === 0) {
      nutritionEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        meals: [],
        totalCalories: 0,
        totalMacros: {
          protein: 0,
          carbs: 0,
          fat: 0
        }
      };
      healthData.nutrition.push(nutritionEntry);
    } else {
      nutritionEntry = healthData.nutrition[healthData.nutrition.length - 1];
    }
    
    // Add the meal
    const meal = {
      name,
      calories,
      macros
    };
    
    nutritionEntry.meals.push(meal);
    
    // Update totals
    nutritionEntry.totalCalories += calories;
    nutritionEntry.totalMacros.protein += macros.protein;
    nutritionEntry.totalMacros.carbs += macros.carbs;
    nutritionEntry.totalMacros.fat += macros.fat;
    
    return res.status(200).json({
      message: 'Meal logged successfully',
      meal,
      nutritionEntry
    });
  } catch (error) {
    console.error('Log meal error:', error);
    return res.status(500).json({ message: 'Error logging meal' });
  }
};

// Fitness data (Strava)
exports.getFitnessData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would retrieve data from Neo4j
    // For MVP, we'll return mock data
    return res.status(200).json({
      data: healthData.fitness
    });
  } catch (error) {
    console.error('Get fitness data error:', error);
    return res.status(500).json({ message: 'Error retrieving fitness data' });
  }
};

exports.syncFitnessData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would call the Strava API and store the data in Neo4j
    // For MVP, we'll add mock data
    
    const activities = ['Run', 'Ride', 'Swim', 'Walk', 'Hike'];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const newData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      activity_type: randomActivity,
      duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      distance: Math.floor(Math.random() * 15) + 2, // 2-17 km
      calories: Math.floor(Math.random() * 800) + 200,
      metrics: {
        avg_speed: Math.random() * 20 + 5,
        max_speed: Math.random() * 30 + 10,
        elevation_gain: Math.floor(Math.random() * 500)
      }
    };
    
    healthData.fitness.push(newData);
    
    return res.status(200).json({
      message: 'Fitness data synced successfully',
      data: newData
    });
  } catch (error) {
    console.error('Sync fitness data error:', error);
    return res.status(500).json({ message: 'Error syncing fitness data' });
  }
};

// Dashboard data (aggregated from all sources)
exports.getDashboardData = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would query Neo4j for aggregated data
    // For MVP, we'll return mock aggregated data
    
    // Get the latest data from each category
    const mentalData = healthData.mental.length > 0 ? healthData.mental[healthData.mental.length - 1] : null;
    const sleepData = healthData.sleep.length > 0 ? healthData.sleep[healthData.sleep.length - 1] : null;
    const nutritionData = healthData.nutrition.length > 0 ? healthData.nutrition[healthData.nutrition.length - 1] : null;
    const fitnessData = healthData.fitness.length > 0 ? healthData.fitness[healthData.fitness.length - 1] : null;
    
    return res.status(200).json({
      mental: mentalData,
      sleep: sleepData,
      nutrition: nutritionData,
      fitness: fitnessData,
      overall_wellness_score: Math.floor(Math.random() * 100)
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    return res.status(500).json({ message: 'Error retrieving dashboard data' });
  }
};

// Health insights (correlations between different health domains)
exports.getHealthInsights = (req, res) => {
  try {
    const userId = req.userId;
    
    // In a real app, we would query Neo4j for correlations between different health domains
    // For MVP, we'll return mock insights
    
    return res.status(200).json({
      insights: [
        {
          type: 'correlation',
          domains: ['sleep', 'mental'],
          strength: 0.75,
          description: 'Your mental health score tends to be higher on days following good sleep.'
        },
        {
          type: 'correlation',
          domains: ['fitness', 'sleep'],
          strength: 0.65,
          description: 'Days with physical activity are associated with better sleep quality.'
        },
        {
          type: 'correlation',
          domains: ['nutrition', 'mental'],
          strength: 0.5,
          description: 'Your mood appears to be better on days with balanced nutrition.'
        }
      ]
    });
  } catch (error) {
    console.error('Get health insights error:', error);
    return res.status(500).json({ message: 'Error retrieving health insights' });
  }
};
