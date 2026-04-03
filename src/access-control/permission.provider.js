import { STATIC_PERMISSIONS } from "./permission.static.js";

const getPermissionsByRole = async (role) => {
  return STATIC_PERMISSIONS[role] || [];
};

export { getPermissionsByRole };
