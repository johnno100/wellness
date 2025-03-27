# Wellness App MVP Architecture Design

## Overview

This document outlines the architecture for the Wellness App MVP, which integrates with sahha.ai, asleep.ai, passio.ai, and Strava APIs. The architecture follows 12Factor principles and uses Neo4j as the database for storing and relating data from different health domains.

## 12Factor Compliance

### 1. Codebase
- Single codebase tracked in Git
- Deployable to development, staging, and production environments
- Shared code factored into libraries

### 2. Dependencies
- Explicitly declare all dependencies in package.json
- Use npm/yarn for dependency management
- No reliance on implicit system-wide packages

### 3. Configuration
- Store configuration in environment variables
- Separate config from code
- Use .env files for local development (not committed to repo)
- Include API keys, database URLs, and other environment-specific settings

### 4. Backing Services
- Treat all external services (APIs, databases) as attached resources
- No distinction in code between local and third-party services
- Resources accessible via URLs stored in configuration

### 5. Build, Release, Run
- Strictly separate build, release, and run stages
- Build: Convert code to executable bundle
- Release: Combine build with config
- Run: Execute the app in the execution environment

### 6. Processes
- Execute the app as stateless processes
- Store persistent data in backing services (Neo4j)
- No local storage of state between requests

### 7. Port Binding
- Export services via port binding
- App is self-contained and doesn't rely on runtime injection of webserver
- Listen on configured port

### 8. Concurrency
- Scale via the process model
- Design for horizontal scaling

### 9. Disposability
- Fast startup and graceful shutdown
- Robust against sudden termination
- Handle API rate limits and connection issues gracefully

### 10. Dev/Prod Parity
- Keep development, staging, and production as similar as possible
- Use the same backing services in all environments
- Use containerization to ensure consistency

### 11. Logs
- Treat logs as event streams
- Write logs to stdout
- Use logging service for aggregation and analysis

### 12. Admin Processes
- Run admin/management tasks as one-off processes
- Use the same codebase and configuration

## System Architecture

### Layered Architecture

The application follows a layered architecture approach as outlined in the requirements:

1. **Data Layer**
   - Responsible for aggregating information from APIs and user inputs
   - Handles data synchronization and transformation
   - Stores data in Neo4j with appropriate relationships

2. **Assessment Layer**
   - Analyzes data from integrated APIs
   - Provides insights based on collected data
   - Evaluates sleep, nutrition, and physical activity metrics

3. **Conversational Layer** (minimal for MVP)
   - Provides recommendations based on health data
   - Architecture supports future expansion

4. **Orchestration Layer**
   - Manages data flow between APIs and database
   - Handles authentication and authorization
   - Implements error handling and retry mechanisms

5. **Interface Layer**
   - Presents unified view of data from all APIs
   - Supports visual UI with future expansion to other modalities

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Wellness App MVP                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Interface Layer                          │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │  Dashboard    │  │  User Profile │  │  Settings     │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Orchestration Layer                        │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ Auth Manager  │  │ API Manager   │  │ Error Handler │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Assessment Layer                          │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ Sleep Analysis│  │Nutrition Eval.│  │Fitness Analysis        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                              │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ API Adapters  │  │ Data Models   │  │ Neo4j Service │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐     │
│  │ Sahha.ai  │  │ Asleep.ai │  │ Passio.ai │  │  Strava   │     │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## API Integration Architecture

### API Adapters

Each external API will have a dedicated adapter that handles:
- Authentication
- Data retrieval
- Data transformation
- Error handling
- Rate limiting

```javascript
// Example adapter pattern
class SahhaAdapter {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  async authenticate() {
    // Authentication logic
  }

  async getHealthScores(userId) {
    // API call to retrieve health scores
  }

  // Other methods for specific API endpoints
}
```

### Authentication Strategy

- **Sahha.ai**: JWT Bearer authentication with account and profile tokens
- **Asleep.ai**: API Key authentication
- **Passio.ai**: API Key authentication
- **Strava**: OAuth2 with refresh token flow

The app will store tokens securely and handle refresh flows automatically.

## Neo4j Database Schema

Neo4j is used to store and relate data from different health domains. The graph database is ideal for this use case as it allows for complex relationships between different types of health data.

### Core Nodes

1. **User**
   - Properties: id, name, email, created_at, updated_at
   - Relationships: HAS_MENTAL_HEALTH, HAS_SLEEP, HAS_NUTRITION, HAS_FITNESS

2. **MentalHealth** (from Sahha.ai)
   - Properties: id, date, score, factors
   - Relationships: BELONGS_TO_USER, AFFECTS_SLEEP, AFFECTS_NUTRITION

3. **Sleep** (from Asleep.ai)
   - Properties: id, date, duration, quality, stages
   - Relationships: BELONGS_TO_USER, AFFECTS_MENTAL_HEALTH, AFFECTS_FITNESS

4. **Nutrition** (from Passio.ai)
   - Properties: id, date, meals, calories, macros
   - Relationships: BELONGS_TO_USER, AFFECTS_MENTAL_HEALTH, AFFECTS_FITNESS

5. **Fitness** (from Strava)
   - Properties: id, date, activity_type, duration, distance, calories
   - Relationships: BELONGS_TO_USER, AFFECTS_MENTAL_HEALTH, AFFECTS_SLEEP

### Example Cypher Queries

```cypher
// Create a user
CREATE (u:User {id: 'user123', name: 'John Doe', email: 'john@example.com'})

// Add sleep data and connect to user
MATCH (u:User {id: 'user123'})
CREATE (s:Sleep {id: 'sleep123', date: '2025-03-17', duration: 480, quality: 85})
CREATE (u)-[:HAS_SLEEP]->(s)

// Find correlations between sleep and mental health
MATCH (u:User {id: 'user123'})-[:HAS_SLEEP]->(s:Sleep)
MATCH (u)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
WHERE s.date = m.date
RETURN s, m
```

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: Neo4j
- **Authentication**: JWT
- **API Integration**: Axios for HTTP requests
- **Logging**: Winston
- **Testing**: Jest
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Deployment Strategy

The application will be containerized using Docker to ensure consistency across environments. The deployment will follow these steps:

1. Build Docker image
2. Run tests
3. Push to container registry
4. Deploy to target environment

## Security Considerations

- All API keys and secrets stored in environment variables
- JWT for user authentication
- HTTPS for all communications
- Input validation and sanitization
- Rate limiting for API endpoints
- Regular security audits

## Monitoring and Logging

- Centralized logging with Winston
- Performance monitoring
- Error tracking and alerting
- API usage monitoring to prevent rate limit issues

## Future Expansion

The architecture is designed to be extensible for future features:

- Additional health data sources
- Machine learning for personalized insights
- Voice and other multimodal interfaces
- Social features and sharing
- Advanced analytics and reporting
