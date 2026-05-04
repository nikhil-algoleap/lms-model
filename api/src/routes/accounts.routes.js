const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts.controller');

// All routes are protected by auth middleware in app.js
router.get('/', accountsController.getAllAccounts);
router.get('/:id', accountsController.getAccountById);
router.post('/', accountsController.createAccount);
router.put('/:id', accountsController.updateAccount);
router.delete('/:id', accountsController.deleteAccount);

module.exports = router;
