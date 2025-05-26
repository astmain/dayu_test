import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInfo, RegisterInfo } from './types';
import { Public } from '@/processor/decorator/public';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Public()
@ApiTags('帐号权限')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  create(@Body() createUserinfo: RegisterInfo) {
    return this.authService.create(createUserinfo);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() loginInfo: LoginInfo) {
    return this.authService.login(loginInfo);
  }

  @Post('getSmsCode')
  @ApiOperation({ summary: '获取短信验证码' })
  getSmsCode(@Body() data: { phone: string; type: string }) {
    return this.authService.getSmsCode(data.phone, data.type);
  }

  @Post('wechat/login')
  @ApiOperation({ summary: '微信登录' })
  wechatLogin(@Body() data: { code: string }) {
    return this.authService.wechatLogin(data.code);
  }

  @Post('wechat/bind')
  @ApiOperation({ summary: '微信绑定' })
  wechatBind(
    @Body()
    data: {
      phone: string;
      password: string;
      smsCode: string;
      unionid: string;
      username: string;
      avatar: string;
    },
  ) {
    return this.authService.wechatBind(data);
  }

  @Post('sms/login')
  @ApiOperation({ summary: '短信登录' })
  smsLogin(@Body() data: { phone: string; code: string }) {
    return this.authService.smsLogin(data);
  }

  @Post('sms/bind')
  @ApiOperation({ summary: '短信绑定' })
  smsBind(@Body() data: { phone: string; password: string; username: string }) {
    return this.authService.smsBind(data);
  }

  @Get('test')
  @ApiOperation({ summary: '测试' })
  test() {
    return this.authService.test();
  }
}
