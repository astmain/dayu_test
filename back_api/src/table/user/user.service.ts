import { Inject, Injectable } from '@nestjs/common';
import { PrismaService as pgService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { executePagedQuery, IQueryParams } from '@/processor/utils/queryBuilder';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdatePwdType } from './types';

const filepath = process.env.AVATAR_PATH;
const port = process.env.PORT;
@Injectable()
export class UserService {
  constructor(
    private readonly pgService: pgService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findAll() {
    return this.pgService.user.findMany();
  }

  findOne(phone: string) {
    return this.pgService.user.findUnique({
      where: {
        phone,
      },
    });
  }
  async findByDepartmentId(joinQueryParams: IQueryParams) {
    // 此处查询 只批量返回一般数据   查询效率会更好    详细数据应当通过单个ip去查询处理
    const { id, ...searchParam } = joinQueryParams;
    //  同时查询 部门 角色 数据
    const newQueryParams = {
      where: { departmentId: +id > 1 ? +id : undefined },
      ...searchParam,
      select: {
        id: true,
        username: true,
        phone: true,
        status: true,
        createdAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc' as const,
      },
    };

    const res = await executePagedQuery(this.pgService.user, newQueryParams, '部门用户');
    return res || { list: [], total: 0, message: '部门用户列表为空' };
  }

  async addUser(addUserinfoDto: any) {
    const { departmentId, phone, username } = addUserinfoDto;
    try {
      // 1. 查询手机号 是否存在,  存在抛出异常提示
      const isExit = await this.pgService.user.findFirst({ where: { phone } });
      if (isExit?.id && phone) {
        // return { code: 400, message: '手机号已存在,无法添加!' };
        throw new Error('手机号已存在,无法添加!');
      }
      //  2.新增用户  默认密码123456
      const password = await bcrypt.hash('123456', 10);
      return await this.pgService.$transaction(async tx => {
        const userSave = await tx.user.create({
          data: {
            username,
            password,
            phone,
            departmentId,
          },
          include: {
            roles: true,
          },
        });

        return { code: 200, message: '新增用户成功', id: userSave.id };
      });
    } catch (error) {
      console.log(' ~ xzz: UserinfoService -> addUser -> error', error);
      return { code: 400, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async update(updateUserinfoDto: any) {
    const { id, departmentId, roles, phone, username } = updateUserinfoDto;
    // 需要先检查 roles 里的所有 id 项  是否存在 于role表 不存在的剔除  ??????????
    // const roleList = await this.pgService.role.findMany({ where: { id: { in: roles } } });
    // const validRoles = roles.filter((id: number) => roleList.some(role => role.id === id));

    try {
      const updatedUser = await this.pgService.user.update({
        where: { id },
        data: {
          username,
          phone,
          department: {
            connect: departmentId ? { id: departmentId } : undefined,
          },
          roles: {
            set: roles.map((id: number) => ({ id })),
          },
        },
      });
      return { code: 200, message: '更新用户信息成功', id: updatedUser.id };
    } catch (error) {
      console.log(' ~ xzz: UserinfoService -> update -> error', error);
      return { code: 400, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async delete(ids: number[]) {
    try {
      //  使用事务 删除用户 同时删除用户角色
      const res = await this.pgService.$transaction([
        ...ids.map(id => this.pgService.user.update({ where: { id }, data: { roles: { set: [] } } })),
        ...ids.map(id => this.pgService.user.delete({ where: { id } })),
      ]);
      return { code: 200, message: '删除用户成功', count: res.length };
    } catch (error) {
      console.log(' ~ xzz: UserinfoService -> delete -> error', error);
      return { code: 400, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  async getUserInfo(queryParams: any) {
    try {
      const userInfo = await this.pgService.user.findUnique({
        where: { id: +queryParams?.id },
        select: {
          id: true,
          avatar: true,
          username: true,
          phone: true,
          status: true,
          department: { select: { id: true, name: true } },
          roles: {
            select: { id: true, name: true },
          },
          createdAt: true,
        },
      });
      const result = {
        ...userInfo,
        roleList: userInfo?.roles,
      };
      delete result.roles;
      // await this.cacheManager.set(cacheKey, result);
      return { code: 200, userInfo: result, message: '获取个人信息成功' };
    } catch (error) {
      console.log(' ~ xzz: UserinfoService -> getUserInfo -> error', error);
      return {
        code: 400,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: '获取个人信息失败',
      };
    }
  }
  async updateInfo(updateUserinfoDto: any) {
    // 用户更新自己的 一般信息
    try {
      const { id, ...updateData } = updateUserinfoDto;
      const res = await this.pgService.user.update({ where: { id }, data: updateData });
      return { code: 200, message: '更新个人信息成功', id: res.id };
    } catch (error) {
      console.log(' ~ xzz: UserinfoService -> updateInfo -> error', error);
      return { code: 400, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updatePassword(updatePasswordDto: UpdatePwdType) {
    // 用户更新自己的密码
    try {
      const { id, password, newPassword } = updatePasswordDto;
      //  校验旧密码是否正确
      const user = await this.pgService.user.findUnique({ where: { id } });
      const isMatch = await bcrypt.compare(password, user?.password || '');
      if (!isMatch) {
        throw new Error('修改失败, 旧密码不正确');
      }
      const hashPassword = await bcrypt.hash(newPassword, 10);
      const res = await this.pgService.user.update({ where: { id }, data: { password: hashPassword } });
      return { code: 200, message: '更新个人密码成功', id: res.id };
    } catch (error) {
      // console.log(' ~ xzz: UserinfoService -> updatePassword -> error', error.message);
      return { code: 400, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateAvatar(avatar: string, id: number) {
    // const filePath = process.env.AVATAR_PATH + '/' + avatar;
    const filePath = `http://localhost:${port}/${filepath}/${avatar}`;
    // 更新用户头像
    try {
      const res = await this.pgService.user.update({ where: { id }, data: { avatar: filePath } });
      if (res?.id) {
        return { code: 200, message: '上传头像成功', filePath };
      }
    } catch (error) {
      return { code: 400, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAll() {
    const list = await this.pgService.user.findMany({
      select: {
        id: true,
        username: true,
        phone: true,
      },
    });
    return { code: 200, list, message: '获取所有用户成功' };
  }

  async resetPassword({ id, password, operateId }: { id: number; password: string; operateId: number }) {
    console.log('xzz2021: UserService -> resetPassword -> operateId', operateId);
    // 此处需要自定义 校验操作人是否 有执行权限
    // const isAdmin = await this.pgService.user.findUnique({ where: { id: operateId } });
    // if (!isAdmin) return { code: 400, message: '没有权限' };
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const res = await this.pgService.user.update({ where: { id }, data: { password: hashPassword } });
      return { code: 200, message: '重置用户密码成功', id: res.id };
    } catch (error: any) {
      console.log(' ~ xzz: UserinfoService -> resetPassword -> error', error);
      return { code: 400, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
