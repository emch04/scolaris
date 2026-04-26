/**
 * @module Auth/Routes
 * @description Définition des routes d'authentification.
 */

const express = require("express");
const router = express.Router();
const { register, login, logout, getMe, refresh, requestPasswordReset, executePasswordReset } = require("./auth.controller");
const { registerValidator, loginValidator } = require("./auth.validator");
const validateMiddleware = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const featureGuard = require("../../middlewares/featureGuard");

/**
 * Inscription protégée par l'interrupteur "public_registration"
 */
router.post("/register", featureGuard("public_registration"), registerValidator, validateMiddleware, register);

router.post("/login", loginValidator, validateMiddleware, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", authMiddleware, getMe);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", executePasswordReset);

module.exports = router;
