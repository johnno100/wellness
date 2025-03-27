# TestContainers Cloud Setup Guide

This guide explains how to set up and use TestContainers Cloud for the Wellness App MVP testing infrastructure.

## Overview

TestContainers Cloud provides a managed environment for running TestContainers tests, eliminating the need to run Docker containers locally. This offers several advantages:

1. No need to install Docker locally
2. Faster test execution
3. Parallel test execution with Turbo mode
4. Consistent test environment across development and CI

## Local Development Setup

### 1. Install TestContainers Desktop

1. Download TestContainers Desktop from [https://testcontainers.com/desktop/](https://testcontainers.com/desktop/)
2. Install and launch the application
3. Sign up for a TestContainers Cloud account if you don't have one
4. Log in to TestContainers Cloud through the desktop application

### 2. Enable TestContainers Cloud

In the TestContainers Desktop application:

1. Select "Run with TestContainers Cloud"
2. Enable "Turbo mode" for parallel test execution
3. Set memory limit to 1GB (or adjust based on your needs)

### 3. Run Tests Locally

With TestContainers Desktop running:

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

The tests will automatically use TestContainers Cloud instead of local Docker.

## CI/CD Integration

### 1. Set Up GitHub Actions

The repository is already configured with GitHub Actions workflows in `.github/workflows/test-and-deploy.yml`.

### 2. Configure Secrets

Add the following secrets to your GitHub repository:

- `TC_CLOUD_TOKEN`: Your TestContainers Cloud token
- `CODECOV_TOKEN`: Token for code coverage reporting (optional)
- `DEPLOY_TOKEN`: Token for deployment (if using automated deployment)

### 3. TestContainers Cloud Agent Configuration

The GitHub Actions workflow automatically installs and configures the TestContainers Cloud agent with:

```bash
curl -L -o tc-cloud-agent.sh https://app.testcontainers.cloud/download/testcontainers-cloud-agent.sh
sh tc-cloud-agent.sh --max-concurrency=4
```

The `--max-concurrency=4` flag enables Turbo mode with a maximum of 4 concurrent test environments.

## Configuration Files

### testcontainers.config.js

This file configures TestContainers behavior:

```javascript
// Project identification
projectTag: 'wellness-app-mvp'

// Resource configuration
resources:
  memoryLimit: 1g
  cpuLimit: 2

// Turbo mode configuration for parallel testing
turboMode:
  enabled: true
  maxConcurrency: 4
```

### .env.test

Environment variables for testing, including TestContainers Cloud configuration:

```
# TestContainers Cloud configuration
TC_CLOUD_TOKEN=${TC_CLOUD_TOKEN}
TC_CLOUD_CONCURRENCY=4
```

## Best Practices

1. **Tag Test Sessions**: Use the `projectTag` property to identify test sessions in TestContainers Cloud dashboard

2. **Optimize Resource Usage**: Set appropriate memory and CPU limits based on your tests' needs

3. **Terminate Workers Eagerly**: Enable `terminateEagerly: true` to release resources as soon as tests complete

4. **Monitor Usage**: Regularly check the TestContainers Cloud dashboard to monitor resource usage and test performance

5. **Local Development**: Use TestContainers Desktop for local development to ensure consistency with CI environment

## Troubleshooting

### Tests Not Using TestContainers Cloud

1. Verify TestContainers Desktop is running and "Run with TestContainers Cloud" is enabled
2. Check that `TC_CLOUD_TOKEN` is correctly set in environment variables
3. Look for error messages in the TestContainers Desktop logs

### Slow Test Execution

1. Enable Turbo mode for parallel test execution
2. Increase `maxConcurrency` value if you have available quota
3. Optimize test setup and teardown to minimize container startup time

### CI Pipeline Failures

1. Verify `TC_CLOUD_TOKEN` secret is correctly set in GitHub repository
2. Check GitHub Actions logs for TestContainers Cloud agent errors
3. Ensure your TestContainers Cloud subscription has sufficient quota for CI usage

## Additional Resources

- [TestContainers Cloud Documentation](https://testcontainers.com/cloud/docs/)
- [TestContainers for Node.js](https://node.testcontainers.org/)
- [Neo4j Module Documentation](https://node.testcontainers.org/modules/neo4j/)
