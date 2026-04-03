const { z } = require("zod");
const { ROLE_VALUES } = require("../../constants/roles");

const USER_STATUSES = ["active", "inactive"];

const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters long").max(100),
  role: z.enum(ROLE_VALUES),
  status: z.enum(USER_STATUSES).default("active")
});

const updateUserSchema = z
  .object({
    role: z.enum(ROLE_VALUES).optional(),
    status: z.enum(USER_STATUSES).optional()
  })
  .refine((value) => value.role || value.status, {
    message: "At least one field is required"
  });

const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

module.exports = {
  USER_STATUSES,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
};
