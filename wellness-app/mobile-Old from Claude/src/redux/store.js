import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from './rootReducer';
import { apiMiddleware } from '../services/api/middleware';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'health', 'settings'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk, apiMiddleware];

if (__DEV__) {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(middlewares),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);