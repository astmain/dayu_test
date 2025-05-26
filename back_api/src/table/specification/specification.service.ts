import { Injectable } from '@nestjs/common';
import { CreateSpecificationDto, DeleteDto, UpsertItemDto, UpsertSpecificationDto } from './dto/specification.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SpecificationService {
  constructor(private readonly prisma: PrismaService) {}
  create(_createSpecificationDto: CreateSpecificationDto) {
    return this.prisma.specification.create({
      data: _createSpecificationDto,
    });
  }

  async findAll() {
    const list = await this.prisma.specification.findMany({
      where: {
        parentId: null,
      },
      include: {
        list: true,
        children: {
          include: {
            list: true,
          },
        },
      },
    });
    return { list, message: '获取规格列表成功' };
  }

  async UpsertSpecification(upsertData: UpsertSpecificationDto) {
    const { id, ...rest } = upsertData;
    console.log('🚀 ~ SpecificationService ~ UpsertSpecificationDto ~ rest:', rest);

    let result;
    if (id) {
      result = await this.prisma.specification.update({
        where: { id },
        data: rest,
        select: { id: true },
      });
    } else {
      result = await this.prisma.specification.create({
        data: rest,
        select: { id: true },
      });
    }
    if (result?.id) return { id: result.id, message: (id ? '更新' : '新增') + '字典成功' };
  }

  async UpsertItem(upsertData: UpsertItemDto) {
    const { id, is_default, specificationId, ...rest } = upsertData;
    if (is_default) {
      await this.prisma.specList.updateMany({
        where: { is_default: true, specificationId },
        data: { is_default: false },
      });
    }
    let result;
    if (id) {
      result = await this.prisma.specList.update({
        where: { id },
        data: {
          ...rest,
          is_default: is_default || false,
        },
        select: { id: true },
      });
    } else {
      result = await this.prisma.specList.create({
        data: {
          ...rest,
          is_default: is_default || false,
          specification: {
            connect: { id: specificationId },
          },
        },
        select: { id: true },
      });
    }
    if (result?.id) return { id: result.id, message: (id ? '更新' : '新增') + '字典成功' };
  }

  async delete(data: DeleteDto) {
    await this.prisma.specification.deleteMany({
      where: { id: { in: data.ids } },
    });
    return { message: '删除规格成功' };
  }

  async deleteItem(data: DeleteDto) {
    await this.prisma.specList.deleteMany({
      where: { id: { in: data.ids } },
    });
    return { message: '删除规格项成功' };
  }
}
