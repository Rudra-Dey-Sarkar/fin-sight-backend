import asyncHandler from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import * as userService from "./user.service.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
} from "./user.validation.js";

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

export { createUser, getUsers, updateUser };
