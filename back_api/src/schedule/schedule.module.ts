import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleConsumer } from './consumer';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'xzztest',
        defaultJobOptions: {
          removeOnComplete: true,
        },
      },
      // {
      //   name: 'yyy',
      // },
    ),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleConsumer],
})
export class ScheduleTaskModule {}
