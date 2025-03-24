# Wellness App MVP

## Overview

The Wellness App MVP is a mobile application that integrates with multiple health and wellness APIs to provide users with a comprehensive view of their health data. The app integrates with:

- **sahha.ai** - For mental health tracking and analysis
- **Strava** - For fitness activity tracking
- **asleep.ai** - For sleep analysis and tracking
- **passio.ai** - For nutrition tracking and food recognition

## Features

- User authentication and profile management
- Dashboard with health summary
- Mental health tracking and insights
- Sleep analysis and recommendations
- Nutrition tracking with food recognition
- Fitness activity tracking and analysis
- API integrations with sahha.ai, Strava, asleep.ai, and passio.ai

## Technology Stack

- React Native
- TypeScript
- Redux Toolkit for state management
- React Navigation for navigation
- React Native Paper for UI components
- Axios for API requests

## Project Structure

```text
wellness-app-mvp/
├── src/
│   ├── assets/           # Images, fonts, and other static assets
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Common components used across the app
│   │   └── screens/      # Screen-specific components
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── redux/            # Redux store, slices, and selectors
│   │   ├── slices/       # Redux slices for different domains
│   │   └── selectors/    # Redux selectors
│   ├── screens/          # Screen components
│   ├── services/         # API services and adapters
│   │   ├── api/          # API adapters for third-party services
│   │   ├── auth/         # Authentication services
│   │   └── health/       # Health data services
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
├── .eslintrc.js          # ESLint configuration
├── babel.config.js       # Babel configuration
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Getting Started

See the [Build and Deployment Instructions](./build_deployment_instructions.md) for detailed setup instructions.

## API Integration

The app integrates with the following APIs:

- **sahha.ai** - Mental health tracking
- **Strava** - Fitness activity tracking
- **asleep.ai** - Sleep analysis
- **passio.ai** - Nutrition tracking

Each API has its own adapter in the `src/services/api` directory.

## Figma Design

The app's UI is based on the "Health & Wellness App UI Kit" Figma template, which provides a clean and modern design for health and wellness applications.

## Contributing

This project is part of the wellness monorepo. To contribute, please follow the contribution guidelines in the root repository.
