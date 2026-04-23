const express = require("express");
const router = express.Router();
const { addEvent, getCalendar } = require("./calendar.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");

router.get("/", authMiddleware, getCalendar);
router.post("/", authMiddleware, authorizeRoles("super_admin", "director", "admin"), addEvent);

module.exports = router;
