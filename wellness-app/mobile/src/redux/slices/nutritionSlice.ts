import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NutritionState {
  foodEntries: any[];
  dailyCalories: number | null;
  dailyNutrients: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: NutritionState = {
  foodEntries: [],
  dailyCalories: null,
  dailyNutrients: null,
  loading: false,
  error: null,
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    fetchNutritionDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNutritionDataSuccess: (
      state,
      action: PayloadAction<{
        foodEntries: any[];
        dailyCalories: number;
        dailyNutrients: any;
      }>
    ) => {
      state.foodEntries = action.payload.foodEntries;
      state.dailyCalories = action.payload.dailyCalories;
      state.dailyNutrients = action.payload.dailyNutrients;
      state.loading = false;
      state.error = null;
    },
    fetchNutritionDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addFoodEntry: (state, action: PayloadAction<any>) => {
      state.foodEntries = [action.payload, ...state.foodEntries];
      
      // Update daily calories and nutrients
      if (state.dailyCalories !== null) {
        state.dailyCalories += action.payload.calories || 0;
      }
      
      if (state.dailyNutrients) {
        const nutrients = action.payload.nutrients || {};
        state.dailyNutrients = {
          protein: (state.dailyNutrients.protein || 0) + (nutrients.protein || 0),
          carbs: (state.dailyNutrients.carbs || 0) + (nutrients.carbs || 0),
          fat: (state.dailyNutrients.fat || 0) + (nutrients.fat || 0),
          fiber: (state.dailyNutrients.fiber || 0) + (nutrients.fiber || 0),
          sugar: (state.dailyNutrients.sugar || 0) + (nutrients.sugar || 0),
        };
      }
    },
    removeFoodEntry: (state, action: PayloadAction<string>) => {
      const entryToRemove = state.foodEntries.find(entry => entry.id === action.payload);
      
      if (entryToRemove) {
        // Update daily calories and nutrients
        if (state.dailyCalories !== null) {
          state.dailyCalories -= entryToRemove.calories || 0;
        }
        
        if (state.dailyNutrients) {
          const nutrients = entryToRemove.nutrients || {};
          state.dailyNutrients = {
            protein: (state.dailyNutrients.protein || 0) - (nutrients.protein || 0),
            carbs: (state.dailyNutrients.carbs || 0) - (nutrients.carbs || 0),
            fat: (state.dailyNutrients.fat || 0) - (nutrients.fat || 0),
            fiber: (state.dailyNutrients.fiber || 0) - (nutrients.fiber || 0),
            sugar: (state.dailyNutrients.sugar || 0) - (nutrients.sugar || 0),
          };
        }
      }
      
      state.foodEntries = state.foodEntries.filter(entry => entry.id !== action.payload);
    },
    clearNutritionData: (state) => {
      state.foodEntries = [];
      state.dailyCalories = null;
      state.dailyNutrients = null;
    },
  },
});

export const {
  fetchNutritionDataStart,
  fetchNutritionDataSuccess,
  fetchNutritionDataFailure,
  addFoodEntry,
  removeFoodEntry,
  clearNutritionData,
} = nutritionSlice.actions;

export default nutritionSlice.reducer;
