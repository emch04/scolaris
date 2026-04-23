const express = require("express");
const router = express.Router();

const { create, getClassrooms } = require("./classroom.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get("/", authMiddleware, getClassrooms);
router.post("/", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR), create);

module.exports = router;