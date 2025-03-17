# Sahha.ai API Integration Research

## Overview
Sahha provides access to its platform via REST API for developers to authenticate user profiles, upload health data, and receive a variety of biomarkers and scores. The API allows integration with health data sources and provides insights based on the collected data.

## Authentication
- Uses JWT Bearer authentication
- Two types of tokens:
  - Account tokens (for admin tasks): Used with header `account {token}`
  - Profile tokens (for end users): Used with header `profile {token}`
- Authentication flow:
  1. Obtain Client ID and Secret from Credentials page
  2. Use these to request an account token
  3. Use account token for administrative tasks like registering profiles

## Key Endpoints

### Authentication
- `/api/v1/account/token` - Get account token for administrative tasks
- Profile authentication endpoints for end-user authentication

### Integration
- `/api/v1/profile/integration` - Returns integrations for a profile
- `/api/v1/profile/integration/garmin/callback` - Callback for Garmin integration
- `/api/v1/profile/integration/garmin/connect` - Connect to Garmin

### Data Access
- `/scores` - Fetch health scores for a given profile or cohort
- `/biomarkers` - Access biomarker details associated with a specific user
- `/profiles` - Manage and retrieve user profiles

## Data Format
- API responses are in JSON format
- Integration data includes:
  - `integrationType` - Type of integration (e.g., garmin)
  - `integrationValues` - Contains values specific to the integration
  - `integrationIdentifier` - Identification field for the integration (e.g., wearable user ID)

## Data Delivery Options
1. **Webhooks** (recommended):
   - Real-time data delivery
   - Automatically sends data when updates occur
   - Requires configuring a webhook endpoint
   - Supports events: Health Scores, Digital Biomarker Logs, Real-time Data Logs, Third Party Connected

2. **REST API**:
   - On-demand data access
   - Flexible and secure
   - Requires polling for updates

3. **UI Widgets**:
   - Webviews for mobile apps
   - Minimizes development time
   - Options include: chart, arc, bar, and factors widgets

## Integration Process
1. Register team and get API keys
2. Choose data source:
   - Sahha demo app
   - Sample profiles
   - SDK integration
3. Implement authentication
4. Set up data delivery method
5. Process and display data

## Implementation Considerations for Wellness App
- Use account token for admin operations
- Use profile tokens for end-user operations
- Consider webhooks for real-time data updates
- Store data in Neo4j with appropriate relationships
- Implement proper error handling for API responses
- Follow rate limiting guidelines

## Resources
- OpenAPI specification available in Sahha Dashboard
- API Query Builder available for testing
- Support available via support@sahha.ai or Slack Community
