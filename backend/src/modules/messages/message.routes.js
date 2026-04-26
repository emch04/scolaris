const express = require("express");
const router = express.Router();
const { sendMessage, getMyMessages, getClassroomMessages, markAsRead } = require("./message.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const featureGuard = require("../../middlewares/featureGuard");

router.use(authMiddleware);

router.get("/my", getMyMessages);
router.get("/classroom/:classroomId", getClassroomMessages);
router.post("/", featureGuard("messaging"), sendMessage);
router.patch("/read/:id", markAsRead);

module.exports = router;
