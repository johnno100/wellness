export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface MentalHealthState {
  mentalHealthScore: string | null;
  stressLevel: number | null;
  anxietyLevel: number | null;
  moodLevel: number | null;
  moodHistory: MoodEntry[] | null;
  loading: boolean;
  error: string | null;
}

export interface MoodEntry {
  date: string;
  mood: string;
  score: number;
}

export interface SleepState {
  sleepScore: string | null;
  sleepDuration: number | null;
  deepSleepDuration: number | null;
  sleepConsistency: number | null;
  sleepHistory: SleepEntry[] | null;
  loading: boolean;
  error: string | null;
}

export interface SleepEntry {
  date: string;
  duration: number;
  quality: number;
  deepSleep: number;
}

export interface NutritionState {
  dailyCalories: string | null;
  dailyNutrients: {
    protein: string | null;
    carbs: string | null;
    fat: string | null;
    fiber: string | null;
  } | null;
  waterIntake: number | null;
  mealHistory: MealEntry[] | null;
  loading: boolean;
  error: string | null;
}

export interface MealEntry {
  id: number;
  time: string;
  items: string[];
  calories: number;
  image: string;
}

export interface FitnessState {
  dailySteps: string | null;
  dailyDistance: string | null;
  dailyCalories: string | null;
  dailyActiveMinutes: string | null;
  weeklyDistance: string | null;
  weeklyActiveDays: string | null;
  weeklyCalories: string | null;
  activityHistory: ActivityEntry[] | null;
  loading: boolean;
  error: string | null;
}

export interface ActivityEntry {
  id: number;
  date: string;
  type: string;
  distance: number;
  duration: string;
  calories: number;
}

export interface RootState {
  auth: AuthState;
  mentalHealth: MentalHealthState;
  sleep: SleepState;
  nutrition: NutritionState;
  fitness: FitnessState;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SahhaApiConfig {
  apiKey: string;
  userId: string;
}

export interface StravaApiConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AsleepApiConfig {
  apiKey: string;
  userId: string;
}

export interface PassioApiConfig {
  apiKey: string;
  userId: string;
}
