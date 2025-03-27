import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { createMentalHealthData, createSleepData, createNutritionData, createFitnessData, createDashboardData } from '../../__fixtures__/healthData';

// Create a test server that intercepts API requests
const server = setupServer(
  // Auth endpoints
  rest.post('https://api.wellness.com/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'test-token',
        user: {
          id: 'user-test-1',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    );
  }),
  
  rest.post('https://api.wellness.com/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        token: 'test-token',
        user: {
          id: 'user-test-1',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    );
  }),
  
  // Health data endpoints
  rest.get('https://api.wellness.com/health/mental', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [createMentalHealthData()]
      })
    );
  }),
  
  rest.post('https://api.wellness.com/health/mental/sync', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Mental health data synced successfully',
        data: createMentalHealthData()
      })
    );
  }),
  
  rest.get('https://api.wellness.com/health/sleep', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [createSleepData()]
      })
    );
  }),
  
  rest.post('https://api.wellness.com/health/sleep/sync', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Sleep data synced successfully',
        data: createSleepData()
      })
    );
  }),
  
  rest.get('https://api.wellness.com/health/nutrition', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [createNutritionData()]
      })
    );
  }),
  
  rest.post('https://api.wellness.com/health/nutrition/sync', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Nutrition data synced successfully',
        data: createNutritionData()
      })
    );
  }),
  
  rest.get('https://api.wellness.com/health/fitness', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [createFitnessData()]
      })
    );
  }),
  
  rest.post('https://api.wellness.com/health/fitness/sync', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Fitness data synced successfully',
        data: createFitnessData()
      })
    );
  }),
  
  rest.get('https://api.wellness.com/health/dashboard', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(createDashboardData())
    );
  }),
  
  rest.get('https://api.wellness.com/health/insights', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        insights: [
          {
            type: 'correlation',
            domains: ['sleep', 'mental'],
            strength: 0.75,
            description: 'Your mental health score tends to be higher on days following good sleep.'
          },
          {
            type: 'correlation',
            domains: ['fitness', 'sleep'],
            strength: 0.65,
            description: 'Days with physical activity are associated with better sleep quality.'
          }
        ]
      })
    );
  }),
  
  // User endpoints
  rest.get('https://api.wellness.com/users/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'user-test-1',
        name: 'Test User',
        email: 'test@example.com',
        avatar: null
      })
    );
  }),
  
  rest.put('https://api.wellness.com/users/profile', (req, res, ctx) => {
    const { name } = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Profile updated successfully',
        user: {
          id: 'user-test-1',
          name: name || 'Test User',
          email: 'test@example.com',
          avatar: null
        }
      })
    );
  }),
  
  // API connections
  rest.post('https://api.wellness.com/users/connect/sahha', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Sahha.ai connected successfully',
        connections: {
          sahha: true
        }
      })
    );
  }),
  
  rest.post('https://api.wellness.com/users/connect/asleep', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Asleep.ai connected successfully',
        connections: {
          asleep: true
        }
      })
    );
  }),
  
  rest.post('https://api.wellness.com/users/connect/passio', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Passio.ai connected successfully',
        connections: {
          passio: true
        }
      })
    );
  }),
  
  rest.post('https://api.wellness.com/users/connect/strava', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Strava connected successfully',
        connections: {
          strava: true
        }
      })
    );
  })
);

// Start the server before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

export { server, rest };
