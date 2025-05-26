import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/processor/decorator/public';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('全局入口')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '测试' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('hello2')
  async getHello2(): Promise<{ result: any }> {
    return await this.appService.getHello2();
  }
}
