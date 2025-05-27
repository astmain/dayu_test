import { Module } from '@nestjs/common';
import { user_address_Controller } from './user_address_Controller';

@Module({
  controllers: [user_address_Controller],
  providers: [],
})
export class user_address_Module {}
