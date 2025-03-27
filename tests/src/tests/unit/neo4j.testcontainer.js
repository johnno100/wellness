/**
 * Neo4j TestContainer setup for unit tests
 * This file provides utility functions for setting up and tearing down Neo4j containers
 */

const { Neo4jContainer } = require('@testcontainers/neo4j');
const neo4j = require('neo4j-driver');

/**
 * Sets up a Neo4j container for testing
 * @returns {Promise<{container: Neo4jContainer, driver: Driver, session: Session}>}
 */
async function setupNeo4jContainer() {
  // Start Neo4j container with custom configuration
  const container = await new Neo4jContainer()
    .withPassword('testpassword')
    .withNeo4jConfig('dbms.memory.heap.max_size', '512m')
    .start();
  
  // Create Neo4j driver
  const driver = neo4j.driver(
    container.getBoltUri(),
    neo4j.auth.basic(container.getUsername(), container.getPassword())
  );
  
  // Create session
  const session = driver.session();
  
  return { container, driver, session };
}

/**
 * Tears down Neo4j container and closes connections
 * @param {Neo4jContainer} container - The Neo4j container to stop
 * @param {Driver} driver - The Neo4j driver to close
 * @param {Session} session - The Neo4j session to close
 * @returns {Promise<void>}
 */
async function teardownNeo4jContainer({ container, driver, session }) {
  // Close session and driver
  await session.close();
  await driver.close();
  
  // Stop container
  await container.stop();
}

/**
 * Clears all data from the Neo4j database
 * @param {Session} session - The Neo4j session
 * @returns {Promise<void>}
 */
async function clearDatabase(session) {
  await session.run('MATCH (n) DETACH DELETE n');
}

module.exports = {
  setupNeo4jContainer,
  teardownNeo4jContainer,
  clearDatabase
};
