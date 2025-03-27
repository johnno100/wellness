import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DashboardScreen from '../../../src/screens/DashboardScreen';
import { fetchDashboardSuccess } from '../../../src/redux/slices/healthSlice';
import { createDashboardData } from '../../__fixtures__/healthData';

// Import the MSW server
import '../api/server';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('DashboardScreen Integration Tests', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          id: 'user-test-1',
          name: 'Test User',
          email: 'test@example.com'
        },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'test-token'
      },
      health: {
        dashboard: {
          data: null,
          loading: false,
          error: null
        }
      }
    });
    
    // Mock navigation
    store.navigation = {
      navigate: jest.fn()
    };
  });
  
  it('should render loading state initially', () => {
    store = mockStore({
      auth: {
        user: {
          id: 'user-test-1',
          name: 'Test User',
          email: 'test@example.com'
        },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'test-token'
      },
      health: {
        dashboard: {
          data: null,
          loading: true,
          error: null
        }
      }
    });
    
    const { getByTestId } = render(
      <Provider store={store}>
        <DashboardScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
  
  it('should render dashboard data when available', async () => {
    const dashboardData = createDashboardData();
    
    // Manually dispatch success since we're using a mock store
    store.dispatch(fetchDashboardSuccess(dashboardData));
    
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <DashboardScreen navigation={store.navigation} />
      </Provider>
    );
    
    await waitFor(() => {
      expect(getByText('Wellness Score')).toBeTruthy();
      expect(getByTestId('wellness-score')).toHaveTextContent('88');
      expect(getByText('Mental Health')).toBeTruthy();
      expect(getByText('Sleep')).toBeTruthy();
      expect(getByText('Nutrition')).toBeTruthy();
      expect(getByText('Fitness')).toBeTruthy();
    });
  });
  
  it('should navigate to detail screens when cards are pressed', async () => {
    const dashboardData = createDashboardData();
    
    // Manually dispatch success since we're using a mock store
    store.dispatch(fetchDashboardSuccess(dashboardData));
    
    const { getByTestId } = render(
      <Provider store={store}>
        <DashboardScreen navigation={store.navigation} />
      </Provider>
    );
    
    await waitFor(() => {
      expect(getByTestId('mental-health-card')).toBeTruthy();
    });
    
    fireEvent.press(getByTestId('mental-health-card'));
    expect(store.navigation.navigate).toHaveBeenCalledWith('MentalHealthDetail');
    
    fireEvent.press(getByTestId('sleep-card'));
    expect(store.navigation.navigate).toHaveBeenCalledWith('SleepDetail');
    
    fireEvent.press(getByTestId('nutrition-card'));
    expect(store.navigation.navigate).toHaveBeenCalledWith('NutritionDetail');
    
    fireEvent.press(getByTestId('fitness-card'));
    expect(store.navigation.navigate).toHaveBeenCalledWith('FitnessDetail');
  });
  
  it('should show error state when there is an error', async () => {
    store = mockStore({
      auth: {
        user: {
          id: 'user-test-1',
          name: 'Test User',
          email: 'test@example.com'
        },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'test-token'
      },
      health: {
        dashboard: {
          data: null,
          loading: false,
          error: 'Failed to fetch dashboard data'
        }
      }
    });
    
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <DashboardScreen navigation={store.navigation} />
      </Provider>
    );
    
    await waitFor(() => {
      expect(getByText('Failed to fetch dashboard data')).toBeTruthy();
      expect(getByTestId('retry-button')).toBeTruthy();
    });
    
    fireEvent.press(getByTestId('retry-button'));
    
    const actions = store.getActions();
    expect(actions).toContainEqual(expect.objectContaining({
      type: 'health/fetchDashboardStart'
    }));
  });
});
