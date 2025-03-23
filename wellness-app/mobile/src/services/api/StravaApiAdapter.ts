import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export class StravaApiAdapter {
  private static instance: StravaApiAdapter;
  private clientId: string = '';
  private clientSecret: string = '';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  private constructor() {}

  public static getInstance(): StravaApiAdapter {
    if (!StravaApiAdapter.instance) {
      StravaApiAdapter.instance = new StravaApiAdapter();
    }
    return StravaApiAdapter.instance;
  }

  public initialize(clientId: string, clientSecret: string): void {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.loadTokens();
  }

  private async loadTokens(): Promise<void> {
    try {
      const tokens = await AsyncStorage.getItem('strava_tokens');
      if (tokens) {
        const { accessToken, refreshToken, expiresAt } = JSON.parse(tokens);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
      }
    } catch (error) {
      console.error('Failed to load Strava tokens:', error);
    }
  }

  private async saveTokens(): Promise<void> {
    try {
      const tokens = JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt,
      });
      await AsyncStorage.setItem('strava_tokens', tokens);
    } catch (error) {
      console.error('Failed to save Strava tokens:', error);
    }
  }

  public getAuthUrl(redirectUri: string, scope: string): string {
    return `${STRAVA_AUTH_URL}?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(scope)}`;
  }

  public async exchangeCodeForToken(code: string): Promise<boolean> {
    try {
      const response = await axios.post(STRAVA_TOKEN_URL, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresAt = response.data.expires_at;

      await this.saveTokens();
      return true;
    } catch (error) {
      console.error('Failed to exchange code for token:', error);
      return false;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await axios.post(STRAVA_TOKEN_URL, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresAt = response.data.expires_at;

      await this.saveTokens();
      return true;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return false;
    }
  }

  private async ensureValidToken(): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);
    if (!this.accessToken || now >= this.expiresAt) {
      return await this.refreshAccessToken();
    }
    return true;
  }

  public async getAthleteActivities(page: number = 1, perPage: number = 30): Promise<any> {
    if (!(await this.ensureValidToken())) {
      throw new Error('Failed to ensure valid token');
    }

    try {
      const response = await axios.get(`${STRAVA_API_URL}/athlete/activities`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          page,
          per_page: perPage,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get athlete activities:', error);
      throw error;
    }
  }

  public async getActivity(activityId: string): Promise<any> {
    if (!(await this.ensureValidToken())) {
      throw new Error('Failed to ensure valid token');
    }

    try {
      const response = await axios.get(`${STRAVA_API_URL}/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to get activity ${activityId}:`, error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  public logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
    AsyncStorage.removeItem('strava_tokens');
  }
}

export default StravaApiAdapter.getInstance();
