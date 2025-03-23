# Project Structure

This document details the organization of the Wellness App codebase, explaining the purpose of each directory and file.

## Repository Overview

The Wellness App codebase is organized as a monorepo containing both backend and mobile application code. This structure enables efficient development workflow while maintaining clear separation between components.

```
wellness-app/
├── .github/            # GitHub-specific files (actions, templates)
├── backend/            # Backend API server code
├── mobile/             # React Native mobile application
├── database/           # Database migrations and scripts
├── docs/               # Documentation
└── docker-compose.yml  # Development environment configuration
```

## Backend Structure

```
backend/
├── src/                # Source code
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.js        # Application entry point
├── test/               # Test files
├── Dockerfile          # Docker configuration
├── jest.config.js      # Jest configuration
├── package.json        # Dependencies and scripts
└── README.md           # Backend documentation
```

### Key Backend Directories

#### `src/config/`

Contains configuration files for the application, including environment variables, database connections, and service configurations.

**Key Files:**
- `env.js` - Environment variables loading and validation
- `neo4j.js` - Neo4j database connection configuration
- `logger.js` - Logging configuration

#### `src/controllers/`

Contains request handlers that process HTTP requests and return responses. Controllers interact with services to perform business logic.

**Key Files:**
- `auth.controller.js` - Authentication-related endpoints
- `user.controller.js` - User management endpoints
- `health.controller.js` - Health data endpoints

#### `src/middleware/`

Contains Express middleware functions that process requests before they reach the route handlers.

**Key Files:**
- `auth.js` - Authentication verification middleware
- `errorHandler.js` - Global error handling middleware
- `validation.js` - Request validation middleware

#### `src/models/`

Contains data models and database query functions.

**Key Files:**
- `user.model.js` - User-related database operations
- `health.model.js` - Health data database operations

#### `src/routes/`

Contains API route definitions that map URLs to controller functions.

**Key Files:**
- `auth.routes.js` - Authentication routes
- `user.routes.js` - User management routes
- `health.routes.js` - Health data routes

#### `src/services/`

Contains business logic that is separated from the request/response cycle. Services interact with models to perform data operations.

**Key Files:**
- `auth.service.js` - Authentication operations
- `user.service.js` - User management operations
- `health.service.js` - Health data operations
- `integration/` - External API integration services
  - `sahha.service.js` - Sahha API integration
  - `asleep.service.js` - Asleep API integration
  - `passio.service.js` - Passio API integration
  - `strava.service.js` - Strava API integration

#### `src/utils/`

Contains utility functions and helpers used throughout the application.

**Key Files:**
- `logger.js` - Logging utility
- `ApiError.js` - API error class for consistent error handling
- `healthMetrics.js` - Health score calculation utilities
- `validation.schemas.js` - Joi validation schemas

## Mobile Structure

```
mobile/
├── src/                # Source code
│   ├── assets/         # Static assets (images, fonts)
│   ├── components/     # Reusable UI components
│   ├── config/         # Application configuration
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── redux/          # Redux state management
│   ├── screens/        # Screen components
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── App.js          # Application entry point
├── e2e/                # End-to-end tests
├── Dockerfile          # Docker configuration
├── jest.config.js      # Jest configuration
├── package.json        # Dependencies and scripts
└── README.md           # Mobile documentation
```

### Key Mobile Directories

#### `src/assets/`

Contains static assets used in the application.

**Key Directories:**
- `images/` - Image files
- `fonts/` - Font files
- `animations/` - Lottie animation files

#### `src/components/`

Contains reusable UI components organized by feature or domain.

**Key Directories:**
- `common/` - Generic UI components
  - `Button.js`
  - `Card.js`
  - `Text.js`
  - `LoadingIndicator.js`
- `auth/` - Authentication components
- `dashboard/` - Dashboard components
- `health/` - Health domain components
  - `mental/` - Mental health components
  - `sleep/` - Sleep tracking components
  - `nutrition/` - Nutrition tracking components
  - `fitness/` - Fitness tracking components

#### `src/config/`

Contains configuration files for the mobile application.

**Key Files:**
- `constants.js` - Application constants
- `theme.js` - UI theme configuration
- `api.config.js` - API configuration

#### `src/hooks/`

Contains custom React hooks used throughout the application.

**Key Files:**
- `useAuth.js` - Authentication hook
- `useApi.js` - API request hook
- `useOfflineSync.js` - Offline data synchronization hook
- `useHealthData.js` - Health data hook

#### `src/navigation/`

Contains navigation configuration using React Navigation.

**Key Files:**
- `AppNavigator.js` - Main application navigator
- `AuthNavigator.js` - Authentication flow navigator
- `DashboardNavigator.js` - Main app flow navigator
- `HealthNavigator.js` - Health domain navigator
- `navigationRef.js` - Navigation reference for outside-of-components navigation

#### `src/redux/`

Contains Redux state management code using Redux Toolkit.

**Key Files:**
- `store.js` - Redux store configuration
- `rootReducer.js` - Root reducer composition
- `slices/` - Redux Toolkit slices
  - `authSlice.js` - Authentication state
  - `healthSlice.js` - Health data state
  - `settingsSlice.js` - User settings state
- `hooks/` - Redux custom hooks

#### `src/screens/`

Contains screen components organized by feature or domain.

**Key Directories:**
- `auth/` - Authentication screens
  - `LoginScreen.js`
  - `RegisterScreen.js`
  - `ForgotPasswordScreen.js`
- `dashboard/` - Dashboard screens
  - `HomeScreen.js`
  - `WellnessScoreScreen.js`
- `health/` - Health domain screens
  - `MentalHealthScreen.js`
  - `SleepScreen.js`
  - `NutritionScreen.js`
  - `FitnessScreen.js`
- `settings/` - Settings screens
  - `ProfileScreen.js`
  - `NotificationsScreen.js`
  - `IntegrationsScreen.js`

#### `src/services/`

Contains API service code that interfaces with the backend API.

**Key Files:**
- `api/` - Core API configuration
  - `apiClient.js` - Axios configuration
  - `middleware.js` - API middleware
  - `apiSlice.js` - RTK Query API slice
- `auth/` - Authentication services
- `health/` - Health data services
  - `sahhaService.js` - Sahha integration service
  - `asleepService.js` - Asleep integration service
  - `passioService.js` - Passio integration service
  - `stravaService.js` - Strava integration service

#### `src/utils/`

Contains utility functions used throughout the application.

**Key Files:**
- `storage.js` - AsyncStorage wrapper
- `logger.js` - Logging utility
- `date.js` - Date formatting utilities
- `permissions.js` - Permission handling utilities
- `validation.js` - Form validation utilities
- `analytics.js` - Analytics tracking utilities

## Database Structure

```
database/
├── migrations/        # Database migration scripts
├── seeds/             # Seed data scripts
└── schemas/           # Schema definition files
```

### Key Database Files

#### `migrations/`

Contains versioned database migration scripts for Neo4j.

**Example Files:**
- `001-initial-schema.cypher` - Initial database schema
- `002-add-indexes.cypher` - Database indexes
- `003-add-constraints.cypher` - Database constraints

## Documentation Structure

```
docs/
├── architecture/       # Architecture documentation
├── api/                # API documentation
├── development/        # Development guides
├── testing/            # Testing documentation
└── assets/             # Documentation assets
```

### Key Documentation Files

#### `architecture/`

Contains architectural documentation.

**Key Files:**
- `system-architecture.md` - Overall system architecture
- `data-model.md` - Neo4j data model documentation

#### `api/`

Contains API documentation.

**Key Files:**
- `api-documentation.md` - API endpoints documentation

#### `development/`

Contains development guides.

**Key Files:**
- `project-structure.md` - Codebase organization
- `coding-standards.md` - Coding standards
- `git-workflow.md` - Git workflow guidelines

#### `testing/`

Contains testing documentation.

**Key Files:**
- `testing-strategy.md` - Testing strategy
- `test-implementation-guide.md` - Test implementation guide

## CI/CD Structure

```
.github/
├── workflows/          # GitHub Actions workflows
│   ├── backend-cicd.yml    # Backend CI/CD
│   ├── mobile-cicd.yml     # Mobile CI/CD
│   ├── db-migration.yml    # Database migration
│   └── test.yml            # Testing workflow
└── ISSUE_TEMPLATE/     # Issue templates
```

## File Naming Conventions

### General Rules

- Use kebab-case for directory names: `health-services/`
- Use camelCase for file names: `userService.js`
- Use PascalCase for React components: `DashboardScreen.js`
- Use snake_case for database migration files: `001_initial_schema.cypher`

### Backend Specific

- Controllers: `[name].controller.js`
- Services: `[name].service.js`
- Routes: `[name].routes.js`
- Middleware: `[name].js`
- Tests: `[name].test.js` or `[name].spec.js`

### Mobile Specific

- Components: `[ComponentName].js`
- Screens: `[ScreenName]Screen.js`
- Redux slices: `[name]Slice.js`
- Utils: `[name].js`
- Hooks: `use[Name].js`

## Import Order Guidelines

We follow a consistent import order in all files:

1. External libraries
2. Internal modules (absolute imports)
3. Local imports (relative imports)
4. CSS/SCSS imports

Example:

```javascript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// 2. Internal modules (absolute imports)
import { colors } from 'src/config/theme';
import { useFetchData } from 'src/hooks/useFetchData';

// 3. Local imports (relative imports)
import HealthCard from '../components/HealthCard';
import { formatDate } from '../utils/date';

// 4. CSS/SCSS imports (React Native doesn't use these, but web might)
import styles from './styles';
```

## Environment Configuration

### Backend Environment Variables

Environment variables are managed using `.env` files and loaded with `dotenv`.

Example `.env.development`:

```
NODE_ENV=development
PORT=3000
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
JWT_SECRET=dev-secret-key
```

### Mobile Environment Variables

React Native environment variables are managed using `react-native-config`.

Example `.env.development`:

```
API_URL=http://localhost:3000/api
STRAVA_CLIENT_ID=your-client-id
STRAVA_REDIRECT_URI=wellnessapp://strava-callback
```

## Module Boundaries

The codebase enforces clear module boundaries to maintain separation of concerns:

- **Backend**: Controllers should not import models directly; they should go through services
- **Mobile**: Screens should not make API calls directly; they should use services or Redux actions
- **Cross-cutting concerns**: Logging, error handling, and authentication should use dedicated utilities

## Dependency Management

- Backend dependencies are managed in `backend/package.json`
- Mobile dependencies are managed in `mobile/package.json`
- Shared development tools (like linting) may be in the root `package.json`

## Build Artifacts

- Backend build artifacts are placed in `backend/dist/`
- Mobile build artifacts depend on the platform:
  - iOS: `mobile/ios/build/`
  - Android: `mobile/android/app/build/`

## Generated Files

The following files are generated and should not be edited manually:

- `node_modules/`
- `*/dist/`
- `*/build/`
- `mobile/ios/Pods/`
- `coverage/`
- `.env.local`

## IDE Configuration

The repository includes configuration files for popular IDEs:

- `.vscode/` - Visual Studio Code configuration
- `.idea/` - JetBrains IDEs configuration

These configurations ensure consistent code style and editor behavior across the development team.
