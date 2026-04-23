const express = require("express");
const router = express.Router();
const { getMyDashboard } = require("./parent.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles(ROLES.PARENT),
  getMyDashboard
);

module.exports = router;