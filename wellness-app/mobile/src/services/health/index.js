// src/services/health/index.js
import apiClient from '../api/apiClient';
import sahhaService from './sahhaService';
import asleepService from './asleepService';
import passioService from './passioService';
import stravaService from './stravaService';
import { logger } from '../../utils/logger';

class HealthService {
  async getDashboardData() {
    try {
      const response = await apiClient.get('/health/dashboard');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  async syncMentalHealthData() {
    try {
      // Fetch data from Sahha
      const sahhaData = await sahhaService.fetchLatestData();
      
      // Send to our backend
      const response = await apiClient.post('/health/mental/sync', {
        source: 'sahha',
        data: sahhaData
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to sync mental health data:', error);
      throw error;
    }
  }

  async syncSleepData() {
    try {
      // Fetch data from Asleep
      const sleepData = await asleepService.fetchLatestData();
      
      // Send to our backend
      const response = await apiClient.post('/health/sleep/sync', {
        source: 'asleep',
        data: sleepData
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to sync sleep data:', error);
      throw error;
    }
  }

  async syncNutritionData() {
    try {
      // Fetch data from Passio
      const nutritionData = await passioService.fetchLatestData();
      
      // Send to our backend
      const response = await apiClient.post('/health/nutrition/sync', {
        source: 'passio',
        data: nutritionData
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to sync nutrition data:', error);
      throw error;
    }
  }

  async syncFitnessData() {
    try {
      // Fetch data from Strava
      const fitnessData = await stravaService.fetchLatestData();
      
      // Send to our backend
      const response = await apiClient.post('/health/fitness/sync', {
        source: 'strava',
        data: fitnessData
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to sync fitness data:', error);
      throw error;
    }
  }
}

export const healthService = new HealthService();
export default healthService;
