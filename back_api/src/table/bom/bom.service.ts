import { Injectable } from '@nestjs/common';
import { UpsertBomDto } from './dto/bom.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { executePagedQuery, IQueryParams } from '@/processor/utils/queryBuilder';

@Injectable()
export class BomService {
  constructor(private readonly prisma: PrismaService) {}

  async UpsertBom(upsertData: UpsertBomDto) {
    const { id, ...rest } = upsertData;
    let result;
    if (id) {
      result = await this.prisma.bom.update({
        where: { id },
        data: rest,
        select: { id: true },
      });
    } else {
      result = await this.prisma.bom.create({
        data: rest,
        select: { id: true },
      });
    }
    if (result?.id) return { id: result.id, message: (id ? '更新' : '新增') + 'BOM成功' };
  }

  async delete(ids: number[]) {
    await this.prisma.bom.deleteMany({
      where: { id: { in: ids } },
    });
    return { message: '删除BOM成功' };
  }

  async findBy(searchParam: IQueryParams) {
    const res = await executePagedQuery(this.prisma.bom, searchParam, 'BOM');
    return res;
  }
}
