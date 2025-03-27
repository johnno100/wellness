// Test fixtures for health data
export const mentalHealthData = {
  id: 'mental-test-1',
  date: '2025-03-24',
  score: 85,
  stress: 30,
  anxiety: 25,
  mood: 90
};

export const sleepData = {
  id: 'sleep-test-1',
  date: '2025-03-24',
  duration: 480,
  quality: 90,
  deep: 30,
  light: 50,
  rem: 15,
  awake: 5
};

export const nutritionData = {
  id: 'nutrition-test-1',
  date: '2025-03-24',
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
};

export const fitnessData = {
  id: 'fitness-test-1',
  date: '2025-03-24',
  activity_type: 'Run',
  duration: 60,
  distance: 10,
  calories: 500,
  avg_speed: 10,
  max_speed: 15,
  elevation_gain: 100
};

// User data
export const userData = {
  id: 'user-test-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: null
};

// API connections
export const connectionsData = {
  id: 'conn-test-1',
  sahha: true,
  sahhaToken: 'test-sahha-token',
  asleep: true,
  asleepToken: 'test-asleep-token',
  passio: true,
  passioToken: 'test-passio-token',
  strava: true,
  stravaToken: 'test-strava-token',
  stravaRefreshToken: 'test-strava-refresh-token'
};

// Dashboard data
export const dashboardData = {
  mental: {
    latest_score: 85,
    trend: 'stable',
    insights: ['Your mental health has been stable over the past week']
  },
  sleep: {
    latest_quality: 90,
    latest_duration: 480,
    trend: 'improving',
    insights: ['Your sleep quality has improved by 5% this week']
  },
  nutrition: {
    latest_calories: 450,
    trend: 'stable',
    insights: ['Your calorie intake has been consistent']
  },
  fitness: {
    latest_activity: 'Run',
    trend: 'improving',
    insights: ['You\'ve increased your running distance by 2km this week']
  },
  overall_wellness_score: 88
};

// Factory functions to create test data with custom overrides
export function createMentalHealthData(overrides = {}) {
  return { ...mentalHealthData, ...overrides };
}

export function createSleepData(overrides = {}) {
  return { ...sleepData, ...overrides };
}

export function createNutritionData(overrides = {}) {
  return { ...nutritionData, ...overrides };
}

export function createFitnessData(overrides = {}) {
  return { ...fitnessData, ...overrides };
}

export function createUserData(overrides = {}) {
  return { ...userData, ...overrides };
}

export function createConnectionsData(overrides = {}) {
  return { ...connectionsData, ...overrides };
}

export function createDashboardData(overrides = {}) {
  return { 
    ...dashboardData,
    ...overrides,
    mental: { ...dashboardData.mental, ...(overrides.mental || {}) },
    sleep: { ...dashboardData.sleep, ...(overrides.sleep || {}) },
    nutrition: { ...dashboardData.nutrition, ...(overrides.nutrition || {}) },
    fitness: { ...dashboardData.fitness, ...(overrides.fitness || {}) }
  };
}
