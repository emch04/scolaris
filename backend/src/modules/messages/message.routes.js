const express = require("express");
const router = express.Router();
const { sendMessage, getMyMessages, getClassroomMessages, markAsRead } = require("./message.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/my", getMyMessages);
router.get("/classroom/:classroomId", getClassroomMessages);
router.post("/", sendMessage);
router.patch("/read/:id", markAsRead);

module.exports = router;
