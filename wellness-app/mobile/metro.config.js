/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Add any resolver configurations here
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  },
  maxWorkers: 2,
  // Add any additional Metro configurations here
};
