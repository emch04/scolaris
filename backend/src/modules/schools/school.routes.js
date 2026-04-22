// Import Express
const express = require("express");
// Création du routeur
const router = express.Router();
// Import des contrôleurs
const { getSchools, create } = require("./school.controller");
// Import du middleware d'authentification
const authMiddleware = require("../../middlewares/auth.middleware");
// Route publique : voir les écoles
router.get("/", getSchools);
// Route protégée : créer une école
router.post("/", authMiddleware, create);
// Export
module.exports = router;
