import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@/prisma/client/mongodb';

@Injectable()
export class MongoService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasourceUrl: process.env.MONGO_DATABASE_URL,
    });
  }
  async onModuleInit() {
    await this.$connect();
    console.log('🚀 ~ MongoService ~ onModuleInit ~ $connect:');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
