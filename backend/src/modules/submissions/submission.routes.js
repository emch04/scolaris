/**
 * @file submission.routes.js
 * @description Routes API pour le dépôt et la correction des devoirs.
 */
const express = require("express");
const router = express.Router();
const { submitHomework, getSubmissions, getStudentSubmissionsList, updateSubmission } = require("./submission.controller");
const { requestSignatureOtp } = require("./otp.service");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/request-otp", authMiddleware, requestSignatureOtp);
router.post("/", authMiddleware, submitHomework);
router.get("/assignment/:assignmentId", authMiddleware, getSubmissions);
router.get("/student/:studentId", authMiddleware, getStudentSubmissionsList);
router.put("/:id", authMiddleware, updateSubmission);

module.exports = router;
