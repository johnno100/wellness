import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectionsScreen from '../../../src/screens/ConnectionsScreen';
import { createConnectionsData } from '../../__fixtures__/healthData';

// Import the MSW server
import '../api/server';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('ConnectionsScreen Integration Tests', () => {
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
      connections: {
        data: createConnectionsData(),
        loading: false,
        error: null
      }
    });
    
    // Mock navigation
    store.navigation = {
      navigate: jest.fn(),
      goBack: jest.fn()
    };
  });
  
  it('should render connections data correctly', () => {
    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <ConnectionsScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByText('API Connections')).toBeTruthy();
    expect(getByText('Sahha.ai')).toBeTruthy();
    expect(getByText('Asleep.ai')).toBeTruthy();
    expect(getByText('Passio.ai')).toBeTruthy();
    expect(getByText('Strava')).toBeTruthy();
    
    // All connections are active in our test data
    expect(getAllByText('Connected').length).toBe(4);
  });
  
  it('should show loading state during connections fetch', async () => {
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
      connections: {
        data: null,
        loading: true,
        error: null
      }
    });
    
    const { getByTestId } = render(
      <Provider store={store}>
        <ConnectionsScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
  
  it('should connect to Sahha.ai when connect button is pressed', async () => {
    // Create a store with Sahha disconnected
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
      connections: {
        data: {
          ...createConnectionsData(),
          sahha: false,
          sahhaToken: null
        },
        loading: false,
        error: null
      }
    });
    
    const { getByText } = render(
      <Provider store={store}>
        <ConnectionsScreen navigation={store.navigation} />
      </Provider>
    );
    
    // Find the connect button for Sahha
    const connectButton = getByText('Connect');
    fireEvent.press(connectButton);
    
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'connections/connectSahhaStart'
      }));
    });
  });
  
  it('should disconnect from Strava when disconnect button is pressed', async () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <ConnectionsScreen navigation={store.navigation} />
      </Provider>
    );
    
    // Find the disconnect button for Strava (last in the list)
    const disconnectButtons = getAllByText('Disconnect');
    fireEvent.press(disconnectButtons[3]); // Strava is the 4th item
    
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'connections/disconnectStravaStart'
      }));
    });
  });
  
  it('should show error message when connection fails', async () => {
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
      connections: {
        data: createConnectionsData(),
        loading: false,
        error: 'Failed to connect to API'
      }
    });
    
    const { getByText } = render(
      <Provider store={store}>
        <ConnectionsScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByText('Failed to connect to API')).toBeTruthy();
  });
  
  it('should navigate back when back button is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ConnectionsScreen navigation={store.navigation} />
      </Provider>
    );
    
    fireEvent.press(getByTestId('back-button'));
    
    expect(store.navigation.goBack).toHaveBeenCalled();
  });
});
