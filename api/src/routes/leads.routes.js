const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

const validate = require('../middleware/validate.middleware');
const { leadSchema } = require('../schemas/lead.schema');

router.get('/converted', leadsController.getConvertedLeads);
router.get('/', leadsController.getAllLeads);
router.post('/', validate(leadSchema), leadsController.createLead);
router.get('/:id', leadsController.getLeadById);
router.put('/:id', validate(leadSchema.partial()), leadsController.updateLead);
router.put('/:id/status', leadsController.updateLeadStatus);

module.exports = router;
