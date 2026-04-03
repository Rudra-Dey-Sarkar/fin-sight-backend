const { closePool, query } = require("../config/db");
const { ROLE_VALUES } = require("../constants/roles");

const USER_STATUSES = ["active", "inactive"];

const migrate = async () => {
  const roleList = ROLE_VALUES.map((role) => `'${role}'`).join(", ");
  const statusList = USER_STATUSES.map((status) => `'${status}'`).join(", ");

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN (${roleList})),
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN (${statusList})),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS records (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
      type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
      category VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
    CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
    CREATE INDEX IF NOT EXISTS idx_records_category ON records(category);
    CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
  `);

  console.log("Database migration completed successfully.");
};

migrate()
  .catch((error) => {
    console.error("Database migration failed:", error.stack || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
