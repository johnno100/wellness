// src/services/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';
import { getTokens } from '../../utils/auth';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL || 'http://localhost:3000/api',
    prepareHeaders: async (headers) => {
      const tokens = await getTokens();
      if (tokens?.accessToken) {
        headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Health'],
  endpoints: (builder) => ({
    // User endpoints
    getUser: builder.query({
      query: () => 'users/me',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: 'users/me',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Health endpoints
    getHealthDashboard: builder.query({
      query: () => 'health/dashboard',
      providesTags: ['Health'],
    }),
    getMentalHealth: builder.query({
      query: () => 'health/mental',
      providesTags: ['Health'],
    }),
    getSleepData: builder.query({
      query: () => 'health/sleep',
      providesTags: ['Health'],
    }),
    getNutritionData: builder.query({
      query: () => 'health/nutrition',
      providesTags: ['Health'],
    }),
    getFitnessData: builder.query({
      query: () => 'health/fitness',
      providesTags: ['Health'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useGetHealthDashboardQuery,
  useGetMentalHealthQuery,
  useGetSleepDataQuery,
  useGetNutritionDataQuery,
  useGetFitnessDataQuery,
} = apiSlice;

