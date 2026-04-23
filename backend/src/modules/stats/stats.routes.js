const express = require("express");
const router = express.Router();
const { getGlobalStats } = require("./stats.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get("/global", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN), getGlobalStats);

module.exports = router;
