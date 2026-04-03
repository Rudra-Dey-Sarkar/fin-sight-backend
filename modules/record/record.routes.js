const express = require("express");
const authenticate = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/role.middleware");
const { PERMISSIONS } = require("../../access-control/permission.static");
const recordController = require("./record.controller");

const router = express.Router();

router.use(authenticate);

router.post("/", requirePermission(PERMISSIONS.RECORDS_CREATE), recordController.createRecord);
router.get("/", requirePermission(PERMISSIONS.RECORDS_READ), recordController.getRecords);
router.patch("/:id", requirePermission(PERMISSIONS.RECORDS_UPDATE), recordController.updateRecord);
router.delete("/:id", requirePermission(PERMISSIONS.RECORDS_DELETE), recordController.deleteRecord);

module.exports = router;
