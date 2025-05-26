import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
//  单独安装@prisma/client 用于 动态数据库
// import { PrismaClient } from '@prisma/client';

interface TypedCache extends Omit<Cache, 'set'> {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
}

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: TypedCache,
    // @Inject('PRISMA_CLIENT') private prisma2: PrismaClient,

    // @Inject('redis') private redis: TypedCache,
  ) {}
  getHello(): string {
    return 'Hello World xzz !';
  }

  async getHello2(): Promise<{ result: any }> {
    try {
      let result = await this.cacheManager.get('result');
      if (result) {
        console.log('✨ 🍰 ✨ xzz2021: AppService -> result');
        return { result };
      }
      console.log('============查询数据库');
      result = await this.prisma.user.findMany();
      await this.cacheManager.set('result', result);
      return { result };
    } catch (error) {
      console.log('✨ 🍰 ✨ xzz2021: AppService -> error', error);
      return { result: [] };
    }
  }
}
