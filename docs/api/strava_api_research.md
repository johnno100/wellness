# Strava API Integration Research

## Overview
The Strava V3 API is a publicly available interface that allows developers to access Strava data. It provides access to athlete data, activities, segments, routes, clubs, and gear. The API is stable and used by the Strava mobile apps themselves.

## Authentication
- Uses OAuth2 for authentication
- Authentication flow:
  1. Register application to obtain client ID and client secret
  2. Redirect user to Strava's authorization page
  3. User grants permission with specific scopes
  4. Strava redirects back with authorization code
  5. Exchange authorization code for refresh token and access token
  6. Use access token to make API requests
  7. Use refresh token to obtain new access tokens when they expire

## Key Scopes
- `read`: Read public segments, routes, profile data, posts, events, club feeds, and leaderboards
- `read_all`: Read private routes, segments, and events
- `profile:read_all`: Read all profile information regardless of visibility settings
- `profile:write`: Update user's weight and FTP, star/unstar segments
- `activity:read`: Read activities visible to Everyone and Followers (excluding privacy zones)
- `activity:read_all`: Read all activities including those set to "Only You" and privacy zone data
- `activity:write`: Create and update activities

## Key Endpoints

### Activities
- `GET /activities/{id}`: Get activity details
- `GET /athlete/activities`: List athlete activities
- `POST /activities`: Create an activity
- `PUT /activities/{id}`: Update activity
- `GET /activities/{id}/comments`: List activity comments
- `GET /activities/{id}/kudos`: List activity kudoers
- `GET /activities/{id}/laps`: List activity laps
- `GET /activities/{id}/zones`: Get activity zones

### Athletes
- `GET /athlete`: Get authenticated athlete
- `GET /athlete/zones`: Get athlete zones
- `GET /athletes/{id}/stats`: Get athlete stats
- `PUT /athlete`: Update athlete

### Clubs
- `GET /clubs/{id}/activities`: List club activities
- `GET /clubs/{id}`: Get club
- `GET /athlete/clubs`: List athlete clubs
- `GET /clubs/{id}/members`: List club members

### Routes
- `GET /routes/{id}`: Get route
- `GET /athletes/{id}/routes`: List athlete routes
- `GET /routes/{id}/export_gpx`: Export route as GPX
- `GET /routes/{id}/export_tcx`: Export route as TCX

### Segments
- `GET /segments/{id}`: Get segment
- `GET /segments/{id}/leaderboard`: Get segment leaderboard
- `GET /segments/explore`: Explore segments

## Data Format
- API responses are in JSON format
- Activity data includes:
  - Basic info (name, type, distance, time, etc.)
  - Geographic data (start/end points, map data)
  - Performance metrics (speed, watts, heart rate, etc.)
  - Social data (kudos, comments)

## Implementation Considerations for Wellness App
- OAuth flow requires web or mobile integration for user authorization
- Access tokens expire, implement refresh token flow
- Consider which scopes are necessary for your application
- Respect rate limits (100 requests per 15 minutes, 1000 per day)
- Store activity data in Neo4j with appropriate relationships to other health data
- Consider privacy implications and only request necessary scopes
- Implement webhook support for real-time activity updates

## Mobile Integration
- Android: Use Implicit Intent to redirect to Strava authorization
- iOS: Use SFAuthenticationSession or ASWebAuthenticationSession
- Check if Strava app is installed for better user experience

## Resources
- API Documentation: https://developers.strava.com/docs/
- API Reference: https://developers.strava.com/docs/reference/
- Authentication Guide: https://developers.strava.com/docs/authentication/
- Swagger Playground: Available for testing API requests
- Rate Limits: https://developers.strava.com/docs/rate-limits/
