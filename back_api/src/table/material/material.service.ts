import { Injectable } from '@nestjs/common';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { PrismaService as PgService } from 'src/prisma/prisma.service';
import { MaterialType } from '@/prisma/client/postgresql';
import { MaterialProcess } from '@/prisma/client/postgresql';

@Injectable()
export class MaterialService {
  constructor(private readonly pgService: PgService) {}

  async findAll() {
    const material = await this.pgService.material.findMany();
    return { code: 200, data: material };
  }

  async add(createMaterialDto: CreateMaterialDto) {
    const { is_default, type, process, ...rest } = createMaterialDto;
    if (is_default) {
      await this.pgService.material.updateMany({
        where: { is_default: true },
        data: { is_default: false },
      });
    }
    const material = await this.pgService.material.create({
      data: {
        ...rest,
        is_default: is_default || false,
        type: type as MaterialType,
        process: process as MaterialProcess,
      },
    });
    return { code: 200, data: material };
  }

  async update(createMaterialDto: UpdateMaterialDto) {
    const { is_default, type, process, id, ...rest } = createMaterialDto;
    if (is_default) {
      await this.pgService.material.updateMany({
        where: { is_default: true },
        data: { is_default: false },
      });
    }
    const material = await this.pgService.material.update({
      where: { id },
      data: {
        ...rest,
        is_default: is_default || false,
        type: type as MaterialType,
        process: process as MaterialProcess,
      },
    });
    return { code: 200, data: material };
  }

  async delete(id: number) {
    const material = await this.pgService.material.delete({
      where: { id },
    });
    return { code: 200, data: material };
  }
}
