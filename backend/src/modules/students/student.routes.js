/**
 * @file student.routes.js
 * @description Routes API pour la gestion des élèves.
 */
const express = require("express");
const router = express.Router();

const { create, getStudents, getDashboard } = require("./student.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware");
const { createStudentValidator } = require("./student.validator");
const ROLES = require("../../constants/roles");

/**
 * Création d'élève (Hero, Admin, Directeur et maintenant Secrétaire)
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.HERO_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY),
  createStudentValidator,
  validateMiddleware,
  create
);

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles(ROLES.STUDENT),
  getDashboard
);

/**
 * Lecture de la liste (Ajout du rôle SECRETARY)
 */
router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER, ROLES.PARENT, ROLES.SECRETARY),
  getStudents
);

module.exports = router;
