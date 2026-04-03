import express from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import requirePermission from "../../middlewares/role.middleware.js";
import { PERMISSIONS } from "../../access-control/permission.static.js";
import * as recordController from "./record.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", requirePermission(PERMISSIONS.RECORDS_CREATE), recordController.createRecord);
router.get("/", requirePermission(PERMISSIONS.RECORDS_READ), recordController.getRecords);
router.patch("/:id", requirePermission(PERMISSIONS.RECORDS_UPDATE), recordController.updateRecord);
router.delete("/:id", requirePermission(PERMISSIONS.RECORDS_DELETE), recordController.deleteRecord);

export default router;
