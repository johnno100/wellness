import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginScreen from '../../../src/screens/LoginScreen';
import { loginSuccess } from '../../../src/redux/slices/authSlice';

// Import the MSW server
import '../api/server';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('LoginScreen Integration Tests', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        token: null
      }
    });
    
    // Mock navigation
    store.navigation = {
      navigate: jest.fn(),
      goBack: jest.fn()
    };
  });
  
  it('should render login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={store.navigation} />
      </Provider>
    );
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Don\'t have an account? Register')).toBeTruthy();
  });
  
  it('should show validation errors for empty fields', async () => {
    const { getByText, findByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={store.navigation} />
      </Provider>
    );
    
    fireEvent.press(getByText('Login'));
    
    expect(await findByText('Email is required')).toBeTruthy();
    expect(await findByText('Password is required')).toBeTruthy();
  });
  
  it('should navigate to register screen when register link is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={store.navigation} />
      </Provider>
    );
    
    fireEvent.press(getByText('Don\'t have an account? Register'));
    
    expect(store.navigation.navigate).toHaveBeenCalledWith('Register');
  });
  
  it('should dispatch login action and navigate to home on successful login', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={store.navigation} />
      </Provider>
    );
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'auth/loginStart'
      }));
      
      // Manually dispatch success since we're using a mock store
      store.dispatch(loginSuccess({
        user: {
          id: 'user-test-1',
          name: 'Test User',
          email: 'test@example.com'
        },
        token: 'test-token'
      }));
      
      expect(store.navigation.navigate).toHaveBeenCalledWith('Main');
    });
  });
});
