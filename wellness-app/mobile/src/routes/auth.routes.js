const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// User registration and login
router.post('/register', authController.register);
router.post('/login', authController.login);

// OAuth routes for Strava
router.get('/strava', authController.stravaAuth);
router.get('/strava/callback', authController.stravaCallback);
router.post('/strava/refresh', authController.stravaRefreshToken);

module.exports = router;
