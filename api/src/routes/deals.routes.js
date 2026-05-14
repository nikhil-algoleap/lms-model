const express = require('express');
const router = express.Router();
const dealsController = require('../controllers/deals.controller');
const authenticateToken = require('../middleware/auth.middleware');
const { upload } = require('../utils/upload');

router.use(authenticateToken); // Protect all deal routes

router.get('/pipeline', dealsController.getUnifiedPipeline);
router.get('/forecast', dealsController.getForecast);
router.get('/:id', dealsController.getDealById);
router.put('/:id', dealsController.updateDeal);
router.post('/convert/:id', dealsController.convertLead);
router.post('/:id/stage', dealsController.updateStage);
router.post('/:id/stakeholders', dealsController.addStakeholder);
router.post('/:id/competitors', dealsController.addCompetitor);
router.post('/:id/documents', upload.single('file'), dealsController.uploadDocument);

module.exports = router;
