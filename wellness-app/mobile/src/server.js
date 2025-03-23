// Server entry point
require('dotenv').config();
const app = require('./app');
const neo4j = require('./config/neo4j.config');
const healthService = require('./services/health.service');

// Initialize database connection
const initializeApp = async () => {
  try {
    // Verify Neo4j connection
    const connected = await neo4j.verifyConnection();
    if (!connected) {
      console.error('Failed to connect to Neo4j database');
      process.exit(1);
    }
    
    // Initialize database with constraints and indexes
    await healthService.initializeDatabase();
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Wellness App server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await neo4j.closeDriver();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Initialize application
initializeApp();
