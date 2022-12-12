import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

type UseCamParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCamParams) {
  const { user, isAuthenticaded } = useContext(AuthContext);

  const hasMoreThanOnePermission = permissions?.length > 0;
  const hasMoreThanOneRole = roles?.length > 0;

  if (!isAuthenticaded) return false;

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
