import { Module } from '@nestjs/common';
import { FileinfoService } from './fileinfo.service';
import { FileinfoController } from './fileinfo.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  controllers: [FileinfoController],
  providers: [FileinfoService],
  imports: [CartModule],
})
export class FileinfoModule {}
