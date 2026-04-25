/**
 * @module Auth/Routes
 * @description Définition des routes d'authentification (Inscription, Connexion, Password Reset).
 */

const express = require("express");
const router = express.Router();
const { register, login, logout, getMe, refresh, requestPasswordReset, executePasswordReset } = require("./auth.controller");
const { registerValidator, loginValidator } = require("./auth.validator");
const validateMiddleware = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

/**
 * @route POST /api/auth/register
 * @desc Inscription d'un utilisateur (Enseignant, Parent ou Élève)
 * @access Public / Admin
 */
router.post("/register", registerValidator, validateMiddleware, register);

/**
 * @route POST /api/auth/login
 * @desc Connexion d'un utilisateur
 * @access Public
 */
router.post("/login", loginValidator, validateMiddleware, login);

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion et suppression des cookies
 * @access Public
 */
router.post("/logout", logout);

/**
 * @route POST /api/auth/refresh
 * @desc Renouvellement du token d'accès via le refresh token
 * @access Public (via cookie)
 */
router.post("/refresh", refresh);

/**
 * @route GET /api/auth/me
 * @desc Récupération des infos de l'utilisateur connecté
 * @access Privé (Authentifié)
 */
router.get("/me", authMiddleware, getMe);

/**
 * @route POST /api/auth/forgot-password
 * @desc Demande de réinitialisation de mot de passe (envoi OTP)
 * @access Public
 */
router.post("/forgot-password", requestPasswordReset);

/**
 * @route POST /api/auth/reset-password
 * @desc Réinitialisation effective du mot de passe
 * @access Public
 */
router.post("/reset-password", executePasswordReset);

module.exports = router;