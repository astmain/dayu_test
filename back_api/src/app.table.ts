import { DepartmentModule } from '@/table/department/department.module';
import { DictionaryModule } from '@/table/dictionary/dictionary.module';
import { MenuModule } from '@/table/menu/menu.module';
import { NoticeModule } from '@/table/notice/notice.module';
import { PermissionModule } from '@/table/permission/permission.module';
import { RoleModule } from '@/table/role/role.module';
import { UserModule } from '@/table/user/user.module';
import { MaterialModule } from '@/table/material/material.module';
import { FileinfoModule } from '@/table/fileinfo/fileinfo.module';
import { AddressModule } from '@/table/address/address.module';

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
  AddressModule,
];
