const { ROLES } = require("../constants/roles");

const PERMISSIONS = Object.freeze({
  DASHBOARD_READ: "dashboard:read",
  RECORDS_READ: "records:read",
  RECORDS_CREATE: "records:create",
  RECORDS_UPDATE: "records:update",
  RECORDS_DELETE: "records:delete",
  USERS_READ: "users:read",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update"
});

const STATIC_PERMISSIONS = Object.freeze({
  [ROLES.VIEWER]: [PERMISSIONS.DASHBOARD_READ],
  [ROLES.ANALYST]: [PERMISSIONS.DASHBOARD_READ, PERMISSIONS.RECORDS_READ],
  [ROLES.ADMIN]: ["*"]
});

module.exports = {
  PERMISSIONS,
  STATIC_PERMISSIONS
};
