import { Module } from '@nestjs/common';
import { StaticfileService } from './staticfile.service';
import { StaticfileController } from './staticfile.controller';

@Module({
  controllers: [StaticfileController],
  providers: [StaticfileService],
})
export class StaticfileModule {}
