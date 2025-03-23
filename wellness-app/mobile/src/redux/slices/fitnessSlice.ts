import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FitnessState {
  activities: any[];
  dailySteps: number | null;
  weeklyDistance: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: FitnessState = {
  activities: [],
  dailySteps: null,
  weeklyDistance: null,
  loading: false,
  error: null,
};

const fitnessSlice = createSlice({
  name: 'fitness',
  initialState,
  reducers: {
    fetchFitnessDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFitnessDataSuccess: (
      state,
      action: PayloadAction<{
        activities: any[];
        dailySteps: number;
        weeklyDistance: number;
      }>
    ) => {
      state.activities = action.payload.activities;
      state.dailySteps = action.payload.dailySteps;
      state.weeklyDistance = action.payload.weeklyDistance;
      state.loading = false;
      state.error = null;
    },
    fetchFitnessDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addActivity: (state, action: PayloadAction<any>) => {
      state.activities = [action.payload, ...state.activities];
      
      // Update daily steps if applicable
      if (state.dailySteps !== null && action.payload.steps) {
        state.dailySteps += action.payload.steps;
      }
      
      // Update weekly distance if applicable
      if (state.weeklyDistance !== null && action.payload.distance) {
        state.weeklyDistance += action.payload.distance;
      }
    },
    updateActivity: (state, action: PayloadAction<any>) => {
      const index = state.activities.findIndex(activity => activity.id === action.payload.id);
      if (index !== -1) {
        state.activities[index] = action.payload;
      }
    },
    clearFitnessData: (state) => {
      state.activities = [];
      state.dailySteps = null;
      state.weeklyDistance = null;
    },
  },
});

export const {
  fetchFitnessDataStart,
  fetchFitnessDataSuccess,
  fetchFitnessDataFailure,
  addActivity,
  updateActivity,
  clearFitnessData,
} = fitnessSlice.actions;

export default fitnessSlice.reducer;
