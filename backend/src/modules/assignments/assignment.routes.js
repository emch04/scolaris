// Import Express
const express = require("express");
// Création du routeur
const router = express.Router();
// Import contrôleurs
const { create, getAssignments } = require("./assignment.controller");
// Import middlewares
const authMiddleware = require("../../middlewares/auth.middleware");
// Routes
router.get("/", getAssignments);
router.post("/", authMiddleware, create);
// Export
module.exports = router;
