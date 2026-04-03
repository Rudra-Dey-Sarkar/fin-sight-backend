const express = require("express");
const authenticate = require("../../middlewares/auth.middleware");
const requirePermission = require("../../middlewares/role.middleware");
const { PERMISSIONS } = require("../../access-control/permission.static");
const dashboardController = require("./dashboard.controller");

const router = express.Router();

router.use(authenticate);

router.get("/summary", requirePermission(PERMISSIONS.DASHBOARD_READ), dashboardController.getDashboardSummary);

module.exports = router;
