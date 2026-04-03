const { query } = require("../../config/db");

const recordColumns = `
  records.id,
  records.user_id AS "userId",
  records.amount::float8 AS amount,
  records.type,
  records.category,
  records.date,
  records.notes,
  records.created_at AS "createdAt",
  records.updated_at AS "updatedAt",
  users.name AS "createdByName"
`;

const buildRecordFilters = (filters) => {
  const conditions = [];
  const values = [];

  if (filters.dateFrom) {
    values.push(filters.dateFrom);
    conditions.push(`records.date >= $${values.length}`);
  }

  if (filters.dateTo) {
    values.push(filters.dateTo);
    conditions.push(`records.date <= $${values.length}`);
  }

  if (filters.type) {
    values.push(filters.type);
    conditions.push(`records.type = $${values.length}`);
  }

  if (filters.category) {
    values.push(filters.category);
    conditions.push(`records.category ILIKE $${values.length}`);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    values
  };
};

const createRecord = async ({ userId, amount, type, category, date, notes }) => {
  const result = await query(
    `
      INSERT INTO records (user_id, amount, type, category, date, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        user_id AS "userId",
        amount::float8 AS amount,
        type,
        category,
        date,
        notes,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [userId, amount, type, category, date, notes]
  );

  return result.rows[0];
};

const findRecordById = async (id) => {
  const result = await query(
    `
      SELECT
        ${recordColumns}
      FROM records
      LEFT JOIN users ON users.id = records.user_id
      WHERE records.id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
};

const listRecords = async (filters) => {
  const { whereClause, values } = buildRecordFilters(filters);
  const countResult = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM records
      ${whereClause}
    `,
    values
  );

  const limitPlaceholder = values.length + 1;
  const offsetPlaceholder = values.length + 2;
  const offset = (filters.page - 1) * filters.limit;
  const result = await query(
    `
      SELECT
        ${recordColumns}
      FROM records
      LEFT JOIN users ON users.id = records.user_id
      ${whereClause}
      ORDER BY records.date DESC, records.created_at DESC
      LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}
    `,
    [...values, filters.limit, offset]
  );

  return {
    items: result.rows,
    total: countResult.rows[0].total
  };
};

const updateRecord = async (id, { amount, type, category, date, notes }) => {
  const result = await query(
    `
      UPDATE records
      SET amount = $2,
          type = $3,
          category = $4,
          date = $5,
          notes = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        user_id AS "userId",
        amount::float8 AS amount,
        type,
        category,
        date,
        notes,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [id, amount, type, category, date, notes]
  );

  return result.rows[0] || null;
};

const deleteRecord = async (id) => {
  const result = await query(
    `
      DELETE FROM records
      WHERE id = $1
      RETURNING
        id,
        user_id AS "userId",
        amount::float8 AS amount,
        type,
        category,
        date,
        notes,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  createRecord,
  findRecordById,
  listRecords,
  updateRecord,
  deleteRecord
};
