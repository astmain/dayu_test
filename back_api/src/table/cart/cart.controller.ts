import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('list')
  findAll() {
    return this.cartService.findAll();
  }

  @Get('ownerlist')
  findOwner(@Req() req: any) {
    return this.cartService.findOwner(req?.user?.id as number);
  }

  @Post('updateItem')
  updateItem(@Body() data: { id: number; count?: number }) {
    return this.cartService.updateItem(data);
  }

  @Post('deleteItem')
  deleteItem(@Body() ids: number[]) {
    return this.cartService.deleteItem(ids);
  }
}
