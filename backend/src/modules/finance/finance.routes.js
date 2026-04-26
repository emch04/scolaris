const express = require('express');
const router = express.Router();
const { createFee, getFees, recordPayment, getPayments, paySalary, getTreasuryStats } = require('./finance.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/auth.middleware');
const featureGuard = require('../../middlewares/featureGuard');
const ROLES = require('../../constants/roles');

router.use(authMiddleware);

const FINANCE_STAFF = [ROLES.HERO_ADMIN, ROLES.DIRECTOR, ROLES.ADMIN, ROLES.SECRETARY];

// Ajout du featureGuard sur la trésorerie si nécessaire
router.get('/treasury', authorizeRoles(...FINANCE_STAFF), getTreasuryStats);
router.get('/payments', authorizeRoles(...FINANCE_STAFF), getPayments);
router.get('/fees-list', authorizeRoles(...FINANCE_STAFF), getFees);

// Les actions d'écriture peuvent être bloquées globalement si besoin
router.post('/fees', authorizeRoles(ROLES.HERO_ADMIN, ROLES.DIRECTOR, ROLES.ADMIN), createFee);
router.post('/payments', authorizeRoles(ROLES.HERO_ADMIN, ROLES.ADMIN, ROLES.SECRETARY), recordPayment);
router.post('/salaries', authorizeRoles(ROLES.HERO_ADMIN, ROLES.DIRECTOR, ROLES.ADMIN), paySalary);

module.exports = router;
