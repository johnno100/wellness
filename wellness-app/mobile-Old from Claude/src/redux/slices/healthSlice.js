// src/redux/slices/healthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { healthService } from '../../services/health';

export const fetchDashboardData = createAsyncThunk(
  'health/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await healthService.getDashboardData();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncMentalHealthData = createAsyncThunk(
  'health/syncMentalHealth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await healthService.syncMentalHealthData();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncSleepData = createAsyncThunk(
  'health/syncSleep',
  async (_, { rejectWithValue }) => {
    try {
      const data = await healthService.syncSleepData();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncNutritionData = createAsyncThunk(
  'health/syncNutrition',
  async (_, { rejectWithValue }) => {
    try {
      const data = await healthService.syncNutritionData();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncFitnessData = createAsyncThunk(
  'health/syncFitness',
  async (_, { rejectWithValue }) => {
    try {
      const data = await healthService.syncFitnessData();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  dashboard: {
    mental: null,
    sleep: null,
    nutrition: null,
    fitness: null,
    overall_wellness_score: 0,
  },
  insights: [],
  loading: {
    dashboard: false,
    mental: false,
    sleep: false,
    nutrition: false,
    fitness: false,
  },
  error: null,
  lastSync: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    resetHealthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading.dashboard = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.loading.dashboard = false;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error = action.payload;
      })
      .addCase(syncMentalHealthData.pending, (state) => {
        state.loading.mental = true;
      })
      .addCase(syncMentalHealthData.fulfilled, (state, action) => {
        state.dashboard.mental = action.payload;
        state.loading.mental = false;
      })
      .addCase(syncMentalHealthData.rejected, (state, action) => {
        state.loading.mental = false;
        state.error = action.payload;
      })
      .addCase(syncSleepData.pending, (state) => {
        state.loading.sleep = true;
      })
      .addCase(syncSleepData.fulfilled, (state, action) => {
        state.dashboard.sleep = action.payload;
        state.loading.sleep = false;
      })
      .addCase(syncSleepData.rejected, (state, action) => {
        state.loading.sleep = false;
        state.error = action.payload;
      })
      .addCase(syncNutritionData.pending, (state) => {
        state.loading.nutrition = true;
      })
      .addCase(syncNutritionData.fulfilled, (state, action) => {
        state.dashboard.nutrition = action.payload;
        state.loading.nutrition = false;
      })
      .addCase(syncNutritionData.rejected, (state, action) => {
        state.loading.nutrition = false;
        state.error = action.payload;
      })
      .addCase(syncFitnessData.pending, (state) => {
        state.loading.fitness = true;
      })
      .addCase(syncFitnessData.fulfilled, (state, action) => {
        state.dashboard.fitness = action.payload;
        state.loading.fitness = false;
      })
      .addCase(syncFitnessData.rejected, (state, action) => {
        state.loading.fitness = false;
        state.error = action.payload;
      });
  },
});

export const { resetHealthError } = healthSlice.actions;
export default healthSlice.reducer;

