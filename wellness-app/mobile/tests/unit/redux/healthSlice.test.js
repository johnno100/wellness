import healthReducer, {
  fetchMentalHealthStart,
  fetchMentalHealthSuccess,
  fetchMentalHealthFailure,
  fetchSleepStart,
  fetchSleepSuccess,
  fetchSleepFailure,
  fetchNutritionStart,
  fetchNutritionSuccess,
  fetchNutritionFailure,
  fetchFitnessStart,
  fetchFitnessSuccess,
  fetchFitnessFailure,
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  fetchInsightsStart,
  fetchInsightsSuccess,
  fetchInsightsFailure
} from '../../../src/redux/slices/healthSlice';
import { 
  createMentalHealthData, 
  createSleepData, 
  createNutritionData, 
  createFitnessData,
  createDashboardData
} from '../../__fixtures__/healthData';

describe('Health Slice', () => {
  const initialState = {
    mentalHealth: {
      data: [],
      loading: false,
      error: null
    },
    sleep: {
      data: [],
      loading: false,
      error: null
    },
    nutrition: {
      data: [],
      loading: false,
      error: null
    },
    fitness: {
      data: [],
      loading: false,
      error: null
    },
    dashboard: {
      data: null,
      loading: false,
      error: null
    },
    insights: {
      data: [],
      loading: false,
      error: null
    }
  };

  it('should return the initial state', () => {
    expect(healthReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('mental health actions', () => {
    it('should handle fetchMentalHealthStart', () => {
      const nextState = healthReducer(initialState, fetchMentalHealthStart());
      expect(nextState.mentalHealth.loading).toBe(true);
      expect(nextState.mentalHealth.error).toBeNull();
    });

    it('should handle fetchMentalHealthSuccess', () => {
      const mentalHealthData = [createMentalHealthData()];
      const nextState = healthReducer(
        { ...initialState, mentalHealth: { ...initialState.mentalHealth, loading: true } },
        fetchMentalHealthSuccess(mentalHealthData)
      );
      expect(nextState.mentalHealth.loading).toBe(false);
      expect(nextState.mentalHealth.data).toEqual(mentalHealthData);
    });

    it('should handle fetchMentalHealthFailure', () => {
      const error = 'Failed to fetch mental health data';
      const nextState = healthReducer(
        { ...initialState, mentalHealth: { ...initialState.mentalHealth, loading: true } },
        fetchMentalHealthFailure(error)
      );
      expect(nextState.mentalHealth.loading).toBe(false);
      expect(nextState.mentalHealth.error).toEqual(error);
    });
  });

  describe('sleep actions', () => {
    it('should handle fetchSleepStart', () => {
      const nextState = healthReducer(initialState, fetchSleepStart());
      expect(nextState.sleep.loading).toBe(true);
      expect(nextState.sleep.error).toBeNull();
    });

    it('should handle fetchSleepSuccess', () => {
      const sleepData = [createSleepData()];
      const nextState = healthReducer(
        { ...initialState, sleep: { ...initialState.sleep, loading: true } },
        fetchSleepSuccess(sleepData)
      );
      expect(nextState.sleep.loading).toBe(false);
      expect(nextState.sleep.data).toEqual(sleepData);
    });

    it('should handle fetchSleepFailure', () => {
      const error = 'Failed to fetch sleep data';
      const nextState = healthReducer(
        { ...initialState, sleep: { ...initialState.sleep, loading: true } },
        fetchSleepFailure(error)
      );
      expect(nextState.sleep.loading).toBe(false);
      expect(nextState.sleep.error).toEqual(error);
    });
  });

  describe('nutrition actions', () => {
    it('should handle fetchNutritionStart', () => {
      const nextState = healthReducer(initialState, fetchNutritionStart());
      expect(nextState.nutrition.loading).toBe(true);
      expect(nextState.nutrition.error).toBeNull();
    });

    it('should handle fetchNutritionSuccess', () => {
      const nutritionData = [createNutritionData()];
      const nextState = healthReducer(
        { ...initialState, nutrition: { ...initialState.nutrition, loading: true } },
        fetchNutritionSuccess(nutritionData)
      );
      expect(nextState.nutrition.loading).toBe(false);
      expect(nextState.nutrition.data).toEqual(nutritionData);
    });

    it('should handle fetchNutritionFailure', () => {
      const error = 'Failed to fetch nutrition data';
      const nextState = healthReducer(
        { ...initialState, nutrition: { ...initialState.nutrition, loading: true } },
        fetchNutritionFailure(error)
      );
      expect(nextState.nutrition.loading).toBe(false);
      expect(nextState.nutrition.error).toEqual(error);
    });
  });

  describe('fitness actions', () => {
    it('should handle fetchFitnessStart', () => {
      const nextState = healthReducer(initialState, fetchFitnessStart());
      expect(nextState.fitness.loading).toBe(true);
      expect(nextState.fitness.error).toBeNull();
    });

    it('should handle fetchFitnessSuccess', () => {
      const fitnessData = [createFitnessData()];
      const nextState = healthReducer(
        { ...initialState, fitness: { ...initialState.fitness, loading: true } },
        fetchFitnessSuccess(fitnessData)
      );
      expect(nextState.fitness.loading).toBe(false);
      expect(nextState.fitness.data).toEqual(fitnessData);
    });

    it('should handle fetchFitnessFailure', () => {
      const error = 'Failed to fetch fitness data';
      const nextState = healthReducer(
        { ...initialState, fitness: { ...initialState.fitness, loading: true } },
        fetchFitnessFailure(error)
      );
      expect(nextState.fitness.loading).toBe(false);
      expect(nextState.fitness.error).toEqual(error);
    });
  });

  describe('dashboard actions', () => {
    it('should handle fetchDashboardStart', () => {
      const nextState = healthReducer(initialState, fetchDashboardStart());
      expect(nextState.dashboard.loading).toBe(true);
      expect(nextState.dashboard.error).toBeNull();
    });

    it('should handle fetchDashboardSuccess', () => {
      const dashboardData = createDashboardData();
      const nextState = healthReducer(
        { ...initialState, dashboard: { ...initialState.dashboard, loading: true } },
        fetchDashboardSuccess(dashboardData)
      );
      expect(nextState.dashboard.loading).toBe(false);
      expect(nextState.dashboard.data).toEqual(dashboardData);
    });

    it('should handle fetchDashboardFailure', () => {
      const error = 'Failed to fetch dashboard data';
      const nextState = healthReducer(
        { ...initialState, dashboard: { ...initialState.dashboard, loading: true } },
        fetchDashboardFailure(error)
      );
      expect(nextState.dashboard.loading).toBe(false);
      expect(nextState.dashboard.error).toEqual(error);
    });
  });

  describe('insights actions', () => {
    it('should handle fetchInsightsStart', () => {
      const nextState = healthReducer(initialState, fetchInsightsStart());
      expect(nextState.insights.loading).toBe(true);
      expect(nextState.insights.error).toBeNull();
    });

    it('should handle fetchInsightsSuccess', () => {
      const insightsData = [
        { type: 'correlation', domains: ['sleep', 'mental'], strength: 0.75, description: 'Better sleep correlates with improved mental health' }
      ];
      const nextState = healthReducer(
        { ...initialState, insights: { ...initialState.insights, loading: true } },
        fetchInsightsSuccess(insightsData)
      );
      expect(nextState.insights.loading).toBe(false);
      expect(nextState.insights.data).toEqual(insightsData);
    });

    it('should handle fetchInsightsFailure', () => {
      const error = 'Failed to fetch insights data';
      const nextState = healthReducer(
        { ...initialState, insights: { ...initialState.insights, loading: true } },
        fetchInsightsFailure(error)
      );
      expect(nextState.insights.loading).toBe(false);
      expect(nextState.insights.error).toEqual(error);
    });
  });
});
