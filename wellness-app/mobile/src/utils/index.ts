import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for persisting data
 */
export const storage = {
  /**
   * Store data in persistent storage
   * @param key Storage key
   * @param value Value to store
   */
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  /**
   * Retrieve data from persistent storage
   * @param key Storage key
   * @returns The stored value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  /**
   * Remove data from persistent storage
   * @param key Storage key
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  /**
   * Clear all data from persistent storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

/**
 * Format a date string to a human-readable format
 * @param dateString Date string in ISO format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format a number as a percentage
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format a number with commas for thousands
 * @param value Number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Check if the app is running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if the app is running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Delay execution for a specified time
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Validate an email address
 * @param email Email address to validate
 * @returns Whether the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password
 * @param password Password to validate
 * @returns Whether the password is valid (min 8 chars, with number and letter)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
};

/**
 * Generate a random ID
 * @returns Random ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Truncate a string to a maximum length
 * @param str String to truncate
 * @param maxLength Maximum length
 * @returns Truncated string
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Calculate BMI (Body Mass Index)
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @returns BMI value
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

/**
 * Get BMI category
 * @param bmi BMI value
 * @returns BMI category description
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Calculate calories burned during activity
 * @param weightKg Weight in kilograms
 * @param durationMinutes Duration in minutes
 * @param metValue MET value for the activity
 * @returns Calories burned
 */
export const calculateCaloriesBurned = (
  weightKg: number, 
  durationMinutes: number, 
  metValue: number
): number => {
  return (metValue * 3.5 * weightKg / 200) * durationMinutes;
};

/**
 * Convert kilometers to miles
 * @param km Distance in kilometers
 * @returns Distance in miles
 */
export const kmToMiles = (km: number): number => {
  return km * 0.621371;
};

/**
 * Convert miles to kilometers
 * @param miles Distance in miles
 * @returns Distance in kilometers
 */
export const milesToKm = (miles: number): number => {
  return miles / 0.621371;
};

/**
 * Format duration in minutes to hours and minutes
 * @param minutes Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

/**
 * Get a color based on a value's position in a range
 * @param value Current value
 * @param min Minimum value in range
 * @param max Maximum value in range
 * @param lowColor Color for low values
 * @param midColor Color for middle values
 * @param highColor Color for high values
 * @returns Color string
 */
export const getColorForValue = (
  value: number,
  min: number,
  max: number,
  lowColor = '#FF5252',
  midColor = '#FFD740',
  highColor = '#4CAF50'
): string => {
  const range = max - min;
  const position = (value - min) / range;
  
  if (position < 0.33) return lowColor;
  if (position < 0.66) return midColor;
  return highColor;
};
