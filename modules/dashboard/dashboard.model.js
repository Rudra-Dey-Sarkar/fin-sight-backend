const { query } = require("../../config/db");

const getTotals = async () => {
  const result = await query(`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)::float8 AS "totalIncome",
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)::float8 AS "totalExpense",
      (
        COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) -
        COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)
      )::float8 AS "netBalance"
    FROM records
  `);

  return result.rows[0];
};

const getCategoryTotals = async () => {
  const result = await query(`
    SELECT
      category,
      COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)::float8 AS income,
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)::float8 AS expense,
      (
        COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) -
        COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)
      )::float8 AS net
    FROM records
    GROUP BY category
    ORDER BY category ASC
  `);

  return result.rows;
};

const getRecentActivity = async () => {
  const result = await query(`
    SELECT
      records.id,
      records.amount::float8 AS amount,
      records.type,
      records.category,
      records.date,
      records.notes,
      records.created_at AS "createdAt",
      users.name AS "createdByName"
    FROM records
    LEFT JOIN users ON users.id = records.user_id
    ORDER BY records.date DESC, records.created_at DESC
    LIMIT 5
  `);

  return result.rows;
};

const getMonthlyTrends = async () => {
  const result = await query(`
    SELECT
      TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month,
      COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)::float8 AS income,
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)::float8 AS expense,
      (
        COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) -
        COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)
      )::float8 AS net
    FROM records
    WHERE date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY DATE_TRUNC('month', date) ASC
  `);

  return result.rows;
};

module.exports = {
  getTotals,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends
};
