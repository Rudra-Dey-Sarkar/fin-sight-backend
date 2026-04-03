const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/api-response");
const userService = require("./user.service");
const { createUserSchema, updateUserSchema, userIdParamSchema } = require("./user.validation");

const createUser = asyncHandler(async (req, res) => {
  const payload = createUserSchema.parse(req.body);
  const data = await userService.createUser(payload);

  return sendSuccess(res, 201, "User created successfully", data);
});

const getUsers = asyncHandler(async (req, res) => {
  const data = await userService.getUsers();

  return sendSuccess(res, 200, "Users fetched successfully", data);
});

const updateUser = asyncHandler(async (req, res) => {
  const params = userIdParamSchema.parse(req.params);
  const payload = updateUserSchema.parse(req.body);
  const data = await userService.updateUser(params.id, payload);

  return sendSuccess(res, 200, "User updated successfully", data);
});

module.exports = {
  createUser,
  getUsers,
  updateUser
};
