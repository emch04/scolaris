// Import Express
const express = require("express");
// Création du routeur
const router = express.Router();
// Import des contrôleurs
const { create, getStudents } = require("./student.controller");
// Import des middlewares
const authMiddleware = require("../../middlewares/auth.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware");
// Import des validateurs
const { createStudentValidator } = require("./student.validator");
// Route protégée : créer un élève
router.post("/", authMiddleware, createStudentValidator, validateMiddleware, create);
// Route protégée : voir les élèves
router.get("/", authMiddleware, getStudents);
// Export
module.exports = router;
