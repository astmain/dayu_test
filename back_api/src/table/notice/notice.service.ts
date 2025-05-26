import { Injectable } from '@nestjs/common';
import { PrismaService as pgService } from 'src/prisma/prisma.service';
import { createNoticeDto, updateNoticeDto } from './type';
import { executePagedQuery, IQueryParams } from '@/processor/utils/queryBuilder';
import { updateBuilderFilter } from '@/processor/utils/updateBuilderFilter';
import { WsGateway } from '@/ws/ws.gateway';

@Injectable()
export class NoticeService {
  constructor(
    private readonly pgService: pgService,
    private readonly wsGateway: WsGateway,
  ) {}

  async create(createNoticeDto: createNoticeDto) {
    const { recipients, ...rest } = createNoticeDto;
    const createStatement = {
      data: rest,
      select: { id: true },
    };
    // 创建公告 同时 使用事务 创建公告接收者
    try {
      // 使用事务
      const res = await this.pgService.$transaction(async tx => {
        const notice = await tx.notice.create(createStatement);
        if (notice?.id) {
          await tx.noticeRecipient.createMany({
            data: recipients.map(id => ({ noticeId: notice.id, userId: id })),
          });
        }
        return notice;
      });
      if (res?.id) {
        // 创建成功后 发送websocket消息给所有人
        if (rest?.isPublished) {
          this.wsGateway.sendNoticeMsgToAll('newNotice', recipients);
        }
        return { code: 200, id: res.id, message: '创建公告成功' };
      }
      return { code: 400, message: '创建公告失败' };
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message, message: '创建公告失败' };
    }
  }

  async findAll() {
    const list = await this.pgService.notice.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        content: true,
        isPublished: true,
        createdAt: true,
      },
    });
    return { code: 200, list, message: '获取所有公告成功' };
  }

  async findBy(searchParam: IQueryParams) {
    const newSearchParam = {
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        }, // 获取通知的创建者（User）
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            }, // 获取通知接收者的用户信息
          },
        },
      },
      ...searchParam,
    };
    const res = await executePagedQuery(this.pgService.notice, newSearchParam, '公告');
    return res;
  }

  async findByUserId(id: number, searchParam: IQueryParams) {
    // where: { isPublished: true },
    const newSearchParam = {
      where: { userId: id, notice: { isPublished: true } },
      select: {
        id: true,
        isRead: true,
        createdAt: true,
        notice: {
          select: {
            id: true,
            title: true,
            type: true,
            content: true,
            isPublished: true,
            createdAt: true,
            creator: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      ...searchParam,
    };
    const res = await executePagedQuery(this.pgService.noticeRecipient, newSearchParam, '通知消息');
    return res;
  }

  async update(updateNoticeDto: updateNoticeDto) {
    // 1. 更新公告
    // 2. 更新公告接收者 2.1 删除旧的接收者 2.2 创建新的接收者
    const updateFilter = updateBuilderFilter(updateNoticeDto, ['creatorId', 'creator', 'recipients']);
    const updateStatement = {
      where: { id: updateNoticeDto.id },
      data: updateFilter,
    };
    try {
      //  使用事务
      const res = await this.pgService.$transaction(async tx => {
        const notice = await tx.notice.update(updateStatement);
        if (notice?.id) {
          await tx.noticeRecipient.deleteMany({ where: { noticeId: updateNoticeDto.id } });
          await tx.noticeRecipient.createMany({
            data: updateNoticeDto.recipients.map((id: number) => ({ noticeId: updateNoticeDto.id, userId: id })),
          });
        }
        return notice;
      });
      if (res?.id) {
        // 更新成功后 发送websocket消息给所有人
        if (updateNoticeDto?.isPublished) {
          this.wsGateway.sendNoticeMsgToAll('newNotice', updateNoticeDto.recipients);
        }
        return { code: 200, id: res.id, message: '更新公告成功' };
      }
      return { code: 400, message: '更新公告失败' };
    } catch (error) {
      console.log('🚀 ~ xzz: NoticeService -> update -> error', error);
      return { code: 400, error: error.message, message: '更新公告失败' };
    }
  }

  async remove(id: number) {
    try {
      const res = await this.pgService.notice.delete({
        where: { id },
        select: { id: true },
      });
      if (res?.id) {
        return { code: 200, id: res.id, message: '删除公告成功' };
      }
    } catch (error) {
      // console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, message: error.message };
    }
  }

  async markAsRead(ids: number[]) {
    try {
      const res = await this.pgService.noticeRecipient.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      });
      if (res?.count) {
        return { code: 200, message: '标记为已读成功', count: res.count };
      }
    } catch (error) {
      console.log('🚀 ~ xzz: NoticeService -> markAsRead -> error', error);
      return { code: 400, error: error.message, message: '标记为已读失败' };
    }
  }

  async findUnread(id: number) {
    try {
      const total = await this.pgService.noticeRecipient.count({
        where: { userId: id, isRead: false, notice: { isPublished: true } },
      });

      return { code: 200, message: '获取未读消息成功', total };
    } catch (error) {
      console.log('🚀 ~ xzz: NoticeService -> markAsRead -> error', error.message);
      return { code: 400, error: error.message, message: '获取未读消息失败' };
    }
  }
}
