import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { FileinfoService } from './fileinfo.service';

@Controller('fileinfo')
export class FileinfoController {
  constructor(private readonly fileinfoService: FileinfoService) {}

  //  前台部分

  @Get('list')
  findOwner(@Req() req: any) {
    return this.fileinfoService.findOwner(req?.user?.id as number);
  }

  @Post('add_cart')
  addCart(@Body() ids: number[], @Req() req: any) {
    return this.fileinfoService.addCart(ids, req?.user?.id as number);
  }

  // 删除
  @Post('delete')
  delete(@Body() ids: number[]) {
    return this.fileinfoService.delete(ids);
  }

  //  后台部分
}
