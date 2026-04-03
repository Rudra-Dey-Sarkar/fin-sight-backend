import * as dashboardModel from "./dashboard.model.js";

const getDashboardSummary = async () => {
  const [totals, categoryTotals, recentActivity, monthlyTrends] = await Promise.all([
    dashboardModel.getTotals(),
    dashboardModel.getCategoryTotals(),
    dashboardModel.getRecentActivity(),
    dashboardModel.getMonthlyTrends()
  ]);

  return {
    totalIncome: totals.totalIncome,
    totalExpense: totals.totalExpense,
    netBalance: totals.netBalance,
    categoryTotals,
    recentActivity,
    monthlyTrends
  };
};

export { getDashboardSummary };
