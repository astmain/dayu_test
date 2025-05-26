export interface IQueryParams {
  // 基础过滤条件
  where?: Record<string, any>;
  name?: string;
  status?: string;

  // 分页参数
  pageIndex: number | string;
  pageSize: number | string;

  // 日期范围过滤
  dateRange?: Date[] | string;

  // Prisma特定参数
  include?: any;
  orderBy?: Record<string, 'asc' | 'desc'>;

  // 其他动态参数
  [key: string]: any;
}

interface RequestUser {
  user: {
    id: number;
    username: string;
    phone: string;
  };
}

export interface RequestLog {
  method: string;
  url: string;
  resCode: number;
  username?: string;
  feedbackMsg?: string;
  ip: string;
  userAgent: string;
  duration?: number;
}

export interface IQueryParams {
  where?: object;
  name?: string;
  status?: string;
  pageIndex: number | string;
  pageSize: number | string;
  dateRange?: Date[] | string;
  include?: any;
  orderBy?: any;
  [key: string]: any;
}
