const express = require("express");
const router = express.Router();

const { getSchools, getOne, create, validateSchool } = require("./school.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get("/", getSchools);
router.get("/:id", getOne);
router.post("/", create); // Inscription publique (en attente)
router.patch("/:id/validate", authMiddleware, authorizeRoles(ROLES.SUPER_ADMIN), validateSchool);

module.exports = router;