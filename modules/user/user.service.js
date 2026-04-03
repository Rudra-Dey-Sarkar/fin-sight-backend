const bcrypt = require("bcryptjs");
const { ROLES } = require("../../constants/roles");
const { createError } = require("../../utils/api-response");
const userModel = require("./user.model");

const createUser = async (payload) => {
  const existingUser = await userModel.findUserByEmail(payload.email);

  if (existingUser) {
    throw createError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  return userModel.createUser({
    name: payload.name,
    email: payload.email,
    passwordHash,
    role: payload.role,
    status: payload.status
  });
};

const getUsers = async () => {
  return userModel.listUsers();
};

const updateUser = async (userId, payload) => {
  const existingUser = await userModel.findUserById(userId);

  if (!existingUser) {
    throw createError(404, "User not found");
  }

  const nextRole = payload.role || existingUser.role;
  const nextStatus = payload.status || existingUser.status;
  const willRemoveLastAdmin =
    existingUser.role === ROLES.ADMIN &&
    existingUser.status === "active" &&
    (nextRole !== ROLES.ADMIN || nextStatus !== "active");

  if (willRemoveLastAdmin) {
    const activeAdminCount = await userModel.countActiveAdmins();

    if (activeAdminCount <= 1) {
      throw createError(400, "At least one active admin user must remain");
    }
  }

  return userModel.updateUser(userId, {
    role: nextRole,
    status: nextStatus
  });
};

module.exports = {
  createUser,
  getUsers,
  updateUser
};
