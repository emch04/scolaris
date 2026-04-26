const express = require("express");
const router = express.Router();
const { addResource, getResources, deleteResource } = require("./resource.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { authorizeRoles } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const featureGuard = require("../../middlewares/featureGuard");

// On bloque l'accès à la bibliothèque si l'interrupteur est sur OFF
router.get("/", authMiddleware, featureGuard("library_access"), getResources);

router.post("/", authMiddleware, authorizeRoles("teacher", "admin", "director", "super_admin"), upload.single("file"), addResource);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "director", "super_admin"), deleteResource);

module.exports = router;
