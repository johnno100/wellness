# TestContainers Configuration for Node.js
# This file configures TestContainers to use TestContainers Cloud when available

# Project identification
projectTag: wellness-app-mvp

# Resource configuration
resources:
  memoryLimit: 1g
  cpuLimit: 2

# Turbo mode configuration for parallel testing
turboMode:
  enabled: true
  maxConcurrency: 4

# Container cleanup
cleanup:
  removeVolumes: true
  terminateEagerly: true

# Docker configuration
docker:
  # Use TestContainers Cloud when available
  useCloud: true
  # Fall back to local Docker when Cloud is not available
  fallbackToLocal: true
