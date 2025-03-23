import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

const { AsleepModule } = NativeModules;
const AsleepEventEmitter = new NativeEventEmitter(AsleepModule);

export class AsleepApiAdapter {
  private static instance: AsleepApiAdapter;
  private isInitialized = false;
  private listeners: any[] = [];

  private constructor() {}

  public static getInstance(): AsleepApiAdapter {
    if (!AsleepApiAdapter.instance) {
      AsleepApiAdapter.instance = new AsleepApiAdapter();
    }
    return AsleepApiAdapter.instance;
  }

  public async initialize(apiKey: string, userId: string): Promise<boolean> {
    try {
      await AsleepModule.initialize(apiKey, userId);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Asleep SDK:', error);
      return false;
    }
  }

  public async startSleepTracking(): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Asleep SDK not initialized');
    }

    try {
      await AsleepModule.startSleepTracking();
      return true;
    } catch (error) {
      console.error('Failed to start sleep tracking:', error);
      return false;
    }
  }

  public async stopSleepTracking(): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Asleep SDK not initialized');
    }

    try {
      await AsleepModule.stopSleepTracking();
      return true;
    } catch (error) {
      console.error('Failed to stop sleep tracking:', error);
      return false;
    }
  }

  public async getSleepSessions(page: number = 1, perPage: number = 10): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Asleep SDK not initialized');
    }

    try {
      const sessions = await AsleepModule.getSleepSessions(page, perPage);
      return sessions;
    } catch (error) {
      console.error('Failed to get sleep sessions:', error);
      throw error;
    }
  }

  public async getSleepSession(sessionId: string): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Asleep SDK not initialized');
    }

    try {
      const session = await AsleepModule.getSleepSession(sessionId);
      return session;
    } catch (error) {
      console.error(`Failed to get sleep session ${sessionId}:`, error);
      throw error;
    }
  }

  public addSessionCompleteListener(callback: (data: any) => void): void {
    const listener = AsleepEventEmitter.addListener('SESSION_COMPLETE', callback);
    this.listeners.push(listener);
  }

  public addInferenceCompleteListener(callback: (data: any) => void): void {
    const listener = AsleepEventEmitter.addListener('INFERENCE_COMPLETE', callback);
    this.listeners.push(listener);
  }

  public removeAllListeners(): void {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }
}

export default AsleepApiAdapter.getInstance();
