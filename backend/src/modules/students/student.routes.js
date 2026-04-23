const express = require("express");
const router = express.Router();

const { create, getStudents, getDashboard } = require("./student.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware");
const { createStudentValidator } = require("./student.validator");
const ROLES = require("../../constants/roles");

router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER),
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

router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER, ROLES.PARENT),
  getStudents
);

module.exports = router;