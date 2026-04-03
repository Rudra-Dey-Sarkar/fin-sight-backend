import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_SSL: z.enum(["true", "false"]).default("false"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  CORS_ORIGIN: z.string().default("*"),
  ADMIN_NAME: z.string().min(1, "ADMIN_NAME is required"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  SAMPLE_RECORD_SEED: z.enum(["true", "false"]).default("true")
});

const parsedEnv = envSchema.parse(process.env);

const env = {
  ...parsedEnv,
  DATABASE_SSL: parsedEnv.DATABASE_SSL === "true",
  SAMPLE_RECORD_SEED: parsedEnv.SAMPLE_RECORD_SEED === "true",
  CORS_ORIGIN:
    parsedEnv.CORS_ORIGIN === "*"
      ? "*"
      : parsedEnv.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
};

export default env;
