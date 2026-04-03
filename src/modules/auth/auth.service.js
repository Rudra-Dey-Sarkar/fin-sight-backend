import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import * as authModel from "./auth.model.js";
import { createError } from "../../utils/api-response.js";

const login = async (payload) => {
  const user = await authModel.findAuthUserByEmail(payload.email);

  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw createError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw createError(403, "Inactive users cannot log in");
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status
  };

  const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};

export { login };
