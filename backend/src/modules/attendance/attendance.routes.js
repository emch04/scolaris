/**
 * @module Attendance/Routes
 * @description Routes pour la gestion des présences.
 */

const express = require("express");
const router = express.Router();
const { markAttendance, getStudentAttendance, getClassroomAttendance } = require("./attendance.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");

/**
 * @route POST /api/attendance
 * @desc Enregistrer les présences pour une classe
 * @access Private (Teacher, Admin, Director, Super Admin)
 */
router.post("/", authMiddleware, authorizeRoles("teacher", "admin", "director", "super_admin"), markAttendance);

/**
 * @route GET /api/attendance/classroom/:classroomId
 * @desc Récupérer les présences d'une classe pour une date donnée
 * @access Private
 */
router.get("/classroom/:classroomId", authMiddleware, getClassroomAttendance);

/**
 * @route GET /api/attendance/student/:studentId
 * @desc Récupérer l'historique des présences d'un élève
 * @access Private
 */
router.get("/student/:studentId", authMiddleware, getStudentAttendance);

module.exports = router;
