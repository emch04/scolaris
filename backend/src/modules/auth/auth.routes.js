// Import d'Express
const express = require("express");
// Création du routeur
const router = express.Router();
// Import des contrôleurs
const { register, login } = require("./auth.controller");
// Import des validateurs
const { registerValidator, loginValidator } = require("./auth.validator");
// Import du middleware de validation
const validateMiddleware = require("../../middlewares/validate.middleware");
// Route pour inscrire un enseignant
router.post("/register", registerValidator, validateMiddleware, register);
// Route pour connecter un enseignant
router.post("/login", loginValidator, validateMiddleware, login);
// Export du routeur
module.exports = router;
