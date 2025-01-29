import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppConfigType {
  isSplashScreen: boolean;
}

const DEFAULT_CONFIG: AppConfigType = {
  isSplashScreen: true,
};

class AppConfig {
  private static instance: AppConfig;
  private config: AppConfigType = DEFAULT_CONFIG;

  private constructor() {}

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  async initialize() {
    try {
      const storedConfig = await AsyncStorage.getItem('appConfig');
      if (storedConfig) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(storedConfig) };
      }
    } catch (error) {
      console.error('Error loading app config:', error);
    }
  }

  async setIsSplashScreen(value: boolean) {
    this.config.isSplashScreen = value;
    await this.saveConfig();
  }

  getIsSplashScreen(): boolean {
    return this.config.isSplashScreen;
  }

  private async saveConfig() {
    try {
      await AsyncStorage.setItem('appConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Error saving app config:', error);
    }
  }
}

export default AppConfig.getInstance();
