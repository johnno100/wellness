# Wellness App MVP

A comprehensive wellness application that integrates with multiple health APIs to provide a unified view of your health data.

## Features

- **Mental Health Tracking**: Integration with sahha.ai for mental health scores and biomarkers
- **Sleep Analysis**: Integration with asleep.ai for sleep quality and stages analysis
- **Nutrition Tracking**: Integration with passio.ai for food recognition and nutrition analysis
- **Fitness Activity**: Integration with Strava for workout and activity tracking
- **Health Insights**: Correlation analysis between different health domains
- **Unified Dashboard**: Single view of all health metrics

## Architecture

The application follows a layered architecture approach:

- **Data Layer**: Neo4j graph database for storing and relating health data
- **API Layer**: Adapters for communicating with external services
- **Service Layer**: Business logic for processing and analyzing health data
- **Orchestration Layer**: Server configuration and request handling

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: Neo4j graph database
- **Containerization**: Docker and Docker Compose
- **Testing**: Jest and Supertest
- **API Integrations**: sahha.ai, asleep.ai, passio.ai, Strava

## 12Factor Compliance

This application follows the [12Factor](https://12factor.net/) methodology:

1. **Codebase**: Single codebase tracked in Git
2. **Dependencies**: Explicitly declared in package.json
3. **Config**: Stored in environment variables
4. **Backing Services**: Treated as attached resources
5. **Build, Release, Run**: Strict separation of build and run stages
6. **Processes**: Stateless processes
7. **Port Binding**: Export services via port binding
8. **Concurrency**: Scale via the process model
9. **Disposability**: Fast startup and graceful shutdown
10. **Dev/Prod Parity**: Keep development and production as similar as possible
11. **Logs**: Treat logs as event streams
12. **Admin Processes**: Run admin tasks as one-off processes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- API keys for sahha.ai, asleep.ai, passio.ai, and Strava

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wellness-app.git
   cd wellness-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your API keys and configuration.

### Running with Docker

1. Start the application and Neo4j database:
   ```
   docker-compose up
   ```

2. The application will be available at http://localhost:3000

### Running Locally

1. Start Neo4j separately:
   ```
   docker-compose up neo4j
   ```

2. Start the application:
   ```
   npm run dev
   ```

3. The application will be available at http://localhost:3000

## API Documentation

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user
- `GET /api/auth/strava`: Redirect to Strava authorization

### User Management

- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `POST /api/users/connect/sahha`: Connect Sahha.ai
- `POST /api/users/connect/asleep`: Connect Asleep.ai
- `POST /api/users/connect/passio`: Connect Passio.ai
- `POST /api/users/connect/strava`: Connect Strava

### Health Data

- `GET /api/health/mental`: Get mental health data
- `POST /api/health/mental/sync`: Sync mental health data
- `GET /api/health/sleep`: Get sleep data
- `POST /api/health/sleep/sync`: Sync sleep data
- `GET /api/health/nutrition`: Get nutrition data
- `POST /api/health/nutrition/sync`: Sync nutrition data
- `POST /api/health/nutrition/meal`: Log a meal
- `GET /api/health/fitness`: Get fitness data
- `POST /api/health/fitness/sync`: Sync fitness data
- `GET /api/health/dashboard`: Get dashboard data
- `GET /api/health/insights`: Get health insights

## Testing

Run the tests:
```
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [sahha.ai](https://sahha.ai) for mental health API
- [asleep.ai](https://asleep.ai) for sleep analysis API
- [passio.ai](https://passio.ai) for nutrition API
- [Strava](https://strava.com) for fitness activity API
- [Neo4j](https://neo4j.com) for graph database
- [12Factor](https://12factor.net) for application architecture guidelines
