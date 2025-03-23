import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthState {
  biomarkers: any[];
  healthScores: any;
  loading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  biomarkers: [],
  healthScores: null,
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    fetchHealthDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchHealthDataSuccess: (state, action: PayloadAction<{ biomarkers: any[]; healthScores: any }>) => {
      state.biomarkers = action.payload.biomarkers;
      state.healthScores = action.payload.healthScores;
      state.loading = false;
      state.error = null;
    },
    fetchHealthDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearHealthData: (state) => {
      state.biomarkers = [];
      state.healthScores = null;
    },
  },
});

export const {
  fetchHealthDataStart,
  fetchHealthDataSuccess,
  fetchHealthDataFailure,
  clearHealthData,
} = healthSlice.actions;

export default healthSlice.reducer;
