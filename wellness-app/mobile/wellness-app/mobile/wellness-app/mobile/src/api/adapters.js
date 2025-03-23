// API adapters for integrating with external health services
// This file contains adapters for sahha.ai, asleep.ai, passio.ai, and Strava

const axios = require('axios');

// Sahha.ai API adapter
class SahhaAdapter {
  constructor(config) {
    this.apiKey = config.apiKey || process.env.SAHHA_API_KEY;
    this.apiUrl = config.apiUrl || process.env.SAHHA_API_URL || 'https://api.sahha.ai';
  }

  async authenticate() {
    try {
      const response = await axios.post(
        `${this.apiUrl}/auth/token`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
          }
        }
      );
      
      this.token = response.data.token;
      return this.token;
    } catch (error) {
      console.error('Sahha authentication error:', error);
      throw new Error('Failed to authenticate with Sahha API');
    }
  }

  async getHealthScores(userId, startDate, endDate) {
    try {
      if (!this.token) {
        await this.authenticate();
      }
      
      const response = await axios.get(
        `${this.apiUrl}/health/scores`,
        {
          params: {
            userId,
            startDate,
            endDate
          },
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'x-api-key': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Sahha getHealthScores error:', error);
      throw new Error('Failed to get health scores from Sahha API');
    }
  }

  async getBiomarkers(userId, startDate, endDate) {
    try {
      if (!this.token) {
        await this.authenticate();
      }
      
      const response = await axios.get(
        `${this.apiUrl}/health/biomarkers`,
        {
          params: {
            userId,
            startDate,
            endDate
          },
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'x-api-key': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Sahha getBiomarkers error:', error);
      throw new Error('Failed to get biomarkers from Sahha API');
    }
  }

  // Mock method for MVP demonstration
  async getMockData() {
    return {
      userId: 'user123',
      date: new Date().toISOString(),
      score: Math.floor(Math.random() * 100),
      factors: {
        stress: Math.floor(Math.random() * 100),
        anxiety: Math.floor(Math.random() * 100),
        mood: Math.floor(Math.random() * 100)
      }
    };
  }
}

// Asleep.ai API adapter
class AsleepAdapter {
  constructor(config) {
    this.apiKey = config.apiKey || process.env.ASLEEP_API_KEY;
    this.apiUrl = config.apiUrl || process.env.ASLEEP_API_URL || 'https://api.asleep.ai';
  }

  async getSleepData(userId, date) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/sleep/analysis`,
        {
          params: {
            userId,
            date
          },
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Asleep getSleepData error:', error);
      throw new Error('Failed to get sleep data from Asleep API');
    }
  }

  async getSleepTrends(userId, startDate, endDate) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/sleep/trends`,
        {
          params: {
            userId,
            startDate,
            endDate
          },
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Asleep getSleepTrends error:', error);
      throw new Error('Failed to get sleep trends from Asleep API');
    }
  }

  // Mock method for MVP demonstration
  async getMockData() {
    return {
      userId: 'user123',
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
  }
}

// Passio.ai API adapter
class PassioAdapter {
  constructor(config) {
    this.apiKey = config.apiKey || process.env.PASSIO_API_KEY;
    this.apiUrl = config.apiUrl || process.env.PASSIO_API_URL || 'https://api.passio.ai';
  }

  async recognizeFood(imageData) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/nutrition/recognize`,
        {
          image: imageData
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Passio recognizeFood error:', error);
      throw new Error('Failed to recognize food with Passio API');
    }
  }

  async searchFood(query) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/nutrition/search`,
        {
          params: {
            query
          },
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Passio searchFood error:', error);
      throw new Error('Failed to search food with Passio API');
    }
  }

  async getNutritionData(userId, date) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/nutrition/daily`,
        {
          params: {
            userId,
            date
          },
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Passio getNutritionData error:', error);
      throw new Error('Failed to get nutrition data from Passio API');
    }
  }

  // Mock method for MVP demonstration
  async getMockData() {
    return {
      userId: 'user123',
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
  }
}

// Strava API adapter
class StravaAdapter {
  constructor(config) {
    this.clientId = config.clientId || process.env.STRAVA_CLIENT_ID;
    this.clientSecret = config.clientSecret || process.env.STRAVA_CLIENT_SECRET;
    this.redirectUri = config.redirectUri || process.env.STRAVA_REDIRECT_URI;
    this.apiUrl = config.apiUrl || process.env.STRAVA_API_URL || 'https://www.strava.com/api/v3';
  }

  getAuthorizationUrl(scope = 'read,activity:read_all,profile:read_all') {
    return `https://www.strava.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=${scope}`;
  }

  async exchangeToken(code) {
    try {
      const response = await axios.post(
        'https://www.strava.com/oauth/token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code'
        }
      );
      
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: response.data.expires_at,
        athlete: response.data.athlete
      };
    } catch (error) {
      console.error('Strava exchangeToken error:', error);
      throw new Error('Failed to exchange token with Strava API');
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(
        'https://www.strava.com/oauth/token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        }
      );
      
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresAt: response.data.expires_at
      };
    } catch (error) {
      console.error('Strava refreshToken error:', error);
      throw new Error('Failed to refresh token with Strava API');
    }
  }

  async getAthleteProfile(accessToken) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/athlete`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Strava getAthleteProfile error:', error);
      throw new Error('Failed to get athlete profile from Strava API');
    }
  }

  async getActivities(accessToken, params = {}) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/athlete/activities`,
        {
          params,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Strava getActivities error:', error);
      throw new Error('Failed to get activities from Strava API');
    }
  }

  async getActivity(accessToken, activityId) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/activities/${activityId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Strava getActivity error:', error);
      throw new Error('Failed to get activity from Strava API');
    }
  }

  // Mock method for MVP demonstration
  async getMockData() {
    const activities = ['Run', 'Ride', 'Swim', 'Walk', 'Hike'];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    return {
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
  }
}

// Factory to create API adapters
class ApiAdapterFactory {
  static createSahhaAdapter(config = {}) {
    return new SahhaAdapter(config);
  }
  
  static createAsleepAdapter(config = {}) {
    return new AsleepAdapter(config);
  }
  
  static createPassioAdapter(config = {}) {
    return new PassioAdapter(config);
  }
  
  static createStravaAdapter(config = {}) {
    return new StravaAdapter(config);
  }
}

module.exports = ApiAdapterFactory;
