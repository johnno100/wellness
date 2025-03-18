// src/services/api/apiClient.js
import axios from 'axios';
import Config from 'react-native-config';
import { storage } from '../../utils/storage';
import { logger } from '../../utils/logger';

const BASE_URL = Config.API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const tokensStr = await storage.getItem('tokens');
    
    if (tokensStr) {
      const tokens = JSON.parse(tokensStr);
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    
    return config;
  },
  (error) => {
    logger.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh on 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokensStr = await storage.getItem('tokens');
        if (!tokensStr) {
          throw new Error('No refresh token available');
        }
        
        const tokens = JSON.parse(tokensStr);
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: tokens.refreshToken
        });
        
        const newTokens = refreshResponse.data;
        await storage.setItem('tokens', JSON.stringify(newTokens));
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        logger.error('Token refresh failed:', refreshError);
        // Clear tokens on refresh failure - will force re-login
        await storage.removeItem('tokens');
        // Trigger authentication flow - handle in the auth middleware
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
