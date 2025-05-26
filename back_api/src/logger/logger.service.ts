import { Inject, Injectable } from '@nestjs/common';
import { PrismaService as pgService } from 'src/prisma/prisma.service';
import { executePagedQuery } from '@/processor/utils/queryBuilder';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { WsGateway } from '@/ws/ws.gateway';
import { IQueryParams } from '@/processor/utils/queryBuilder';
import { SshService } from '@/ssh/ssh.service';
import { RequestLog } from '@/type';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
@Injectable()
export class LoggerService {
  constructor(
    private readonly pgService: pgService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly wsGateway: WsGateway,
    private readonly sshService: SshService, //  模块未引用  但想注入使用service， 在module入口provider 进行 引入声明即可
    @Inject(WINSTON_MODULE_NEST_PROVIDER as 'NestWinston') private readonly logger: Logger,
  ) {}

  async getLogList(searchParam: IQueryParams) {
    const newSearchParam = {
      ...searchParam,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { id: 'desc' as const },
    };
    return executePagedQuery(this.pgService.requestLog, newSearchParam, '日志');
  }

  async deleteLog(ids: number[]) {
    const res = await this.pgService.requestLog.deleteMany({
      where: { id: { in: ids } },
    });
    return { code: 200, res, message: '删除日志成功' };
  }

  async createRequestLog(data: RequestLog, userPhone: string, isPrismaClientErr: boolean = false) {
    if (isPrismaClientErr) {
      return { code: 400, message: '创建日志失败, 因为数据库服务异常' };
    }
    // 1. 先根据phone查出用户信息   2. 创建log表同时关联user信息  3. 使用事务操作
    try {
      const transaction = await this.pgService.$transaction(async pgService => {
        const user = await pgService.user.findUnique({
          where: { phone: userPhone },
        });
        const log = await pgService.requestLog.create({
          data: { ...data, userId: user?.id },
        });
        return log;
      });
      if (transaction) {
        return { code: 200, message: '创建日志成功', data: transaction.id };
      } else {
        return { code: 400, message: '创建日志失败' };
      }
    } catch (error) {
      console.log('xzz2021: UtilService -> createRequestLog -> error', error);
      return { code: 400, error: error.message, message: '创建日志失败' };
    }
  }

  createErrorLog(msgObj: any) {
    this.logger.error(msgObj);
  }

  createWarningLog(msgObj: any) {
    this.logger.warn(msgObj);
  }

  createInfoLog(msgObj: { message: string; context: string; [key: string]: any }) {
    const { message, context, ...rest } = msgObj;
    this.logger.log(message, context, rest);
  }

  createDebugLog(msgObj: any) {
    this.logger.debug(msgObj);
  }
}
