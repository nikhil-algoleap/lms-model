const express = require('express');
const router = express.Router();
const multer = require('multer');
const importController = require('../controllers/import.controller');

// Use memory storage so we can parse the buffer directly with xlsx
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/leads', upload.single('file'), importController.bulkImportLeads);

module.exports = router;
