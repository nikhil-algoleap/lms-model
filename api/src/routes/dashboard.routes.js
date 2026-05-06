const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/stats', dashboardController.getStats);
router.get('/activity', dashboardController.getRecentActivity);

module.exports = router;
