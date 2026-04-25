const express = require("express");
const router = express.Router();
const { 
  addTimetableEntry, 
  getClassroomTimetable, 
  updateTimetableEntry, 
  deleteTimetableEntry 
} = require("./timetable.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get("/classroom/:classroomId", authMiddleware, getClassroomTimetable);
router.post("/", authMiddleware, authorizeRoles(ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SUPER_ADMIN, ROLES.TEACHER), addTimetableEntry);
router.put("/:id", authMiddleware, authorizeRoles(ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SUPER_ADMIN, ROLES.TEACHER), updateTimetableEntry);
router.delete("/:id", authMiddleware, authorizeRoles(ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SUPER_ADMIN, ROLES.TEACHER), deleteTimetableEntry);

module.exports = router;
