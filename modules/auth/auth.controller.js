const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/api-response");
const authService = require("./auth.service");
const { loginSchema } = require("./auth.validation");

const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const data = await authService.login(payload);

  return sendSuccess(res, 200, "Login successful", data);
});

module.exports = {
  login
};
