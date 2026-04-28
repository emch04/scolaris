/**
 * @file parent.routes.js
 * @description Définition des routes API pour la gestion des parents.
 */
const express = require("express");
const router = express.Router();
const { getMyDashboard, getParents, getOneParent, update } = require("./parent.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

// 1. D'abord les routes spécifiques
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles(ROLES.HERO_ADMIN, ROLES.PARENT, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR),
  getMyDashboard
);

// 2. Ensuite les routes générales (Ajout SECRETARY)
router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER, ROLES.SECRETARY),
  getParents
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY),
  getOneParent
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY),
  update
);

module.exports = router;
