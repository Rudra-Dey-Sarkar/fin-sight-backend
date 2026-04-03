import asyncHandler from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import * as authService from "./auth.service.js";
import { loginSchema } from "./auth.validation.js";

const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const data = await authService.login(payload);

  return sendSuccess(res, 200, "Login successful", data);
});

export { login };
