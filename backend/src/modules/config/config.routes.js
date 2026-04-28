const express = require('express');
const router = express.Router();
const { getConfigs, toggleFeature, sendBlackBoxCommand, getBlackBoxLogs, clearBlackBoxLogs } = require('./config.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/auth.middleware');
const ROLES = require('../../constants/roles');

const ADMIN_STAFF = [ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY];

// Accès réservé au HERO_ADMIN pour la configuration globale
router.get('/', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), getConfigs);
router.patch('/:key', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), toggleFeature);

// Accès étendu aux "supérieurs" pour la BlackBox IA
router.get('/blackbox/report', authMiddleware, authorizeRoles(...ADMIN_STAFF), getBlackBoxLogs);
router.delete('/blackbox/report', authMiddleware, authorizeRoles(ROLES.HERO_ADMIN), clearBlackBoxLogs);
router.post('/blackbox/command', authMiddleware, authorizeRoles(...ADMIN_STAFF), sendBlackBoxCommand);

module.exports = router;