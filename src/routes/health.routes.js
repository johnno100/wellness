const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// Mental health routes (Sahha.ai)
router.get('/mental', healthController.getMentalHealthData);
router.post('/mental/sync', healthController.syncMentalHealthData);

// Sleep routes (Asleep.ai)
router.get('/sleep', healthController.getSleepData);
router.post('/sleep/sync', healthController.syncSleepData);

// Nutrition routes (Passio.ai)
router.get('/nutrition', healthController.getNutritionData);
router.post('/nutrition/sync', healthController.syncNutritionData);
router.post('/nutrition/log', healthController.logMeal);

// Fitness routes (Strava)
router.get('/fitness', healthController.getFitnessData);
router.post('/fitness/sync', healthController.syncFitnessData);

// Aggregated health data
router.get('/dashboard', healthController.getDashboardData);
router.get('/insights', healthController.getHealthInsights);

module.exports = router;
