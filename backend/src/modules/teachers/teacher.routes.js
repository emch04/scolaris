// Import Express
const express = require("express");
// Création routeur
const router = express.Router();
// Import contrôleur
const { getTeachers, getTeacher, updateTeacher, deleteTeacher } = require("./teacher.controller");
// Import auth
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

// Route protégée
router.get("/", authMiddleware, getTeachers);
router.get("/:id", authMiddleware, getTeacher);
router.put("/:id", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN, ROLES.DIRECTOR), updateTeacher);
router.delete("/:id", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN, ROLES.DIRECTOR), deleteTeacher);

// Export
module.exports = router;
