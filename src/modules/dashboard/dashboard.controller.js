import asyncHandler from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import * as dashboardService from "./dashboard.service.js";

const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardSummary();

  return sendSuccess(res, 200, "Dashboard summary fetched successfully", data);
});

export { getDashboardSummary };
