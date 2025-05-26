import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@/prisma/client/postgresql';
// const prisma = new PrismaClient()
// import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // private readonly prismaClient: PrismaClient, // @Inject('PRISMA_CLIENT')
    super({
      // 连接池配置
      //   connection: {
      //     pool: {
      //       min: 2, // 最小连接数
      //       max: 10, // 最大连接数
      //       idleTimeoutMillis: 30000, // 空闲超时时间（毫秒）
      //       acquireTimeoutMillis: 60000, // 获取连接超时时间（毫秒）
      //     },
      //   },
      // 日志配置
      //   log: ['error', 'warn', 'query'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      console.error('Failed to connect to database: 数据库连接失败!!!');
      // 尝试重连 最多5次 间隔5s
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
          await this.$connect();
          break;
        } catch {
          console.error('Failed to connect to database: 数据库连接失败!!!');
        }
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // 健康检查方法
  async healthCheck() {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // 获取连接池状态
  async getConnectionPoolStats() {
    try {
      const stats = await this.$queryRaw`
        SELECT 
          numbackends as active_connections,
          max_connections,
          state
        FROM pg_stat_database 
        WHERE datname = current_database();
      `;
      return stats;
    } catch (error) {
      console.error('Failed to get connection pool stats:', error);
      throw error;
    }
  }
}
