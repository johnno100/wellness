import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import healthReducer from './slices/healthSlice';
import mentalHealthReducer from './slices/mentalHealthSlice';
import sleepReducer from './slices/sleepSlice';
import nutritionReducer from './slices/nutritionSlice';
import fitnessReducer from './slices/fitnessSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'health', 'mentalHealth', 'sleep', 'nutrition', 'fitness'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  health: healthReducer,
  mentalHealth: mentalHealthReducer,
  sleep: sleepReducer,
  nutrition: nutritionReducer,
  fitness: fitnessReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
