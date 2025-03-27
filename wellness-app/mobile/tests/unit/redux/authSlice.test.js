import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  clearError
} from '../../../src/redux/slices/authSlice';
import { createUserData } from '../../__fixtures__/healthData';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: null
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('login actions', () => {
    it('should handle loginStart', () => {
      const nextState = authReducer(initialState, loginStart());
      expect(nextState).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle loginSuccess', () => {
      const user = createUserData();
      const token = 'test-token';
      const nextState = authReducer(
        { ...initialState, loading: true },
        loginSuccess({ user, token })
      );
      expect(nextState).toEqual({
        ...initialState,
        loading: false,
        isAuthenticated: true,
        user,
        token
      });
    });

    it('should handle loginFailure', () => {
      const error = 'Invalid credentials';
      const nextState = authReducer(
        { ...initialState, loading: true },
        loginFailure(error)
      );
      expect(nextState).toEqual({
        ...initialState,
        loading: false,
        error
      });
    });

    it('should handle logout', () => {
      const loggedInState = {
        user: createUserData(),
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'test-token'
      };
      const nextState = authReducer(loggedInState, logout());
      expect(nextState).toEqual({
        ...loggedInState,
        isAuthenticated: false,
        user: null,
        token: null
      });
    });
  });

  describe('update user actions', () => {
    const loggedInState = {
      user: createUserData(),
      isAuthenticated: true,
      loading: false,
      error: null,
      token: 'test-token'
    };

    it('should handle updateUserStart', () => {
      const nextState = authReducer(loggedInState, updateUserStart());
      expect(nextState).toEqual({
        ...loggedInState,
        loading: true,
        error: null
      });
    });

    it('should handle updateUserSuccess', () => {
      const updatedUser = createUserData({ name: 'Updated Name' });
      const nextState = authReducer(
        { ...loggedInState, loading: true },
        updateUserSuccess(updatedUser)
      );
      expect(nextState).toEqual({
        ...loggedInState,
        loading: false,
        user: updatedUser
      });
    });

    it('should handle updateUserFailure', () => {
      const error = 'Update failed';
      const nextState = authReducer(
        { ...loggedInState, loading: true },
        updateUserFailure(error)
      );
      expect(nextState).toEqual({
        ...loggedInState,
        loading: false,
        error
      });
    });
  });

  it('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error'
    };
    const nextState = authReducer(stateWithError, clearError());
    expect(nextState).toEqual({
      ...stateWithError,
      error: null
    });
  });
});
