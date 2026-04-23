const express = require("express");
const router = express.Router();
const { getMyDashboard, getParents, getOneParent, update } = require("./parent.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

// Routes pour l'administration
router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR),
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

// Route pour l'espace parent
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles(ROLES.PARENT),
  getMyDashboard
);

module.exports = router;