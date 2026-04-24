// Import d'Express
const express = require("express");
// Création du routeur
const router = express.Router();
// Import des contrôleurs
const { register, login, logout, getMe, refresh, requestPasswordReset, executePasswordReset } = require("./auth.controller");
// Import des validateurs
const { registerValidator, loginValidator } = require("./auth.validator");
// Import des middlewares
const validateMiddleware = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

// Route pour inscrire un enseignant
router.post("/register", registerValidator, validateMiddleware, register);

// Route pour connecter un utilisateur
router.post("/login", loginValidator, validateMiddleware, login);

// Route pour déconnecter (efface le cookie)
router.post("/logout", logout);

// Route pour rafraîchir la session
router.post("/refresh", refresh);

// Route pour vérifier la session actuelle
router.get("/me", authMiddleware, getMe);

// Route pour demander la réinitialisation
router.post("/forgot-password", requestPasswordReset);

// Route pour exécuter la réinitialisation
router.post("/reset-password", executePasswordReset);

// Export du routeur
module.exports = router;