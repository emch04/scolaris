const express = require("express");
const router = express.Router();
const { submitHomework, getSubmissions } = require("./submission.controller");
const { requestSignatureOtp } = require("./otp.service");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/request-otp", authMiddleware, requestSignatureOtp);
router.post("/", authMiddleware, submitHomework);
router.get("/assignment/:assignmentId", authMiddleware, getSubmissions);

module.exports = router;
