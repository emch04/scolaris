const express = require("express");
const router = express.Router();
const { create, getBulletin } = require("./result.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const featureGuard = require("../../middlewares/featureGuard");

router.post("/", authMiddleware, featureGuard("score_input"), create);
router.get("/student/:studentId", authMiddleware, getBulletin);

module.exports = router;
