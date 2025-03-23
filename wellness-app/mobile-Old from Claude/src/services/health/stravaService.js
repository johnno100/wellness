// src/services/health/stravaService.js
import axios from 'axios';
import Config from 'react-native-config';
import { storage } from '../../utils/storage';
import { logger } from '../../utils/logger';

const STRAVA_BASE_URL = 'https://www.strava.com/api/v3';

class StravaService {
  constructor() {
    this.client = axios.create({
      baseURL: STRAVA_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async authorize(code) {
    try {
      const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: Config.STRAVA_CLIENT_ID,
        client_secret: Config.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      });
      
      const { access_token, refresh_token, expires_at } = response.data;
      
      // Save tokens to local storage
      await storage.setItem('strava_tokens', JSON.stringify({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expires_at,
      }));
      
      return response.data;
    } catch (error) {
      logger.error('Strava authorization failed:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const tokensStr = await storage.getItem('strava_tokens');
      if (!tokensStr) {
        throw new Error('No Strava tokens available');
      }
      
      const tokens = JSON.parse(tokensStr);
      
      const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: Config.STRAVA_CLIENT_ID,
        client_secret: Config.STRAVA_CLIENT_SECRET,
        refresh_token: tokens.refreshToken,
        grant_type: 'refresh_token',
      });
      
      const { access_token, refresh_token, expires_at } = response.data;
      
      // Save new tokens
      await storage.setItem('strava_tokens', JSON.stringify({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expires_at,
      }));
      
      return access_token;
    } catch (error) {
      logger.error('Strava token refresh failed:', error);
      throw error;
    }
  }

  async getAccessToken() {
    try {
      const tokensStr = await storage.getItem('strava_tokens');
      if (!tokensStr) {
        return null;
      }
      
      const tokens = JSON.parse(tokensStr);
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (tokens.expiresAt <= now) {
        // Token expired, refresh it
        return await this.refreshToken();
      }
      
      return tokens.accessToken;
    } catch (error) {
      logger.error('Failed to get Strava access token:', error);
      return null;
    }
  }

  async fetchActivities(after = null, page = 1, perPage = 30) {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('Not authorized with Strava');
      }
      
      const params = {
        page,
        per_page: perPage,
      };
      
      if (after) {
        params.after = after;
      }
      
      const response = await this.client.get('/athlete/activities', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params,
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch Strava activities:', error);
      throw error;
    }
  }

  async fetchLatestData() {
    try {
      // Get activities from last 7 days
      const oneWeekAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
      const activities = await this.fetchActivities(oneWeekAgo);
      
      // Process activities into our format
      const processedData = activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        name: activity.name,
        distance: activity.distance,
        movingTime: activity.moving_time,
        elapsedTime: activity.elapsed_time,
        totalElevationGain: activity.total_elevation_gain,
        startDate: activity.start_date,
        calories: activity.calories,
        averageSpeed: activity.average_speed,
        maxSpeed: activity.max_speed,
        hasHeartRate: activity.has_heartrate,
        averageHeartRate: activity.average_heartrate,
        maxHeartRate: activity.max_heartrate,
      }));
      
      return processedData;
    } catch (error) {
      logger.error('Failed to fetch latest Strava data:', error);
      throw error;
    }
  }
}

export const stravaService = new StravaService();
export default stravaService;

