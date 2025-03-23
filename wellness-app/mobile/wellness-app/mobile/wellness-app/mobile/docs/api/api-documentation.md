# API Documentation

This document provides comprehensive documentation for the Wellness App API endpoints. The API follows RESTful design principles and uses JSON for request and response bodies.

## Base URL

- Development: `http://localhost:3000/api`
- Staging: `https://api-staging.wellness-app.com/api`
- Production: `https://api.wellness-app.com/api`

## Authentication

All API requests (except authentication endpoints) require the use of a JWT token for authentication. 

### Headers

Include the JWT token in the Authorization header of your request:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

Use the authentication endpoints to obtain a token.

## Response Format

All responses use the following format:

```json
{
  "data": { ... },  // Response data (omitted for 204 responses)
  "meta": { ... }   // Optional metadata (pagination, etc.)
}
```

For errors:

```json
{
  "error": {
    "code": 400,             // HTTP status code
    "message": "Error message",  // Human-readable error message
    "details": { ... }       // Optional error details
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

## API Endpoints

### Authentication

#### Register User

```
POST /auth/register
```

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response: (201 Created)**
```json
{
  "data": {
    "user": {
      "id": "5f8d0c1b8f3d4e2a1c9b8a7d",
      "email": "user@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "createdAt": "2023-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### Login

```
POST /auth/login
```

Authenticates a user and returns tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "user": {
      "id": "5f8d0c1b8f3d4e2a1c9b8a7d",
      "email": "user@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "createdAt": "2023-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### Refresh Token

```
POST /auth/refresh
```

Generates new tokens using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### User Management

#### Get Current User

```
GET /users/me
```

Retrieves the authenticated user's profile.

**Response: (200 OK)**
```json
{
  "data": {
    "id": "5f8d0c1b8f3d4e2a1c9b8a7d",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "createdAt": "2023-01-15T10:30:00Z"
  }
}
```

#### Update Current User

```
PATCH /users/me
```

Updates the authenticated user's profile.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "id": "5f8d0c1b8f3d4e2a1c9b8a7d",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-20T15:45:00Z"
  }
}
```

### Health Dashboard

#### Get Dashboard Data

```
GET /health/dashboard
```

Retrieves the latest health data across all domains for the current user.

**Response: (200 OK)**
```json
{
  "data": {
    "overall_wellness_score": 78,
    "mental": {
      "id": "7a8b9c0d1e2f3g4h5i6j7k8l",
      "source": "sahha",
      "date": "2023-01-20T08:30:00Z",
      "stressLevel": 35,
      "moodScore": 80,
      "anxietyLevel": 25,
      "emotionalBalance": 85,
      "mentalEnergyLevel": 75
    },
    "sleep": {
      "id": "8b9c0d1e2f3g4h5i6j7k8l9m",
      "source": "asleep",
      "date": "2023-01-20T07:15:00Z",
      "sleepDuration": 480,
      "deepSleepDuration": 120,
      "remSleepDuration": 90,
      "lightSleepDuration": 270,
      "sleepQualityScore": 82,
      "sleepEfficiency": 87
    },
    "nutrition": {
      "id": "9c0d1e2f3g4h5i6j7k8l9m0n",
      "source": "passio",
      "date": "2023-01-20T19:45:00Z",
      "caloriesConsumed": 2100,
      "proteinGrams": 120,
      "carbGrams": 240,
      "fatGrams": 70,
      "nutritionQualityScore": 75
    },
    "fitness": {
      "id": "0d1e2f3g4h5i6j7k8l9m0n1o",
      "source": "strava",
      "date": "2023-01-20T18:00:00Z",
      "stepsCount": 8500,
      "activeMinutes": 45,
      "distanceKm": 5.3,
      "caloriesBurned": 380,
      "fitnessScore": 78
    }
  }
}
```

### Mental Health

#### Sync Mental Health Data

```
POST /health/mental/sync
```

Syncs mental health data from an external source.

**Request Body:**
```json
{
  "source": "sahha",
  "data": {
    "stressLevel": 35,
    "moodScore": 80,
    "anxietyLevel": 25,
    "emotionalBalance": 85,
    "mentalEnergyLevel": 75
  }
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "id": "7a8b9c0d1e2f3g4h5i6j7k8l",
    "source": "sahha",
    "date": "2023-01-20T15:30:00Z",
    "stressLevel": 35,
    "moodScore": 80,
    "anxietyLevel": 25,
    "emotionalBalance": 85,
    "mentalEnergyLevel": 75
  }
}
```

#### Get Mental Health History

```
GET /health/mental
```

Retrieves mental health history for the authenticated user.

**Query Parameters:**
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)
- `limit` (optional): Number of records to return (default: 10)
- `page` (optional): Page number for pagination (default: 1)

**Response: (200 OK)**
```json
{
  "data": [
    {
      "id": "7a8b9c0d1e2f3g4h5i6j7k8l",
      "source": "sahha",
      "date": "2023-01-20T15:30:00Z",
      "stressLevel": 35,
      "moodScore": 80,
      "anxietyLevel": 25,
      "emotionalBalance": 85,
      "mentalEnergyLevel": 75
    },
    {
      "id": "6a7b8c9d0e1f2g3h4i5j6k7l",
      "source": "sahha",
      "date": "2023-01-19T16:45:00Z",
      "stressLevel": 40,
      "moodScore": 75,
      "anxietyLevel": 30,
      "emotionalBalance": 80,
      "mentalEnergyLevel": 70
    }
  ],
  "meta": {
    "pagination": {
      "total": 15,
      "limit": 10,
      "page": 1,
      "pages": 2
    }
  }
}
```

### Sleep

#### Sync Sleep Data

```
POST /health/sleep/sync
```

Syncs sleep data from an external source.

**Request Body:**
```json
{
  "source": "asleep",
  "data": {
    "sleepDuration": 480,
    "deepSleepDuration": 120,
    "remSleepDuration": 90,
    "lightSleepDuration": 270,
    "sleepQualityScore": 82,
    "sleepEfficiency": 87
  }
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "id": "8b9c0d1e2f3g4h5i6j7k8l9m",
    "source": "asleep",
    "date": "2023-01-20T15:30:00Z",
    "sleepDuration": 480,
    "deepSleepDuration": 120,
    "remSleepDuration": 90,
    "lightSleepDuration": 270,
    "sleepQualityScore": 82,
    "sleepEfficiency": 87
  }
}
```

#### Get Sleep History

```
GET /health/sleep
```

Retrieves sleep history for the authenticated user.

**Query Parameters:**
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)
- `limit` (optional): Number of records to return (default: 10)
- `page` (optional): Page number for pagination (default: 1)

**Response: (200 OK)**
```json
{
  "data": [
    {
      "id": "8b9c0d1e2f3g4h5i6j7k8l9m",
      "source": "asleep",
      "date": "2023-01-20T07:15:00Z",
      "sleepDuration": 480,
      "deepSleepDuration": 120,
      "remSleepDuration": 90,
      "lightSleepDuration": 270,
      "sleepQualityScore": 82,
      "sleepEfficiency": 87
    },
    {
      "id": "7b8c9d0e1f2g3h4i5j6k7l8m",
      "source": "asleep",
      "date": "2023-01-19T07:30:00Z",
      "sleepDuration": 465,
      "deepSleepDuration": 110,
      "remSleepDuration": 95,
      "lightSleepDuration": 260,
      "sleepQualityScore": 78,
      "sleepEfficiency": 85
    }
  ],
  "meta": {
    "pagination": {
      "total": 14,
      "limit": 10,
      "page": 1,
      "pages": 2
    }
  }
}
```

### Nutrition

#### Sync Nutrition Data

```
POST /health/nutrition/sync
```

Syncs nutrition data from an external source.

**Request Body:**
```json
{
  "source": "passio",
  "data": {
    "caloriesConsumed": 2100,
    "proteinGrams": 120,
    "carbGrams": 240,
    "fatGrams": 70,
    "nutritionQualityScore": 75
  }
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "id": "9c0d1e2f3g4h5i6j7k8l9m0n",
    "source": "passio",
    "date": "2023-01-20T15:30:00Z",
    "caloriesConsumed": 2100,
    "proteinGrams": 120,
    "carbGrams": 240,
    "fatGrams": 70,
    "nutritionQualityScore": 75
  }
}
```

#### Get Nutrition History

```
GET /health/nutrition
```

Retrieves nutrition history for the authenticated user.

**Query Parameters:**
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)
- `limit` (optional): Number of records to return (default: 10)
- `page` (optional): Page number for pagination (default: 1)

**Response: (200 OK)**
```json
{
  "data": [
    {
      "id": "9c0d1e2f3g4h5i6j7k8l9m0n",
      "source": "passio",
      "date": "2023-01-20T19:45:00Z",
      "caloriesConsumed": 2100,
      "proteinGrams": 120,
      "carbGrams": 240,
      "fatGrams": 70,
      "nutritionQualityScore": 75
    },
    {
      "id": "8c9d0e1f2g3h4i5j6k7l8m9n",
      "source": "passio",
      "date": "2023-01-19T20:15:00Z",
      "caloriesConsumed": 2200,
      "proteinGrams": 130,
      "carbGrams": 220,
      "fatGrams": 75,
      "nutritionQualityScore": 72
    }
  ],
  "meta": {
    "pagination": {
      "total": 16,
      "limit": 10,
      "page": 1,
      "pages": 2
    }
  }
}
```

### Fitness

#### Sync Fitness Data

```
POST /health/fitness/sync
```

Syncs fitness data from an external source.

**Request Body:**
```json
{
  "source": "strava",
  "data": {
    "stepsCount": 8500,
    "activeMinutes": 45,
    "distanceKm": 5.3,
    "caloriesBurned": 380,
    "fitnessScore": 78
  }
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "id": "0d1e2f3g4h5i6j7k8l9m0n1o",
    "source": "strava",
    "date": "2023-01-20T15:30:00Z",
    "stepsCount": 8500,
    "activeMinutes": 45,
    "distanceKm": 5.3,
    "caloriesBurned": 380,
    "fitnessScore": 78
  }
}
```

#### Get Fitness History

```
GET /health/fitness
```

Retrieves fitness history for the authenticated user.

**Query Parameters:**
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)
- `limit` (optional): Number of records to return (default: 10)
- `page` (optional): Page number for pagination (default: 1)

**Response: (200 OK)**
```json
{
  "data": [
    {
      "id": "0d1e2f3g4h5i6j7k8l9m0n1o",
      "source": "strava",
      "date": "2023-01-20T18:00:00Z",
      "stepsCount": 8500,
      "activeMinutes": 45,
      "distanceKm": 5.3,
      "caloriesBurned": 380,
      "fitnessScore": 78
    },
    {
      "id": "9d0e1f2g3h4i5j6k7l8m9n0o",
      "source": "strava",
      "date": "2023-01-19T17:30:00Z",
      "stepsCount": 7800,
      "activeMinutes": 38,
      "distanceKm": 4.8,
      "caloriesBurned": 340,
      "fitnessScore": 75
    }
  ],
  "meta": {
    "pagination": {
      "total": 18,
      "limit": 10,
      "page": 1,
      "pages": 2
    }
  }
}
```

### Correlations and Insights

#### Get Health Correlations

```
GET /health/correlations
```

Retrieves correlations between different health domains.

**Query Parameters:**
- `domains` (required): Comma-separated health domains (mental,sleep,nutrition,fitness)
- `metrics` (required): Comma-separated metrics to correlate
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)

**Response: (200 OK)**
```json
{
  "data": {
    "correlations": [
      {
        "domains": ["sleep", "fitness"],
        "metrics": ["sleepQualityScore", "activeMinutes"],
        "correlation": 0.72,
        "strength": "strong",
        "description": "There is a strong positive correlation between sleep quality and active minutes."
      },
      {
        "domains": ["mental", "sleep"],
        "metrics": ["stressLevel", "deepSleepDuration"],
        "correlation": -0.65,
        "strength": "moderate",
        "description": "There is a moderate negative correlation between stress levels and deep sleep duration."
      }
    ],
    "dataPoints": 14
  }
}
```

#### Get Personalized Insights

```
GET /health/insights
```

Retrieves personalized health insights for the user.

**Query Parameters:**
- `limit` (optional): Number of insights to return (default: 5)

**Response: (200 OK)**
```json
{
  "data": {
    "insights": [
      {
        "id": "1e2f3g4h5i6j7k8l9m0n1o2p",
        "type": "correlation",
        "title": "Sleep affects your stress levels",
        "description": "On days when you sleep over 7 hours, your stress levels are 30% lower the next day.",
        "domains": ["sleep", "mental"],
        "confidence": 85,
        "createdAt": "2023-01-20T12:00:00Z"
      },
      {
        "id": "2f3g4h5i6j7k8l9m0n1o2p3q",
        "type": "trend",
        "title": "Your fitness is improving",
        "description": "Your active minutes have increased by 15% over the past 2 weeks.",
        "domains": ["fitness"],
        "confidence": 90,
        "createdAt": "2023-01-20T12:00:00Z"
      }
    ]
  }
}
```

### External Services Integration

#### Connect Strava

```
POST /integrations/strava/connect
```

Initiates Strava OAuth connection.

**Request Body:**
```json
{
  "code": "oauth-authorization-code"
}
```

**Response: (200 OK)**
```json
{
  "data": {
    "connected": true,
    "provider": "strava",
    "athleteId": "12345678",
    "expiresAt": "2023-01-22T15:30:00Z"
  }
}
```

#### Get Integration Status

```
GET /integrations/status
```

Retrieves status of all external service integrations.

**Response: (200 OK)**
```json
{
  "data": {
    "integrations": [
      {
        "provider": "strava",
        "connected": true,
        "lastSync": "2023-01-20T14:25:00Z",
        "expiresAt": "2023-01-22T15:30:00Z"
      },
      {
        "provider": "sahha",
        "connected": true,
        "lastSync": "2023-01-20T13:45:00Z"
      },
      {
        "provider": "asleep",
        "connected": false
      },
      {
        "provider": "passio",
        "connected": true,
        "lastSync": "2023-01-20T12:30:00Z"
      }
    ]
  }
}
```

### System

#### Health Check

```
GET /health
```

Checks the API health status.

**Response: (200 OK)**
```json
{
  "status": "ok",
  "version": "1.5.2",
  "timestamp": "2023-01-20T15:30:00Z"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - The request was invalid |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

## Versioning

The API is versioned through the URL path:

```
https://api.wellness-app.com/api/v1/users/me
```

The current version is v1. When a new version is released, the old version will be supported for at least 6 months.

## Webhook Events

Webhooks can be configured to receive event notifications:

```
POST /webhooks/configure
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["health.sync.completed", "user.updated"],
  "secret": "your-webhook-secret"
}
```

**Response: (201 Created)**
```json
{
  "data": {
    "id": "3g4h5i6j7k8l9m0n1o2p3q4r",
    "url": "https://your-app.com/webhook",
    "events": ["health.sync.completed", "user.updated"],
    "createdAt": "2023-01-20T15:30:00Z"
  }
}
```

## API Changelog

### v1.5.2 (2023-01-15)
- Added insights endpoint
- Improved correlation detection algorithm
- Fixed bug in sleep data synchronization

### v1.5.1 (2022-12-10)
- Added support for multiple Strava activities per day
- Optimized dashboard endpoint performance
- Added webhook for sync completion events

### v1.5.0 (2022-11-20)
- Added correlations endpoint
- Enhanced nutrition data model
- Improved error messages

### v1.4.0 (2022-10-15)
- Added sleep trend analysis
- Enhanced fitness data synchronization
- Added support for activity tagging

### v1.3.0 (2022-09-01)
- Added integration status endpoint
- Improved auth token refresh logic
- Enhanced rate limiting and added headers

## Support

For API support, please contact:
- Email: api-support@wellness-app.com
- Documentation: https://docs.wellness-app.com
