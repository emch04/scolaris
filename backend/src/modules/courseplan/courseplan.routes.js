/**
 * @file courseplan.routes.js
 * @description Routes API pour la consultation et la création des plans de cours.
 */
const express = require("express");
const router = express.Router();
const { addCoursePlan, getCoursePlans } = require("./courseplan.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");

const upload = require("../../middlewares/upload.middleware");

router.get("/classroom/:classroomId", authMiddleware, authorizeRoles("teacher", "parent", "student", "director", "admin"), getCoursePlans);
router.post("/", authMiddleware, authorizeRoles("teacher"), upload.single("file"), addCoursePlan);

module.exports = router;
