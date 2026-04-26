const express = require("express");
const router = express.Router();

const { getSchools, getOne, create, validateSchool, validateAllSchools } = require("./school.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const ROLES = require("../../constants/roles");

router.get("/", getSchools);
router.get("/:id", getOne);
router.post("/", create); // Inscription publique (en attente)
router.patch("/validate-all", authMiddleware, authorizeRoles(ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN), validateAllSchools);
router.patch("/:id/validate", authMiddleware, authorizeRoles(ROLES.HERO_ADMIN, ROLES.SUPER_ADMIN), validateSchool);

module.exports = router;