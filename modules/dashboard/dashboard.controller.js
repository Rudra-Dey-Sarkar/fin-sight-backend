const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/api-response");
const dashboardService = require("./dashboard.service");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardSummary();

  return sendSuccess(res, 200, "Dashboard summary fetched successfully", data);
});

module.exports = {
  getDashboardSummary
};
