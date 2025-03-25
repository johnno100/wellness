/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import logger from './src/logger'; // Import the logger

// Example usage of Winston logger
logger.info('App is starting...');
logger.error('An error occurred!');

// Register the app
AppRegistry.registerComponent(appName, () => App);
