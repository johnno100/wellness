# Coding Standards

This document outlines the coding standards and best practices for the Wellness App development team. Following these guidelines ensures code consistency, maintainability, and quality across the entire codebase.

## General Guidelines

### Code Formatting

- Use [Prettier](https://prettier.io/) for automatic code formatting
- Use [ESLint](https://eslint.org/) for static code analysis
- Follow the configured rules without exceptions
- Run linting before committing code

### Naming Conventions

- Use meaningful and descriptive names
- Avoid abbreviations unless they are well-known (e.g., HTTP, URL)
- Be consistent with the existing codebase
- Follow language-specific conventions:
  - JavaScript/TypeScript: camelCase for variables and functions, PascalCase for classes and components
  - CSS: kebab-case for class names
  - Database: snake_case for database fields

### File Organization

- One primary class/component per file
- Group related functionality in directories
- Keep files focused on a single responsibility
- Limit file size (aim for <300 lines where possible)

### Comments and Documentation

- Write self-documenting code where possible
- Add comments for complex logic or non-obvious decisions
- Use JSDoc for documenting functions and components
- Include references to external resources or research when relevant

Example JSDoc comment:

```javascript
/**
 * Calculates the overall wellness score based on all health domains.
 * 
 * @param {Object} mentalHealth - Mental health data with stressLevel, moodScore, etc.
 * @param {Object} sleep - Sleep data with sleepDuration, sleepQualityScore, etc.
 * @param {Object} nutrition - Nutrition data with nutritionQualityScore, etc.
 * @param {Object} fitness - Fitness data with fitnessScore, etc.
 * @returns {number} Overall wellness score from 0-100
 */
function calculateWellnessScore(mentalHealth, sleep, nutrition, fitness) {
  // Implementation
}
```

## JavaScript/TypeScript Guidelines

### Language Features

- Use ES6+ features appropriately
- Prefer `const` over `let`, avoid `var`
- Use template literals instead of string concatenation
- Use arrow functions for anonymous functions
- Use destructuring for objects and arrays
- Use spread/rest operators for object/array manipulation
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators

### TypeScript Usage

- Define explicit types for function parameters and return values
- Create interfaces for complex objects
- Use type aliases for reusable types
- Avoid using `any` type except when absolutely necessary
- Use generics for reusable components and functions
- Enable strict type checking in `tsconfig.json`

Example:

```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

function getUserProfile(userId: string): Promise<User> {
  // Implementation
}
```

### Asynchronous Code

- Use async/await for asynchronous operations
- Handle errors with try/catch blocks
- Avoid deeply nested promises
- Be explicit about error types
- Implement proper error propagation

Example:

```javascript
async function fetchUserData(userId) {
  try {
    const user = await userService.getUser(userId);
    return user;
  } catch (error) {
    logger.error(`Failed to fetch user data: ${error.message}`, { userId });
    throw new ApiError(500, 'Failed to fetch user data');
  }
}
```

### Error Handling

- Never silently catch errors
- Log errors with appropriate context
- Use custom error classes
- Provide meaningful error messages
- Include error recovery strategies where applicable

Example:

```javascript
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
```

## React/React Native Guidelines

### Component Structure

- Prefer functional components with hooks
- Use PascalCase for component names
- One component per file (except for small helper components)
- Organize props with TypeScript interfaces or PropTypes
- Follow a consistent component structure:
  1. Imports
  2. Type definitions
  3. Component function
  4. Helper functions
  5. Styles
  6. Export statement

Example:

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

// Type definitions
interface WellnessScoreProps {
  score: number;
  label?: string;
}

// Component
const WellnessScore: React.FC<WellnessScoreProps> = ({ score, label = 'Overall Score' }) => {
  // Component state and effects
  const [scoreColor, setScoreColor] = useState('#000');
  
  useEffect(() => {
    setScoreColor(getColorForScore(score));
  }, [score]);
  
  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.scoreCircle, { backgroundColor: scoreColor }]}>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
    </View>
  );
};

// Helper functions
const getColorForScore = (score) => {
  if (score >= 80) return '#4CAF50';
  if (score >= 60) return '#FFC107';
  return '#F44336';
};

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WellnessScore;
```

### State Management

- Use local state for component-specific state
- Use Redux for global application state
- Follow Redux Toolkit patterns
- Use selectors for accessing state
- Keep Redux state normalized

Redux slice example:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { healthService } from '../../services/health';

export const fetchDashboardData = createAsyncThunk(
  'health/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await healthService.getDashboardData();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  dashboard: {
    mental: null,
    sleep: null,
    nutrition: null,
    fitness: null,
    overall_wellness_score: 0,
  },
  loading: {
    dashboard: false,
  },
  error: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    resetHealthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading.dashboard = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.loading.dashboard = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error = action.payload;
      });
  },
});

export const { resetHealthError } = healthSlice.actions;
export default healthSlice.reducer;
```

### Performance Optimization

- Use React.memo for expensive components
- Implement useCallback for handler functions passed to child components
- Use useMemo for expensive calculations
- Optimize re-renders with proper key usage
- Implement virtualization for long lists
- Use appropriate image optimization techniques

Example:

```jsx
import React, { useMemo, useCallback } from 'react';
import { FlatList } from 'react-native';

const HealthMetricsList = ({ metrics }) => {
  // Memoize expensive calculation
  const processedMetrics = useMemo(() => {
    return metrics.map(metric => ({
      ...metric,
      formattedValue: formatMetricValue(metric.value, metric.type),
    }));
  }, [metrics]);
  
  // Memoize handler function
  const handleMetricPress = useCallback((metric) => {
    navigation.navigate('MetricDetail', { metricId: metric.id });
  }, [navigation]);
  
  // Memoize render item function
  const renderItem = useCallback(({ item }) => (
    <MetricItem 
      metric={item} 
      onPress={() => handleMetricPress(item)} 
    />
  ), [handleMetricPress]);
  
  return (
    <FlatList
      data={processedMetrics}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default React.memo(HealthMetricsList);
```

## Backend Guidelines

### API Design

- Follow RESTful principles
- Use consistent URL patterns
- Use appropriate HTTP methods
- Return appropriate status codes
- Implement proper error responses
- Version your API

### Controller Design

- Keep controllers thin
- Move business logic to services
- Implement proper input validation
- Use async/await with try/catch
- Return consistent response structure

Example:

```javascript
/**
 * Get dashboard data
 * @route GET /api/health/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get dashboard data from service
    const dashboardData = await healthService.getDashboardData(userId);
    
    res.status(200).json({
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};
```

### Service Design

- Implement domain-specific business logic
- Handle data transformations
- Interact with data models/repositories
- Implement proper error handling
- Focus on reusability

Example:

```javascript
/**
 * Get dashboard data for a user
 * @param {string} userId
 * @returns {Object} dashboard data
 */
const getDashboardData = async (userId) => {
  const session = neo4j.getSession();
  try {
    // Get latest health data from all domains
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      // Rest of query...
      `,
      { userId }
    );
    
    // Process results...
    return {
      mental: mentalHealth,
      sleep: sleep,
      nutrition: nutrition,
      fitness: fitness,
      overall_wellness_score: wellnessScore,
    };
  } catch (error) {
    logger.error('Get dashboard data error:', error);
    throw error;
  } finally {
    await session.close();
  }
};
```

### Database Queries

- Parameterize all queries
- Implement proper transaction handling
- Close database connections properly
- Use indexes for frequent queries
- Optimize query performance

Example:

```javascript
const createUser = async (userData) => {
  const session = neo4j.getSession();
  try {
    // Start an explicit transaction
    const tx = session.beginTransaction();
    
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user in database with parameterized query
      const result = await tx.run(
        `
        CREATE (u:User {
          id: randomUUID(),
          email: $email,
          password: $password,
          firstName: $firstName,
          lastName: $lastName,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN u
        `,
        {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
        }
      );
      
      // Commit the transaction
      await tx.commit();
      
      if (result.records.length === 0) {
        throw new ApiError(500, 'Failed to create user');
      }
      
      // Parse user from result
      const userNode = result.records[0].get('u');
      return {
        id: userNode.properties.id,
        email: userNode.properties.email,
        firstName: userNode.properties.firstName,
        lastName: userNode.properties.lastName,
        createdAt: userNode.properties.createdAt,
      };
    } catch (txError) {
      // Rollback on error
      await tx.rollback();
      throw txError;
    }
  } catch (error) {
    logger.error('Create user error:', error);
    throw error;
  } finally {
    await session.close();
  }
};
```

## Testing Guidelines

### General Testing Principles

- Write tests before or alongside code (TDD/BDD)
- Focus on behavior, not implementation
- Maintain test independence
- Cover happy paths and edge cases
- Make tests deterministic

### Unit Testing

- Test individual functions and components
- Mock dependencies
- Focus on a single unit of functionality
- Keep tests fast and isolated
- Follow AAA pattern (Arrange, Act, Assert)

Example:

```javascript
describe('calculateWellnessScore', () => {
  it('should calculate overall wellness score correctly with all domains', () => {
    // Arrange
    const mentalHealth = {
      stressLevel: 30,
      moodScore: 80,
    };
    
    const sleep = {
      sleepQualityScore: 85,
    };
    
    // Act
    const score = calculateWellnessScore(mentalHealth, sleep, null, null);
    
    // Assert
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

### Integration Testing

- Test interactions between components
- Minimize mocking
- Focus on interfaces between systems
- Test realistic scenarios

Example:

```javascript
describe('Authentication API', () => {
  it('should register a new user and return tokens', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User'
    };
    
    // Act
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    // Assert
    expect(response.body.data.user).toHaveProperty('id');
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.tokens).toHaveProperty('accessToken');
    expect(response.body.data.tokens).toHaveProperty('refreshToken');
  });
});
```

### End-to-End Testing

- Test entire user flows
- Use real dependencies where possible
- Focus on critical user journeys
- Run in an environment close to production

Example:

```javascript
describe('Login Flow', () => {
  it('should login with valid credentials and display dashboard', async () => {
    // Navigate to login screen
    await element(by.id('login-tab')).tap();
    
    // Enter credentials
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    
    // Submit login form
    await element(by.id('login-button')).tap();
    
    // Verify dashboard is displayed
    await expect(element(by.id('dashboard-screen'))).toBeVisible();
    await expect(element(by.id('wellness-score'))).toBeVisible();
  });
});
```

## Security Guidelines

### Authentication & Authorization

- Use JWT for authentication
- Implement proper token expiration
- Store tokens securely
- Implement proper authorization checks
- Use HTTPS for all communication

### Input Validation

- Validate all user inputs
- Implement proper sanitization
- Use parameterized queries
- Avoid direct injection of user data

Example:

```javascript
const createUser = async (req, res, next) => {
  try {
    // Validate input
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    });
    
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      throw new ApiError(400, `Validation error: ${error.details[0].message}`);
    }
    
    // Process validated data
    const user = await userService.createUser(value);
    
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};
```

### Data Protection

- Encrypt sensitive data
- Implement proper access controls
- Follow the principle of least privilege
- Implement secure defaults

### Secure Dependencies

- Regularly update dependencies
- Run security audits
- Remove unused dependencies
- Pin dependency versions

## Code Review Guidelines

### Before Submitting

- Run all tests
- Run linting
- Review your own code
- Check for security issues
- Ensure proper documentation

### During Review

- Be respectful and constructive
- Focus on code, not the author
- Provide examples and alternatives
- Consider the context and constraints
- Approve only when all issues are resolved

### Review Checklist

- Does the code work as expected?
- Is the code easy to understand?
- Does it follow project standards?
- Are there security concerns?
- Is there proper error handling?
- Are there adequate tests?
- Is performance acceptable?

## Version Control Guidelines

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Code changes that improve performance
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or tools

Example:

```
feat(auth): implement refresh token functionality

- Add refresh token endpoint
- Update token service with refresh logic
- Add tests for token refresh flow

Closes #123
```

### Branching Strategy

Follow the [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) workflow:

- `main`: Production code
- `develop`: Development code
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation
- `hotfix/*`: Production hotfixes

### Pull Requests

- Keep PRs focused on a single issue
- Provide clear descriptions
- Link related issues
- Include screenshots for UI changes
- Request reviews from appropriate team members

## Continuous Integration

- All code changes must pass CI checks
- Failed CI builds must be fixed immediately
- Maintain high test coverage
- Fix security vulnerabilities promptly
- Address technical debt regularly

---

By following these coding standards, we ensure that the Wellness App codebase remains maintainable, scalable, and of high quality. These standards will evolve over time as we identify new best practices and adapt to changing requirements.
