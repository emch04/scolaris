const express = require("express");
const router = express.Router();
const { sendMessage, getMyMessages, markAsRead } = require("./message.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/my", getMyMessages);
router.post("/", sendMessage);
router.patch("/read/:id", markAsRead);

module.exports = router;
