const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// User settings routes
router.get('/settings', userController.getSettings);
router.put('/settings', userController.updateSettings);

// User data integration routes
router.post('/connect/sahha', userController.connectSahha);
router.post('/connect/asleep', userController.connectAsleep);
router.post('/connect/passio', userController.connectPassio);
router.get('/connections', userController.getConnections);

module.exports = router;
