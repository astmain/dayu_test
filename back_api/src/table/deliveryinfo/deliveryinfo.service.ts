import { Injectable } from '@nestjs/common';
import { UpsertItemDto } from './dto/deliveryinfo.dto';
import { PrismaService } from '@/prisma/prisma.service';
@Injectable()
export class DeliveryinfoService {
  constructor(private readonly prisma: PrismaService) {}
  create(_createDeliveryinfoDto: any) {
    return 'This action adds a new deliveryinfo';
  }

  async findAll() {
    const list = await this.prisma.deliveryInfo.findMany();
    return { list, message: '获取交期列表成功' };
  }

  async upsert(upsertData: UpsertItemDto) {
    const { id, ...rest } = upsertData;
    try {
      let result;
      if (id) {
        result = await this.prisma.deliveryInfo.update({
          where: { id },
          data: rest,
          select: { id: true },
        });
      } else {
        result = await this.prisma.deliveryInfo.create({
          data: rest,
          select: { id: true },
        });
      }
      if (result?.id) return { code: 200, id: result.id, message: (id ? '更新' : '新增') + '交期成功' };
    } catch (error) {
      console.log('🚀 ~ xzz: dictionaryService -> upsertDictionary -> error', error);
      return { code: 400, error: error.message };
    }
  }
}
