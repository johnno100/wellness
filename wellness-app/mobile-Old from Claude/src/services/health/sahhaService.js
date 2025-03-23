// src/services/health/sahhaService.js
import axios from 'axios';
import Config from 'react-native-config';
import { logger } from '../../utils/logger';

const SAHHA_BASE_URL = 'https://api.sahha.ai/v1';

class SahhaService {
  constructor() {
    this.client = axios.create({
      baseURL: SAHHA_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Config.SAHHA_API_KEY,
      },
    });
  }

  async authenticate(userId) {
    try {
      const response = await this.client.post('/auth/token', {
        userId,
      });
      
      return response.data.token;
    } catch (error) {
      logger.error('Sahha authentication failed:', error);
      throw error;
    }
  }

  async fetchLatestData(userId, days = 7) {
    try {
      // Get token for user
      const token = await this.authenticate(userId);
      
      // Set up date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Format dates
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Get mental health data
      const response = await this.client.get('/analyze/mental-health', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDateStr,
          endDate: endDateStr,
        },
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch Sahha data:', error);
      throw error;
    }
  }
}

export const sahhaService = new SahhaService();
export default sahhaService;