const express = require("express");
const router = express.Router();
const { getMyDashboard, getParents, getOneParent, update } = require("./parent.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

// 1. D'abord les routes spécifiques (prioritaires)
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles(ROLES.PARENT, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR),
  getMyDashboard
);

// 2. Ensuite les routes générales
router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER),
  getParents
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR),
  getOneParent
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR),
  update
);

module.exports = router;