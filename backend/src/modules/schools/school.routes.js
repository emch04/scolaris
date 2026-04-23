const express = require("express");
const router = express.Router();

const { getSchools, create } = require("./school.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get("/", getSchools);
router.post("/", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN), create);

module.exports = router;