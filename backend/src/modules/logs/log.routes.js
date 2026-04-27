const express = require('express');
const router = express.Router();
const { reportError, getLogs, clearLogs, resolveLog } = require('./log.controller');
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
router.patch('/:id/resolve', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), resolveLog);
router.delete('/clear', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), clearLogs);

module.exports = router;
