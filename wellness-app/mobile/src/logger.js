// filepath: /workspaces/wellness/wellness-app/mobile/src/logger.js
import winston from 'winston';

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info', // Default logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
});

export default logger;