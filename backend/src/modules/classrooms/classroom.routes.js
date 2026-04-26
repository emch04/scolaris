/**
 * @module Classrooms/Routes
 * @description Routes pour la gestion des salles de classe.
 */

const express = require("express");
const router = express.Router();

const { create, getClassrooms } = require("./classroom.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

/**
 * Accès liste (Tout le staff y compris SECRETARY)
 */
router.get("/", authMiddleware, getClassrooms);

/**
 * Création (Ajout SECRETARY)
 */
router.post("/", authMiddleware, authorizeRoles(ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SECRETARY), create);

module.exports = router;
