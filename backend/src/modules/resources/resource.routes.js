const express = require("express");
const router = express.Router();
const { addResource, getResources, deleteResource } = require("./resource.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

router.get("/", authMiddleware, getResources);
router.post("/", authMiddleware, authorizeRoles("teacher", "admin", "director", "super_admin"), upload.single("file"), addResource);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "director", "super_admin"), deleteResource);

module.exports = router;
