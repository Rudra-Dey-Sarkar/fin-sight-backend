import { query } from "../../config/db.js";

const findAuthUserByEmail = async (email) => {
  const result = await query(
    `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        role,
        status
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
};

export { findAuthUserByEmail };
