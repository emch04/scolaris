/**
 * @module Assignments/Routes
 * @description Routes pour la gestion des devoirs.
 */

const express = require("express");
const router = express.Router();

const { create, getAssignments } = require("./assignment.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware");
const { createAssignmentValidator } = require("./assignment.validator");

/**
 * @route GET /api/assignments
 * @desc Récupérer la liste des devoirs
 * @access Private
 */
router.get("/", authMiddleware, getAssignments);

/**
 * @route POST /api/assignments
 * @desc Créer un nouveau devoir (avec fichier optionnel)
 * @access Private
 */
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createAssignmentValidator,
  validateMiddleware,
  create
);

module.exports = router;
