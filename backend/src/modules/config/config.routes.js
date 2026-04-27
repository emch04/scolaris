const express = require('express');
const router = express.Router();
const { getConfigs, toggleFeature, sendBlackBoxCommand, getBlackBoxLogs, clearBlackBoxLogs } = require('./config.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/auth.middleware');
const ROLES = require('../../constants/roles');

// Accès réservé au HERO_ADMIN
router.get('/', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), getConfigs);
router.get('/blackbox/report', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), getBlackBoxLogs);
router.delete('/blackbox/report', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), clearBlackBoxLogs);
router.patch('/:key', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), toggleFeature);
router.post('/blackbox/command', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), sendBlackBoxCommand);

module.exports = router;