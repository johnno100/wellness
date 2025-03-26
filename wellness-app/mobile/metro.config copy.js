// filepath: /workspaces/wellness/wellness-app/mobile/metro.config.js
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('@expo/metro-config');

// Extend the default Expo Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig, // Use Expo's default Metro configuration
  server: {
    port: 8081, // Specify the port for the packager
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Add custom extensions if needed
  },
  maxWorkers: 2, // Adjust workers for performance if needed
};