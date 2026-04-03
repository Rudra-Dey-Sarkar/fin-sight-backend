const { STATIC_PERMISSIONS } = require("./permission.static");

const getPermissionsByRole = async (role) => {
  return STATIC_PERMISSIONS[role] || [];
};

module.exports = {
  getPermissionsByRole
};
