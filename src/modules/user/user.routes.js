import express from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import requirePermission from "../../middlewares/role.middleware.js";
import { PERMISSIONS } from "../../access-control/permission.static.js";
import * as userController from "./user.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", requirePermission(PERMISSIONS.USERS_CREATE), userController.createUser);
router.get("/", requirePermission(PERMISSIONS.USERS_READ), userController.getUsers);
router.patch("/:id", requirePermission(PERMISSIONS.USERS_UPDATE), userController.updateUser);

export default router;
