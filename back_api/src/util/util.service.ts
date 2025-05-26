import { Inject, Injectable } from '@nestjs/common';
import { PrismaService as pgService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { WsGateway } from '@/ws/ws.gateway';
import { SshService } from '@/ssh/ssh.service';
import AliSmsClient from './sms';
@Injectable()
export class UtilService {
  constructor(
    private readonly pgService: pgService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly wsGateway: WsGateway,
    private readonly sshService: SshService, //  模块未引用  但想注入使用service， 在module入口provider 进行 引入声明即可
  ) {}

  async generateSmsCode(phone: string, cachekey: string) {
    const cacheKeyName = 'smsCode_' + cachekey + '_' + phone;
    const code = await this.cacheManager.get(cacheKeyName);
    if (code) {
      return { code: 200, message: '验证码已发送,请60秒后再试!' };
    }
    // 随机生成6位数字 且首位不为0
    const newCode = Math.floor(Math.random() * 900000) + 100000;
    console.log('✨ 🍰 ✨ xzz2021: AuthService -> getSmsCode -> newCode', newCode);
    try {
      const res = await new AliSmsClient().main({ code: newCode, phone });
      if (res?.body?.code === 'OK') {
        await this.cacheManager.set(cacheKeyName, newCode, 90000);
        return { code: 200, message: '发送短信验证码成功' };
      } else {
        return { code: 400, message: '发送短信验证码失败' + res.message };
      }
    } catch (error) {
      return { code: 400, message: '发送短信验证码失败', error: error.message };
    }
  }

  async getOnlineUser() {
    try {
      const clients: string[] = (await this.cacheManager.get('ONLINE_CLIENTS')) || [];
      // 先获取所有登录记录
      const list: any[] = [];
      await Promise.all(
        clients.map(async id => {
          const log = await this.pgService.requestLog.findFirst({
            where: { userId: Number(id), url: '/auth/login', resCode: 200 },
            orderBy: { id: 'desc' },
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          });
          if (log) {
            list.push(log);
          }
        }),
      );
      return { code: 200, list, total: list.length, message: '获取在线用户成功' };
    } catch (error) {
      return { code: 400, error: error.message, message: '获取在线用户失败' };
    }
  }

  async getData(): Promise<any> {
    // try {
    //   const response = await this.httpService.get('https://jsonplaceholder.typicode.com/posts').toPromise();
    //   console.log('xzz2021: UtilService -> response?.data', response?.data);
    //   return response?.data; // 访问响应数据  ?. 防止报错
    // } catch (error) {
    //   console.log('xzz2021: UtilService -> getData -> error', error);
    //   throw new Error('Failed to fetch data');
    // }
  }

  forceLogout(id: number) {
    // 1. 发送请求给websocket
    this.wsGateway.sendMessageToClient(id + '', 'logout', id);
    return { code: 200, ok: true, message: '强制退出成功' };
  }

  // async testSsh0() {
  //   const ssh = new SshService();
  //   await ssh.connect({ host: '192.168.0.250', username: 'yun3d', password: 'Dayu_1688' });
  //   const result = await ssh.runCommand('docker ps');
  //   console.log('xzz2021: UtilService -> testSsh -> result', result);
  //   ssh.dispose();
  //   return { code: 200, result, message: '测试ssh连接成功' };
  // }

  // async testSsh1() {
  //   // const ssh = await this.sshService.create({ host: '192.168.0.250', username: 'yun3d', password: 'Dayu_1688' });
  //   const ssh2 = new SshService();
  //   await ssh2.create({ host: '192.168.0.250', username: 'yun3d', password: 'Dayu_1688' });
  //   const result = await ssh2.runCommand('docker ps');
  //   console.log('xzz2021: UtilService -> testSsh -> result', result);
  //   return { code: 200, result, message: '测试ssh连接成功' };
  // }

  async testSsh() {
    await this.sshService.create({ host: '192.168.0.250', username: 'yun3d', password: 'Dayu_1688' });
    const result = await this.sshService.runCommand('docker ps');

    console.log('xzz2021: UtilService -> testSsh -> result', result);
    return { code: 200, result, message: '测试ssh连接成功' };
  }

  // 递归构建菜单数据  单个包含children的菜单数据
  buildMenuData = (data: any[]) => {
    const { meta, children, permissionList, ...menu } = data as any;

    return {
      ...menu,
      ...(meta && { meta: { create: meta } }),
      ...(permissionList && { permissionList: { create: permissionList } }),
      ...(children?.length && { children: { create: children.map(this.buildMenuData) } }),
    };
  };
  async generateMenu(data: any[]) {
    try {
      //  不可以使用createMany 因为Many不支持include
      const batchCreate = await this.pgService.$transaction(async tx => {
        const create = await Promise.all(
          data.map(async (item: any[]) => {
            const create = await tx.menu.create({
              data: this.buildMenuData(item),
              include: {
                meta: true,
                permissionList: true,
                children: {
                  include: {
                    meta: true,
                    permissionList: true,
                  },
                },
              },
            });
            console.log('🚀 ~ UtilService ~ data.map ~ create:', create);
            return create;
          }),
        );
        return create;
      });

      if (batchCreate) {
        console.log('🚀 ~ UtilService ~ generateMenu ~ batchCreate:', batchCreate);
        return { code: 200, message: '生成菜单成功' };
      } else {
        return { code: 400, message: '生成菜单失败' };
      }
    } catch (error) {
      return { code: 400, message: '生成菜单失败', error: error.message };
    }
  }
}
