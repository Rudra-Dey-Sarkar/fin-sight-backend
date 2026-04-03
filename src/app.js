const express = require("express");
const cors = require("cors");
const env = require("../config/env");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes");
const recordRoutes = require("../modules/record/record.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");
const errorHandler = require("../middlewares/error.middleware");
const { createError } = require("../utils/api-response");

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

module.exports = app;
