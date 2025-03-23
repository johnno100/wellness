import { PassioSDK } from 'passio-nutrition-ai-rn-sdk';

export class PassioApiAdapter {
  private static instance: PassioApiAdapter;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): PassioApiAdapter {
    if (!PassioApiAdapter.instance) {
      PassioApiAdapter.instance = new PassioApiAdapter();
    }
    return PassioApiAdapter.instance;
  }

  public async initialize(apiKey: string): Promise<boolean> {
    try {
      await PassioSDK.initialize(apiKey);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Passio SDK:', error);
      return false;
    }
  }

  public async searchForFood(query: string): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Passio SDK not initialized');
    }

    try {
      const results = await PassioSDK.searchForFoodSemantic(query);
      return results;
    } catch (error) {
      console.error('Failed to search for food:', error);
      throw error;
    }
  }

  public async recognizeImageRemote(base64Image: string): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Passio SDK not initialized');
    }

    try {
      const results = await PassioSDK.recognizeImageRemote(base64Image);
      return results;
    } catch (error) {
      console.error('Failed to recognize image:', error);
      throw error;
    }
  }

  public async recognizeSpeechRemote(audioBase64: string): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Passio SDK not initialized');
    }

    try {
      const results = await PassioSDK.recognizeSpeechRemote(audioBase64);
      return results;
    } catch (error) {
      console.error('Failed to recognize speech:', error);
      throw error;
    }
  }

  public async updateLanguage(localeCode: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Passio SDK not initialized');
    }

    try {
      await PassioSDK.updateLanguage(localeCode);
      return true;
    } catch (error) {
      console.error('Failed to update language:', error);
      return false;
    }
  }
}

export default PassioApiAdapter.getInstance();
