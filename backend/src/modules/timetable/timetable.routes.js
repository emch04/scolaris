const express = require("express");
const router = express.Router();
const { addTimetableEntry, getClassroomTimetable, deleteTimetableEntry } = require("./timetable.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");

router.get("/classroom/:classroomId", authMiddleware, getClassroomTimetable);
router.post("/", authMiddleware, authorizeRoles("admin", "director", "super_admin"), addTimetableEntry);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "director", "super_admin"), deleteTimetableEntry);

module.exports = router;
