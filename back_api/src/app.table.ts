import { DepartmentModule } from '@/table/department/department.module';
import { DictionaryModule } from '@/table/dictionary/dictionary.module';
import { MenuModule } from '@/table/menu/menu.module';
import { NoticeModule } from '@/table/notice/notice.module';
import { PermissionModule } from '@/table/permission/permission.module';
import { RoleModule } from '@/table/role/role.module';
import { UserModule } from '@/table/user/user.module';
import { MaterialModule } from '@/table/material/material.module';
import { FileinfoModule } from '@/table/fileinfo/fileinfo.module';
import { user_address_Module } from '@/table/address/user_address_Module';

export const TABLE_MODULE = [
  DepartmentModule,
  DictionaryModule,
  MenuModule,
  NoticeModule,
  PermissionModule,
  RoleModule,
  UserModule,
  MaterialModule,
  FileinfoModule,
  user_address_Module,
];
