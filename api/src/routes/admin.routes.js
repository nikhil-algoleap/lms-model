const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// User Management
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id', adminController.updateUser);


// Role & Permission Management
router.get('/roles', adminController.getRoles);
router.post('/roles', adminController.createRole);
router.post('/roles/:id/permissions', adminController.updateRolePermissions);
router.get('/permissions', adminController.getPermissions);


module.exports = router;
