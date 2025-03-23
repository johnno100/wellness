const neo4j = require('neo4j-driver');

// Create a Neo4j driver instance
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'wellness'
  )
);

// Test the connection
const verifyConnection = async () => {
  const session = driver.session();
  try {
    await session.run('RETURN 1');
    console.log('Connected to Neo4j database');
    return true;
  } catch (error) {
    console.error('Failed to connect to Neo4j database:', error);
    return false;
  } finally {
    await session.close();
  }
};

// Get a session
const getSession = () => {
  return driver.session();
};

// Close the driver (for graceful shutdown)
const closeDriver = async () => {
  await driver.close();
  console.log('Neo4j connection closed');
};

module.exports = {
  verifyConnection,
  getSession,
  closeDriver
};
