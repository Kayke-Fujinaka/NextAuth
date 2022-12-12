type User = {
  permissions: string[];
  roles: string[];
};

type ValidateUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsParams) {
  const hasMoreThanOnePermission = user.permissions?.length > 0;
  const hasMoreThanOneRole = user.roles?.length > 0;

  if (hasMoreThanOnePermission) {
    const hasAllPermissions = permissions.every((permission) => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) return false;
  }

  if (hasMoreThanOneRole) {
    const hasAllRoles = roles.every((role) => user.roles.includes(role));

    if (!hasAllRoles) return false;
  }

  return true;
}
