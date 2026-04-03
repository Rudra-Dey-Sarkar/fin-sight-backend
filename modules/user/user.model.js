const { query } = require("../../config/db");
const { ROLES } = require("../../constants/roles");

const publicUserColumns = `
  id,
  name,
  email,
  role,
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const createUser = async ({ name, email, passwordHash, role, status }) => {
  const result = await query(
    `
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${publicUserColumns}
    `,
    [name, email, passwordHash, role, status]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await query(
    `
      SELECT ${publicUserColumns}
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const result = await query(
    `
      SELECT ${publicUserColumns}
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
};

const listUsers = async () => {
  const result = await query(
    `
      SELECT ${publicUserColumns}
      FROM users
      ORDER BY created_at DESC
    `
  );

  return result.rows;
};

const updateUser = async (id, { role, status }) => {
  const result = await query(
    `
      UPDATE users
      SET role = $2,
          status = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING ${publicUserColumns}
    `,
    [id, role, status]
  );

  return result.rows[0] || null;
};

const countActiveAdmins = async () => {
  const result = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM users
      WHERE role = $1 AND status = 'active'
    `,
    [ROLES.ADMIN]
  );

  return result.rows[0].total;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUser,
  countActiveAdmins
};
