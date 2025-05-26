import { Controller, Body, Get, StreamableFile, Post } from '@nestjs/common';
import { UtilService } from './util.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/processor/decorator/public';

@ApiTags('辅助工具')
@Controller('utils')
export class UtilController {
  constructor(private readonly utilService: UtilService) {}

  // 流式传输文件
  // 避免将文件完全加载到内存中，特别是当文件非常大时。通过流式传输，文件会一边传输给客户端，一边从服务器端读取，从而节省内存并提高性能
  // @Public()
  @Get('getFile')
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file, {
      type: 'application/json',
      disposition: 'attachment; filename="package.json"',
    });
  }

  // 测试axios 发送api请求功能
  @Get('axios')
  axios() {
    return this.utilService.getData();
  }

  @Get('online/user')
  onlineUser() {
    //  启用缓存后   相同请求 会直接跳过这里的控制器
    // console.log('xzz2021: UtilController -> logList -> joinQueryParams', joinQueryParams);
    return this.utilService.getOnlineUser();
  }

  @Post('forceLogout')
  forceLogout(@Body() data: { id: number }) {
    if (!data.id) return { code: 400, message: '参数异常' };
    return this.utilService.forceLogout(data.id);
  }

  @Public()
  @Get('testssh')
  testSsh() {
    return this.utilService.testSsh();
  }

  @Public()
  @Post('generateMenu')
  generateMenu(@Body() data: any[]) {
    return this.utilService.generateMenu(data);
  }
}
