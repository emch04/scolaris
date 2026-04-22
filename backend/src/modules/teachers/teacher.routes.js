// Import Express
const express = require("express");
// Création routeur
const router = express.Router();
// Import contrôleur
const { getTeachers } = require("./teacher.controller");
// Import auth
const authMiddleware = require("../../middlewares/auth.middleware");
// Route protégée
router.get("/", authMiddleware, getTeachers);
// Export
module.exports = router;
