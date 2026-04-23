const express = require("express");
const router = express.Router();
const { addCoursePlan, getCoursePlans } = require("./courseplan.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");

router.get("/classroom/:classroomId", authMiddleware, authorizeRoles("teacher", "parent", "student", "director", "admin"), getCoursePlans);
router.post("/", authMiddleware, authorizeRoles("teacher"), addCoursePlan);

module.exports = router;
