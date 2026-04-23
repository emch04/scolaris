const express = require("express");
const router = express.Router();

const { create, getAssignments } = require("./assignment.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware");
const { createAssignmentValidator } = require("./assignment.validator");

router.get("/", authMiddleware, getAssignments);
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createAssignmentValidator,
  validateMiddleware,
  create
);

module.exports = router;