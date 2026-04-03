import express from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import requirePermission from "../../middlewares/role.middleware.js";
import { PERMISSIONS } from "../../access-control/permission.static.js";
import * as dashboardController from "./dashboard.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/summary", requirePermission(PERMISSIONS.DASHBOARD_READ), dashboardController.getDashboardSummary);

export default router;
