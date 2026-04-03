const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const createError = (statusCode, message, errors) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (errors) {
    error.errors = errors;
  }

  return error;
};

export { sendSuccess, createError };
