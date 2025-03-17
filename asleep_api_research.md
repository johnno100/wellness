# Asleep.ai API Integration Research

## Overview
The AsleepTrack API is a sleep analysis AI API that tracks sleep states by analyzing sound data collected from a smartphone in real time. It provides the AsleepTrack SDK, which automatically manages the audio process and uploads data, enabling client apps to easily integrate sleep tracking functionality.

## Integration Methods
1. **SDK Integration**:
   - iOS SDK: Available via GitHub (https://github.com/asleep-ai/asleep-sdk-ios-sampleapp-public.git)
   - Android SDK: Available via GitHub (https://github.com/asleep-ai/asleep-sdk-android-sampleapp-public.git)
   - Handles audio processing and data uploads automatically

2. **Direct API Integration**:
   - RESTful API endpoints for retrieving sleep data
   - Webhook support for real-time data updates

## Authentication
- Requires API Key for authentication
- API Key can be generated in the AsleepTrack Dashboard
- Authentication headers:
  - `x-api-key`: String (Required) - API Key
  - `x-user-id`: String (Required) - Issued user id

## Key Endpoints

### Data API
- `GET /data/v3/sessions/{session_id}` - Get sleep analysis data for a specific session
- `GET /data/v3/sessions` - List sessions
- `GET /data/v3/average-stats` - Get average sleep statistics

### Session API
- Endpoints for managing sleep tracking sessions

## Data Format
- API responses are in JSON format
- Sleep data includes:
  - Sleep stages (wake, light, deep, REM)
  - Breathing data
  - Snoring data
  - Sleep statistics (sleep index, latency, time in bed, etc.)
  - Session information (start time, end time, etc.)

## Webhook Integration
- Real-time data updates via webhook
- Register callback URL during SDK initialization
- Event types:
  - `INFERENCE_COMPLETE` - Sent when analysis is completed for a segment
  - `SESSION_COMPLETE` - Sent when a session is terminated with complete data

## Sleep Tracking Process
1. Initialize SDK with API Key and user ID
2. Begin sleep tracking session
3. Track for at least 5 minutes to receive analysis results
4. Retrieve sleep data using either:
   - SDK Reports/Data API (polling approach)
   - Webhook for real-time updates
5. End sleep tracking session

## Implementation Considerations for Wellness App
- Minimum tracking time of 5 minutes required for analysis
- Asynchronous processing requires polling or webhook for real-time data
- Sound data collection requires appropriate privacy permissions
- Consider timezone handling for accurate sleep data representation
- Store sleep data in Neo4j with appropriate relationships to other health data

## Sample Data Structure
```json
{
    "event": "SESSION_COMPLETE",
    "version": "V3",
    "data": {
        "timezone": "UTC",
        "peculiarities": ["NO_BREATHING_STABILITY"],
        "missing_data_ratio": 0.0,
        "user_id": "G-20250115025029-vLErWBfQNtnfvgDccFOQ",
        "session": {
            "id": "20250115025029_fvivn",
            "state": "COMPLETE",
            "start_time": "2025-01-15T02:50:29+00:00",
            "end_time": "2025-01-15T03:50:29+00:00",
            "sleep_stages": [0, 1, 2, 3, ...],
            "breath_stages": null,
            "snoring_stages": [0, 0, 0, ...]
        },
        "stat": {
            "sleep_time": "2025-01-15T03:05:29+00:00",
            "wake_time": "2025-01-15T03:26:29+00:00",
            "sleep_index": 50,
            "sleep_latency": 900,
            "time_in_bed": 3600,
            "time_in_sleep": 1080
            // Additional statistics...
        }
    }
}
```

## Resources
- Documentation: https://docs-en.asleep.ai/docs/quickstart
- Sample Apps: Available on GitHub for iOS and Android
- Dashboard: Available for API key generation and data visualization
