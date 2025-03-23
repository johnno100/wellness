import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SleepState {
  sleepSessions: any[];
  currentSession: any | null;
  sleepScore: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: SleepState = {
  sleepSessions: [],
  currentSession: null,
  sleepScore: null,
  loading: false,
  error: null,
};

const sleepSlice = createSlice({
  name: 'sleep',
  initialState,
  reducers: {
    fetchSleepDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSleepDataSuccess: (
      state,
      action: PayloadAction<{
        sleepSessions: any[];
        sleepScore: number;
      }>
    ) => {
      state.sleepSessions = action.payload.sleepSessions;
      state.sleepScore = action.payload.sleepScore;
      state.loading = false;
      state.error = null;
    },
    fetchSleepDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    startSleepSession: (state) => {
      state.currentSession = {
        startTime: new Date().toISOString(),
        status: 'tracking',
      };
    },
    stopSleepSession: (state) => {
      if (state.currentSession) {
        state.currentSession = {
          ...state.currentSession,
          endTime: new Date().toISOString(),
          status: 'processing',
        };
      }
    },
    updateSleepSession: (state, action: PayloadAction<any>) => {
      state.currentSession = action.payload;
    },
    addSleepSession: (state, action: PayloadAction<any>) => {
      state.sleepSessions = [action.payload, ...state.sleepSessions];
      state.currentSession = null;
    },
    clearSleepData: (state) => {
      state.sleepSessions = [];
      state.currentSession = null;
      state.sleepScore = null;
    },
  },
});

export const {
  fetchSleepDataStart,
  fetchSleepDataSuccess,
  fetchSleepDataFailure,
  startSleepSession,
  stopSleepSession,
  updateSleepSession,
  addSleepSession,
  clearSleepData,
} = sleepSlice.actions;

export default sleepSlice.reducer;
