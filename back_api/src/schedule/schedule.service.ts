import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { PrismaService } from 'src/prisma/prisma.service';
// import { MongoService } from 'src/prisma/mongo.service';
import * as fs from 'fs/promises';
import { SshService } from '@/ssh/ssh.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Injectable()
export class ScheduleService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private prisma: PrismaService,
    // private mongo: MongoService,
    private sshService: SshService,
    @InjectQueue('xzztest') private queue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  create(_createScheduleDto: any) {
    console.log('xzz2021: ScheduleService -> create -> 执行');
    // const log = await this.mongo.logs.create({
    //   data: {
    //     level: 'info',
    //     message: 'test',
    //     context: 'test',
    //   },
    // });
    // console.log('xzz2021: ScheduleService -> create -> log:', log);
    return 'This action adds a new schedule';
  }

  // @Cron(CronExpression.EVERY_5_SECONDS) // 定时执行   @nestjs/schedule
  async cleanupFiles() {
    console.log('xzz2021: CleanupService -> cleanupFiles -> 执行');
    // 1. 查询标记为 isDeleted=true 的文件
    const filesToDelete = await this.prisma.file.findMany({
      where: { isDeleted: true },
      select: { id: true, filepath: true },
    });

    if (filesToDelete.length === 0) {
      console.log('No files to clean up.');
      return;
    }

    // 2. 删除文件
    await Promise.all(
      filesToDelete.map(file => {
        if (file.filepath) {
          fs.unlink(file.filepath).catch(err => {
            console.error(`Failed to delete file: ${file.filepath}`, err);
          });
        }
      }),
    );
  }

  // 动态添加 Cron 任务
  addCronJob(name: string, cronTime: string, callback: () => void) {
    const job = new CronJob(cronTime, callback);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // 删除 Cron 任务
  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  // 获取所有任务
  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      console.log(`任务名称: ${key}`);
    });
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  async testBull() {
    console.log('🚀 ~ ScheduleService ~ testBull ~ testBull:');
    await this.queue.add('xzztest', { aaa: 'xzztest' }); // 添加任务
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async backupDb() {
    console.log('xzz2021: ScheduleService -> backupDb -> 执行');
    await this.sshService.create({ host: '8.153.65.174', username: 'root', password: 'zxc...123' });
    // const aaa = await this.sshService.runCommand('docker ps');
    // console.log('🚀 ~ ScheduleService ~ backupDb ~ aaa:', aaa);
    // return;
    // 1. 备份 host主机 的数据库 postgresql  备份文件加上时间戳  s生成到host主机的 tmp目录下
    const timestamp = new Date().toISOString().replace(/[-:Z]/g, '');
    const _res1 = await this.sshService.runCommand(
      `docker exec -it pgdb pg_dump -U odoo -d odoo > /tmp/backup_${timestamp}_postgres.sql`,
    );
    // 2. 下载文件
    const _res2 = await this.sshService.downloadFile(
      `/tmp/backup_${timestamp}_postgres.sql`,
      `./backup_${timestamp}_postgres.sql`,
    );
    console.log('🚀 ~ ScheduleService ~ backupDb ~ _res2:', _res2);
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(_id: number, _updateScheduleDto: any) {
    return `This action updates a #${_id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
