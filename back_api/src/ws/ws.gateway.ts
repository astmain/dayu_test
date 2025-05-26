import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SkipThrottle } from '@/processor/decorator/throttle.decorator';
const ONLINE_CLIENTS = 'ONLINE_CLIENTS';

@SkipThrottle()
@WebSocketGateway()
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  afterInit(_server: Server) {
    // console.log('✨ 🍰 ✨ xzz2021: WsGateway -> afterInit -> server');
  }
  async handleConnection(client: Socket, ..._args: any[]) {
    // 1. 有客户端 上线 将用户加入号码为userId的房间 2. 缓存上线用户id 3. 用户下线 房间会自动清理
    const { userId } = this.getClientQuery(client);
    if (userId) {
      void client.join(userId.toString());
      await this.updateClientMap(userId);
    }
  }

  async handleDisconnect(client: Socket) {
    const { userId } = this.getClientQuery(client);
    if (userId) {
      await this.updateClientMap(userId, false);
    }
  }

  private getClientQuery(client: Socket): { userId?: number } {
    return client?.handshake?.query || {};
  }

  sendMessageToAll(event: string, message: any) {
    this.server.emit(event, message);
  }

  sendMessageToClient(clientId: string, event: string, message: any) {
    this.server.to(clientId).emit(event, message);
  }

  @SubscribeMessage('test')
  create(@MessageBody() _dd: any) {
    console.log('✨ 🍰 ✨ xzz2021: WsGateway -> constructor -> test');
  }

  @SubscribeMessage('findAllWs')
  findAll() {
    console.log('✨ 🍰 ✨ xzz2021: WsGateway -> constructor -> findAllWs');
  }

  async updateClientMap(id: number, isAdd: boolean = true) {
    const clients: number[] = (await this.cacheManager.get(ONLINE_CLIENTS)) || [];
    if (isAdd) {
      const newClients = [...new Set([...clients, id])];
      await this.cacheManager.set(ONLINE_CLIENTS, newClients, 0);
    } else {
      const newClients = clients.filter(item => item != id);
      await this.cacheManager.set(ONLINE_CLIENTS, newClients);
    }
    // 客户端变化 发送消息给在线用户查看模块
    this.server.emit('onlineUserChanged', '在线用户有变化');
  }

  sendNoticeMsgToAll(event: string, message: any) {
    this.server.emit(event, message);
  }
}
