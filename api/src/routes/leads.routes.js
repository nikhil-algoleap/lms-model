const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

const validate = require('../middleware/validate.middleware');
const { leadSchema } = require('../schemas/lead.schema');

router.get('/', leadsController.getAllLeads);
router.post('/', validate(leadSchema), leadsController.createLead);
router.get('/:id', leadsController.getLeadById);

module.exports = router;
