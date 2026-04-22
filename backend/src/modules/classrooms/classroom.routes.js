// Import Express
const express = require("express");
// Création du routeur
const router = express.Router();
// Import contrôleurs
const { create, getClassrooms } = require("./classroom.controller");
// Import middleware auth
const authMiddleware = require("../../middlewares/auth.middleware");
// Routes protégées
router.get("/", authMiddleware, getClassrooms);
router.post("/", authMiddleware, create);
// Export
module.exports = router;
