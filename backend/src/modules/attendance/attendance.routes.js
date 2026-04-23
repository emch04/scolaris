const express = require("express");
const router = express.Router();
const { markAttendance, getStudentAttendance, getClassroomAttendance } = require("./attendance.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");

// Seuls les enseignants et admins peuvent marquer les présences
router.post("/", authMiddleware, authorizeRoles("teacher", "admin", "director", "super_admin"), markAttendance);

// Voir les présences d'une classe
router.get("/classroom/:classroomId", authMiddleware, getClassroomAttendance);

// Voir les présences d'un élève
router.get("/student/:studentId", authMiddleware, getStudentAttendance);

module.exports = router;
