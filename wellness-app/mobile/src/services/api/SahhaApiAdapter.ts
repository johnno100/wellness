import { SahhaSDK } from 'sahha-react-native';

export class SahhaApiAdapter {
  private static instance: SahhaApiAdapter;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SahhaApiAdapter {
    if (!SahhaApiAdapter.instance) {
      SahhaApiAdapter.instance = new SahhaApiAdapter();
    }
    return SahhaApiAdapter.instance;
  }

  public async initialize(apiKey: string, userId: string): Promise<boolean> {
    try {
      await SahhaSDK.initialize(apiKey, userId);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Sahha SDK:', error);
      return false;
    }
  }

  public async enableSensors(): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Sahha SDK not initialized');
    }

    try {
      await SahhaSDK.enableSensors();
      return true;
    } catch (error) {
      console.error('Failed to enable sensors:', error);
      return false;
    }
  }

  public async getHealthScores(): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Sahha SDK not initialized');
    }

    try {
      const scores = await SahhaSDK.getHealthScores();
      return scores;
    } catch (error) {
      console.error('Failed to get health scores:', error);
      throw error;
    }
  }

  public async getBiomarkers(): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Sahha SDK not initialized');
    }

    try {
      const biomarkers = await SahhaSDK.getBiomarkers();
      return biomarkers;
    } catch (error) {
      console.error('Failed to get biomarkers:', error);
      throw error;
    }
  }
}

export default SahhaApiAdapter.getInstance();
