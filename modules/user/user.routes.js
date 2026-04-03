const express = require("express");
const authenticate = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/role.middleware");
const { PERMISSIONS } = require("../../access-control/permission.static");
const userController = require("./user.controller");

const router = express.Router();

router.use(authenticate);

router.post("/", requirePermission(PERMISSIONS.USERS_CREATE), userController.createUser);
router.get("/", requirePermission(PERMISSIONS.USERS_READ), userController.getUsers);
router.patch("/:id", requirePermission(PERMISSIONS.USERS_UPDATE), userController.updateUser);

module.exports = router;
