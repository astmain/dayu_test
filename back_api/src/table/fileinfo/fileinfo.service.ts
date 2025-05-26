import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from '../cart/cart.service';
@Injectable()
export class FileinfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  async findOwner(id: number) {
    const uploadHistory = await this.prisma.fileInfo.findMany({
      where: {
        uploaderId: id,
      },
      select: {
        id: true,
        filename: true,
        screenshot: true,
        filepath: true,
        createdAt: true,
      },
    });
    return { code: 200, message: 'success', data: uploadHistory };
  }

  async delete(ids: number[]) {
    await this.prisma.fileInfo.updateMany({
      where: { id: { in: ids } },
      data: { is_deleted: true },
    });
    return { code: 200, message: 'success' };
  }

  async addCart(ids: number[], userId: number) {
    return await this.cartService.addCartByFileinfId(ids, userId);
  }
}
