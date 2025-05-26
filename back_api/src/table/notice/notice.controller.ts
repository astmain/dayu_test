import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { BaseNoticeDto, updateNoticeDto } from './type.d';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IQueryParams } from '@/processor/utils/queryBuilder';

@ApiTags('公告')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post('add')
  @ApiOperation({ summary: '创建公告' })
  create(@Body() createNoticeDto: BaseNoticeDto, @Req() req: any) {
    const { id } = req.user;
    return id ? this.noticeService.create({ ...createNoticeDto, creatorId: id }) : { code: 400, message: '请先登录' };
  }

  @Get()
  @ApiOperation({ summary: '获取所有公告' })
  findAll() {
    return this.noticeService.findAll();
  }

  @Get('unread')
  @ApiOperation({ summary: '获取未读公告' })
  findUnread(@Req() req: any) {
    const { id } = req?.user || {};
    return id ? this.noticeService.findUnread(+id) : { code: 400, message: '请先登录' };
  }

  @Get('list')
  @ApiOperation({ summary: '获取公告列表' })
  findBy(@Query() joinQueryParams: IQueryParams) {
    return this.noticeService.findBy(joinQueryParams);
  }

  @Get('selfList')
  @ApiOperation({ summary: '获取个人公告列表' })
  findSelfList(@Query() joinQueryParams: IQueryParams, @Req() req: any) {
    const { id } = req?.user || {};
    return id ? this.noticeService.findByUserId(+id, joinQueryParams) : { code: 400, message: '请先登录' };
  }

  @Post('update')
  @ApiOperation({ summary: '更新公告' })
  update(@Body() createMenuDto: updateNoticeDto) {
    return this.noticeService.update(createMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除公告' })
  remove(@Param('id') id: string) {
    return this.noticeService.remove(+id);
  }

  @Post('markAsRead')
  @ApiOperation({ summary: '标记为已读' })
  markAsRead(@Body() body: { ids: number[] }) {
    return this.noticeService.markAsRead(body.ids.map(id => Number(id)));
  }
}
