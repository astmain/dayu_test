import { Injectable } from '@nestjs/common';
import { PrismaService as pgService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly pgService: pgService) {}

  async create(createMenuDto: any) {
    const createStatement = {
      data: {
        ...createMenuDto,
        meta: {
          create: createMenuDto.meta,
        },
      },
      select: { id: true },
    };
    try {
      const res = await this.pgService.menu.create(createStatement);
      if (res?.id) {
        return { code: 200, id: res.id };
      }
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  findAll() {
    return `This action returns all menu`;
  }

  async update(updateMenuDto: any) {
    // 相当于合并新增与更新
    const { id, meta, parentId = null, ...rest } = updateMenuDto;

    const updateStatement = {
      where: { id },
      data: {
        parentId: parentId === id ? null : parentId,
        ...rest,
        meta: {
          upsert: {
            create: meta, // 如果 Meta 不存在，则创建
            update: meta, // 如果 Meta 存在，则更新
          },
        },
      },
    };
    try {
      const res = await this.pgService.menu.update(updateStatement);
      if (res?.id) {
        return { code: 200, id: res.id };
      }
    } catch (error) {
      return { code: 400, message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const res = await this.pgService.menu.delete({
        where: { id },
        select: { id: true },
      });
      if (res?.id) {
        return { code: 200, id: res.id, message: '删除菜单成功' };
      }
    } catch (error) {
      // console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, message: error.message };
    }
  }

  async findMenuList() {
    const findModule = {
      select: {
        id: true,
        name: true,
        path: true,
        redirect: true,
        type: true,
        component: true,
        sort: true,
        status: true,
        parentId: true,
        meta: {
          select: {
            title: true,
            icon: true,
            hidden: true,
            alwaysShow: true,
            noCache: true,
            breadcrumb: true,
            activeMenu: true,
            noTagsView: true,
            canTo: true,
            affix: true,
            // createdAt字段被排除
          },
        },
        permissionList: {
          select: {
            id: true,
            label: true,
            value: true,
            // createdAt字段被排除
          },
        },
      },
      // orderBy: 'createdAt'
    };
    try {
      const res = await this.pgService.menu.findMany(findModule);
      return { code: 200, list: res, message: '获取菜单成功' };
    } catch (error) {
      return { code: 500, message: '获取菜单失败' + error };
    }
  }

  async sortMenu(sortMenu: { id: number; sort: number }[]) {
    try {
      const res = await this.pgService.$transaction(async tx => {
        for (const item of sortMenu) {
          await tx.menu.update({
            where: { id: item.id },
            data: { sort: item.sort },
          });
        }
        return { code: 200, message: '排序成功' };
      });
      return res;
    } catch (error) {
      return { code: 500, message: '排序失败' + error };
    }
  }
}
