const express = require("express");
const router = express.Router();
const { create, list } = require("./communication.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

router.get("/", list);
router.post("/", authMiddleware, upload.single("file"), create);

module.exports = router;
