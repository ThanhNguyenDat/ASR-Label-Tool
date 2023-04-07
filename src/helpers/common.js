export const getRoleNameById = (roleId, roles) => {
  const role = roles?.find(item => item.role_id === roleId);
  return role?.role_name ?? '';
};
