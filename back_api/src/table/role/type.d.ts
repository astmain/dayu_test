interface RoleDTO {
  name: string;
  remark?: string;
  status?: boolean;
  menuIds: number[];
  permissionIds: number[];
}

type UpdateRoleDTO = RoleDTO & { id: number };
