const jwt = require("jsonwebtoken");
const env = require("../config/env");
const userModel = require("../modules/user/user.model");
const { createError } = require("../utils/api-response");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      throw createError(401, "Authorization token is required");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, env.JWT_SECRET);

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.id) {
      throw createError(401, "Invalid access token");
    }

    const user = await userModel.findUserById(decodedToken.id);

    if (!user) {
      throw createError(401, "User not found or no longer available");
    }

    if (user.status !== "active") {
      throw createError(403, "Inactive users cannot access this resource");
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Access token expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid access token"));
    }

    return next(error);
  }
};

module.exports = authenticate;
