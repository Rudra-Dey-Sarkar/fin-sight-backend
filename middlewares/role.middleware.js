const { getPermissionsByRole } = require("../access-control/permission.provider");
const { createError } = require("../utils/api-response");

const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, "Authentication is required");
      }

      const permissions = await getPermissionsByRole(req.user.role);
      const hasPermission =
        permissions.includes("*") || permissions.includes(permission);

      if (!hasPermission) {
        throw createError(403, "You do not have permission to perform this action");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = requirePermission;
