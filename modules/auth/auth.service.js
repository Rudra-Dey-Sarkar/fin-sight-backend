const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const authModel = require("./auth.model");
const { createError } = require("../../utils/api-response");

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

module.exports = {
  login
};
