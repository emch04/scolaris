const express = require('express');
const router = express.Router();
const { getConfigs, toggleFeature } = require('./config.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/auth.middleware');
const ROLES = require('../../constants/roles');

// Accès réservé au HERO_ADMIN
router.get('/', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), getConfigs);
router.patch('/:key', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), toggleFeature);

module.exports = router;
