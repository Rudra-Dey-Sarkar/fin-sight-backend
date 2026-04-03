const { ZodError } = require("zod");
const env = require("../config/env");

const errorHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join(".") || "request",
        message: issue.message
      }))
    });
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: statusCode === 500 ? "Internal server error" : error.message
  };

  if (error.errors) {
    response.errors = error.errors;
  } else if (statusCode === 500 && env.NODE_ENV !== "production") {
    response.errors = [{ message: error.message }];
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
