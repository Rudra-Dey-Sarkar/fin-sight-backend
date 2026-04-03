import bcrypt from "bcryptjs";
import env from "../src/config/env.js";
import { closePool, query } from "../src/config/db.js";
import { ROLES } from "../src/constants/roles.js";

const SAMPLE_RECORDS = [
  { amount: 4200, type: "income", category: "Salary", date: "2026-04-01", notes: "Monthly salary" },
  { amount: 650, type: "income", category: "Freelance", date: "2026-03-25", notes: "Client payment" },
  { amount: 1200, type: "expense", category: "Rent", date: "2026-04-02", notes: "Office rent" },
  { amount: 220, type: "expense", category: "Utilities", date: "2026-03-29", notes: "Electricity bill" },
  { amount: 140, type: "expense", category: "Tools", date: "2026-03-20", notes: "Software subscription" }
];

const upsertAdminUser = async () => {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  const result = await query(
    `
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ($1, $2, $3, $4, 'active')
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, email
    `,
    [env.ADMIN_NAME, env.ADMIN_EMAIL.toLowerCase(), passwordHash, ROLES.ADMIN]
  );

  return result.rows[0];
};

const seedSampleRecords = async (userId) => {
  if (!env.SAMPLE_RECORD_SEED) {
    console.log("Sample record seeding skipped.");
    return;
  }

  const existingRecords = await query(
    `
      SELECT COUNT(*)::int AS total
      FROM records
      WHERE user_id = $1
    `,
    [userId]
  );

  if (existingRecords.rows[0].total > 0) {
    console.log("Sample records already exist for the seeded admin user.");
    return;
  }

  for (const record of SAMPLE_RECORDS) {
    await query(
      `
        INSERT INTO records (user_id, amount, type, category, date, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [userId, record.amount, record.type, record.category, record.date, record.notes]
    );
  }

  console.log("Sample financial records created successfully.");
};

const seed = async () => {
  const adminUser = await upsertAdminUser();
  console.log(`Seeded admin user: ${adminUser.email}`);

  await seedSampleRecords(adminUser.id);
};

seed()
  .catch((error) => {
    console.error("Database seed failed:", error.stack || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
