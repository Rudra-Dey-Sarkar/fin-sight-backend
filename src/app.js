import express from "express";
import cors from "cors";
import env from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import recordRoutes from "./modules/record/record.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import { createError } from "./utils/api-response.js";

const app = express();

app.use(
  cors(
    env.CORS_ORIGIN === "*"
      ? {}
      : {
          origin: env.CORS_ORIGIN
        }
  )
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service is healthy",
    data: {
      uptime: process.uptime()
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

app.use(errorHandler);

export default app;
