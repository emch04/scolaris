const express = require('express');
const router = express.Router();
const { reportError, getLogs, clearLogs } = require('./log.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/auth.middleware');
const ROLES = require('../../constants/roles');

/**
 * Route publique pour rapporter les erreurs du frontend.
 */
router.post('/report', reportError);

/**
 * Routes EXCLUSIVES au HERO_ADMIN (Le Supérieur Ultime).
 */
router.get('/', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), getLogs);
router.delete('/clear', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), clearLogs);

module.exports = router;
