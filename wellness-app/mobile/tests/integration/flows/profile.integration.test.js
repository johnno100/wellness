import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ProfileScreen from '../../../src/screens/ProfileScreen';
import { updateUserSuccess } from '../../../src/redux/slices/authSlice';
import { createUserData } from '../../__fixtures__/healthData';

// Import the MSW server
import '../api/server';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('ProfileScreen Integration Tests', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        user: createUserData(),
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'test-token'
      }
    });
    
    // Mock navigation
    store.navigation = {
      navigate: jest.fn(),
      goBack: jest.fn()
    };
  });
  
  it('should render user profile data correctly', () => {
    const { getByText, getByDisplayValue } = render(
      <Provider store={store}>
        <ProfileScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByText('Profile')).toBeTruthy();
    expect(getByDisplayValue('Test User')).toBeTruthy();
    expect(getByDisplayValue('test@example.com')).toBeTruthy();
    expect(getByText('Save Changes')).toBeTruthy();
  });
  
  it('should update profile when form is submitted', async () => {
    const { getByText, getByDisplayValue } = render(
      <Provider store={store}>
        <ProfileScreen navigation={store.navigation} />
      </Provider>
    );
    
    const nameInput = getByDisplayValue('Test User');
    fireEvent.changeText(nameInput, 'Updated User');
    
    fireEvent.press(getByText('Save Changes'));
    
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'auth/updateUserStart'
      }));
      
      // Manually dispatch success since we're using a mock store
      store.dispatch(updateUserSuccess({
        ...createUserData(),
        name: 'Updated User'
      }));
    });
    
    expect(store.navigation.goBack).toHaveBeenCalled();
  });
  
  it('should show loading state during profile update', async () => {
    store = mockStore({
      auth: {
        user: createUserData(),
        isAuthenticated: true,
        loading: true,
        error: null,
        token: 'test-token'
      }
    });
    
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
  
  it('should show error message when update fails', async () => {
    store = mockStore({
      auth: {
        user: createUserData(),
        isAuthenticated: true,
        loading: false,
        error: 'Failed to update profile',
        token: 'test-token'
      }
    });
    
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByText('Failed to update profile')).toBeTruthy();
  });
  
  it('should navigate to connections screen when manage connections is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen navigation={store.navigation} />
      </Provider>
    );
    
    fireEvent.press(getByText('Manage API Connections'));
    
    expect(store.navigation.navigate).toHaveBeenCalledWith('Connections');
  });
  
  it('should log out user when logout button is pressed', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen navigation={store.navigation} />
      </Provider>
    );
    
    fireEvent.press(getByText('Logout'));
    
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'auth/logout'
      }));
    });
    
    expect(store.navigation.navigate).toHaveBeenCalledWith('Auth');
  });
});
