# API Integration Documentation

This document provides detailed information about the integration with the four health APIs used in the Wellness app MVP.

## 1. Sahha.ai Integration

### Overview
Sahha.ai provides mental health tracking and analysis through its API. The integration allows the Wellness app to retrieve mental health scores and biomarkers.

### Authentication
- Authentication is done using JWT tokens
- API key is required for initial authentication
- Tokens expire and need to be refreshed

### Endpoints Used
- `/auth/token`: Authenticate and get JWT token
- `/health/scores`: Get mental health scores
- `/health/biomarkers`: Get biomarkers data

### Implementation Details
The integration is implemented using the adapter pattern in `src/api/adapters.js`. The `SahhaAdapter` class handles authentication and data retrieval.

```javascript
// Example usage
const sahhaAdapter = ApiAdapterFactory.createSahhaAdapter({
  apiKey: process.env.SAHHA_API_KEY
});

// Authenticate
await sahhaAdapter.authenticate();

// Get health scores
const scores = await sahhaAdapter.getHealthScores(userId, startDate, endDate);
```

## 2. Asleep.ai Integration

### Overview
Asleep.ai provides sleep analysis through its API. The integration allows the Wellness app to retrieve sleep quality data and sleep stage information.

### Authentication
- API key authentication
- No token refresh required

### Endpoints Used
- `/sleep/analysis`: Get sleep analysis data
- `/sleep/trends`: Get sleep trends over time

### Implementation Details
The integration is implemented using the adapter pattern in `src/api/adapters.js`. The `AsleepAdapter` class handles data retrieval.

```javascript
// Example usage
const asleepAdapter = ApiAdapterFactory.createAsleepAdapter({
  apiKey: process.env.ASLEEP_API_KEY
});

// Get sleep data
const sleepData = await asleepAdapter.getSleepData(userId, date);
```

## 3. Passio.ai Integration

### Overview
Passio.ai provides nutrition tracking and food recognition through its API. The integration allows the Wellness app to recognize food from images and retrieve nutrition information.

### Authentication
- API key authentication
- No token refresh required

### Endpoints Used
- `/nutrition/recognize`: Recognize food from image data
- `/nutrition/search`: Search for food items
- `/nutrition/daily`: Get daily nutrition data

### Implementation Details
The integration is implemented using the adapter pattern in `src/api/adapters.js`. The `PassioAdapter` class handles data retrieval and food recognition.

```javascript
// Example usage
const passioAdapter = ApiAdapterFactory.createPassioAdapter({
  apiKey: process.env.PASSIO_API_KEY
});

// Recognize food from image
const foodData = await passioAdapter.recognizeFood(imageData);

// Search for food
const searchResults = await passioAdapter.searchFood('apple');
```

## 4. Strava Integration

### Overview
Strava provides fitness activity tracking through its API. The integration allows the Wellness app to retrieve workout data and activity information.

### Authentication
- OAuth 2.0 authentication
- Requires client ID and client secret
- Access tokens expire and need to be refreshed using refresh tokens

### Endpoints Used
- `/oauth/token`: Exchange authorization code for access token
- `/oauth/token`: Refresh access token
- `/athlete`: Get athlete profile
- `/athlete/activities`: Get activities list
- `/activities/{id}`: Get activity details

### Implementation Details
The integration is implemented using the adapter pattern in `src/api/adapters.js`. The `StravaAdapter` class handles authentication and data retrieval.

```javascript
// Example usage
const stravaAdapter = ApiAdapterFactory.createStravaAdapter({
  clientId: process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
  redirectUri: process.env.STRAVA_REDIRECT_URI
});

// Get authorization URL
const authUrl = stravaAdapter.getAuthorizationUrl();

// Exchange code for token
const tokens = await stravaAdapter.exchangeToken(code);

// Get activities
const activities = await stravaAdapter.getActivities(tokens.accessToken);
```

## Data Flow

1. User connects their accounts for each service
2. API adapters retrieve data from external services
3. Data is transformed into a unified format
4. Data is stored in Neo4j database with relationships
5. Services layer provides business logic for data analysis
6. API endpoints expose the data to the frontend

## Error Handling

All API adapters include error handling for:
- Authentication failures
- API rate limiting
- Network errors
- Invalid data responses

Errors are logged and appropriate HTTP status codes are returned to the client.

## Mock Data for Development

For development and testing purposes, each adapter includes a `getMockData()` method that returns realistic mock data. This allows development to proceed without actual API keys.

## Future Improvements

1. Implement webhook support for real-time data updates
2. Add caching layer to reduce API calls
3. Implement batch processing for historical data
4. Add more granular error handling and retry logic
