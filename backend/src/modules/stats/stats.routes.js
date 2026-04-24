const express = require("express");
const router = express.Router();
const { getGlobalStats, getTeacherStats } = require("./stats.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get("/global", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN), getGlobalStats);
router.get("/teacher", authMiddleware, authorizeRoles("teacher", "admin", "director"), getTeacherStats);

module.exports = router;
