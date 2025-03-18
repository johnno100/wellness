import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import healthReducer from './slices/healthSlice';
import settingsReducer from './slices/settingsSlice';
import { apiSlice } from '../services/api/apiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  health: healthReducer,
  settings: settingsReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;