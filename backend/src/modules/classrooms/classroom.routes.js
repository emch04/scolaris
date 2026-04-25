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
 * @route GET /api/classrooms
 * @desc Récupérer toutes les classes
 * @access Private
 */
router.get("/", authMiddleware, getClassrooms);

/**
 * @route POST /api/classrooms
 * @desc Créer une nouvelle classe
 * @access Private (Admin, Super Admin, Director)
 */
router.post("/", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR), create);

module.exports = router;
