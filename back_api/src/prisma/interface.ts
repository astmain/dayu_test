import { PrismaClientOptions } from '@prisma/client/runtime/library';
export interface PrismaModuleOptions {
  url: string;
  options?: PrismaClientOptions;
}

// "postgresql://odoo:xzz...@localhost:5432/back2?schema=public"
// "mysql://root:123456@localhost:3306/nest_db"
// 正则匹配数据库类型
const DB_TYPE_REGEX = /^postgresql|mysql|mongodb$/;
export const getDbType = (url: string) => {
  const match = url.match(DB_TYPE_REGEX);
  return match ? match[0] : null;
};
