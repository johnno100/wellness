import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MentalHealthState {
  mentalHealthScore: number | null;
  stressLevel: number | null;
  anxietyLevel: number | null;
  moodHistory: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MentalHealthState = {
  mentalHealthScore: null,
  stressLevel: null,
  anxietyLevel: null,
  moodHistory: [],
  loading: false,
  error: null,
};

const mentalHealthSlice = createSlice({
  name: 'mentalHealth',
  initialState,
  reducers: {
    fetchMentalHealthDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMentalHealthDataSuccess: (
      state,
      action: PayloadAction<{
        mentalHealthScore: number;
        stressLevel: number;
        anxietyLevel: number;
        moodHistory: any[];
      }>
    ) => {
      state.mentalHealthScore = action.payload.mentalHealthScore;
      state.stressLevel = action.payload.stressLevel;
      state.anxietyLevel = action.payload.anxietyLevel;
      state.moodHistory = action.payload.moodHistory;
      state.loading = false;
      state.error = null;
    },
    fetchMentalHealthDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMoodHistory: (state, action: PayloadAction<any>) => {
      state.moodHistory = [...state.moodHistory, action.payload];
    },
    clearMentalHealthData: (state) => {
      state.mentalHealthScore = null;
      state.stressLevel = null;
      state.anxietyLevel = null;
      state.moodHistory = [];
    },
  },
});

export const {
  fetchMentalHealthDataStart,
  fetchMentalHealthDataSuccess,
  fetchMentalHealthDataFailure,
  updateMoodHistory,
  clearMentalHealthData,
} = mentalHealthSlice.actions;

export default mentalHealthSlice.reducer;
