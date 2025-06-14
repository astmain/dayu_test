import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Express } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfigForAvatar } from '@/multer.config';
import { UpdatePwdType } from './types';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IQueryParams } from '@/processor/utils/queryBuilder';
@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('listByDepartmentId')
  @ApiOperation({ summary: '获取指定部门用户' })
  findBy(@Query() joinQueryParams: IQueryParams) {
    return this.userService.findByDepartmentId(joinQueryParams);
  }

  @Get('detailInfo')
  @ApiOperation({ summary: '获取用户详情' })
  detailInfo(@Query() joinQueryParams: IQueryParams, @Req() req: any) {
    // 用户获取自己的信息  校验req.user
    if (req.user.id !== +joinQueryParams.id) {
      return { code: 400, message: '无权限获取他人信息' };
    }
    return this.userService.getUserInfo(joinQueryParams);
  }

  @Post('updateInfo')
  @ApiOperation({ summary: '更新用户信息' })
  updateInfo(@Body() updateUserinfo: any, @Req() req: any) {
    // 用户更新自己的信息  校验req.user
    if (req.user.id !== +updateUserinfo.id) {
      return { code: 400, message: '无权限更新他人信息' };
    }
    return this.userService.updateInfo(updateUserinfo);
  }

  @Post('updatePassword')
  @ApiOperation({ summary: '更新用户密码' })
  updatePassword(@Body() updatePasswordDto: UpdatePwdType, @Req() req: any) {
    // 用户更新自己的密码  校验req.user
    if (req.user.id !== +updatePasswordDto.id) {
      return { code: 400, message: '无权限更新他人密码' };
    }
    return this.userService.updatePassword(updatePasswordDto);
  }

  // 管理员重置用户密码
  @Post('resetPassword')
  @ApiOperation({ summary: '管理员重置用户密码' })
  resetPassword(@Body() updatePasswordDto: { id: number; password: string }, @Req() req: any) {
    const operateId = req?.user?.id;
    if (!operateId) return { code: 400, message: '身份识别异常,没有权限' };
    const { id, password } = updatePasswordDto;
    if (!id || !password) return { code: 400, message: '参数异常' };
    return this.userService.resetPassword({ id, password, operateId });
  }

  @Post('upload/avatar')
  @ApiOperation({ summary: '上传用户头像' })
  @UseInterceptors(FileInterceptor('file', multerConfigForAvatar))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Req() req: any) {
    if (req.user.id !== +body.id) {
      return { code: 400, message: '无权限更新他人头像' };
    }
    return this.userService.updateAvatar(req.user.phone + '/' + file.filename, +body.id);
  }

  @Post('add')
  @ApiOperation({ summary: '创建用户' })
  addUser(@Body() addUserinfoDto: any) {
    return this.userService.addUser(addUserinfoDto);
  }

  @Post('update')
  @ApiOperation({ summary: '更新用户' })
  update(@Body() updateUserinfoDto: any) {
    return this.userService.update(updateUserinfoDto);
  }

  @Post('delete')
  @ApiOperation({ summary: '删除用户' })
  delete(@Body() data: { ids: string[] }) {
    const { ids } = data;
    if (!Array.isArray(ids)) return { code: 400, message: '参数不合法' };
    const idList = ids.map(item => Number(item));
    return this.userService.delete(idList);
  }

  @Get('all')
  @ApiOperation({ summary: '获取所有用户' })
  getAll() {
    return this.userService.getAll();
  }
}
