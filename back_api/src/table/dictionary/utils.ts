const list = [
  {
    label: '新增',
    value: 'add',
  },
  {
    label: '编辑',
    value: 'update',
  },
  {
    label: '删除',
    value: 'delete',
  },
  {
    label: '查看',
    value: 'view',
  },
];

export const batchCreatePermissionList = (menuId: number, path: string) => {
  const permissionList = list.map(item => ({
    ...item,
    menuId,
    name: (path + '_' + item.value).toUpperCase(),
  }));
  return permissionList;
};
