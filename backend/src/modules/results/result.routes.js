const express = require("express");
const router = express.Router();
const { create, getBulletin } = require("./result.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/", authMiddleware, create);
router.get("/student/:studentId", authMiddleware, getBulletin);

module.exports = router;
