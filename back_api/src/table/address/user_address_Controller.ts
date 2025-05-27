import {Body, Controller, Get, Post, Req} from '@nestjs/common';

import {ApiOperation, ApiTags} from '@nestjs/swagger';

import * as user_address_DTO from './user_address_DTO';

import {PrismaService as pgService} from 'src/prisma/prisma.service';

@ApiTags('收货地址')
@Controller('user_address')
export class user_address_Controller {
    constructor(private readonly pgService: pgService) {
    }

    @Post('update')
    @ApiOperation({summary: '保存地址'})
    async create(@Body() form: user_address_DTO.update, @Req() req: any) {
        console.log('form', form);
        console.log('req', req.user.id);
        if (form.id) {
            await this.pgService.addressInfo.update({
                where: {id: form.id},
                data: {
                    address_tag: form.address_tag,
                    name: form.name,
                    phone: form.phone,
                    userId: req.user.id,
                    street: form.street,
                    region: form.region,
                },
            });
        } else {
            await this.pgService.addressInfo.create({
                data: {
                    address_tag: form.address_tag,
                    name: form.name,
                    phone: form.phone,
                    userId: req.user.id,
                    street: form.street,
                    region: form.region,
                },
            });
            console.log(`2没id---创建地址`);
        }

        return {code: 200, count: 1, message: '成功:保存地址'};
    }

    @Post('delete')
    @ApiOperation({summary: '删除地址'})
    async delete(@Body() form: user_address_DTO.del, @Req() {user}: any) {

        console.log('form', form);
        console.log('user', user);
        const one = await this.pgService.addressInfo.delete({where: {id: form.id}});
        return {code: 200, data: one, message: '成功:删除地址'};
    }

    // id, is_default

    @Post('default')
    @ApiOperation({summary: '设置默认地址'})
   async default(@Body() body: user_address_DTO.set_default , @Req() {user}: any) {
        console.log(`111---body:`, body);
        console.log(`111---user:`, user);
        // 先设置全部当前用户的默认地址为false
        await this.pgService.addressInfo.updateMany({where: {userId: user.id}, data: {is_default: false},});
        //  再设置当前地址为默认地址
       await this.pgService.addressInfo.update({where: {id: body.id}, data: {is_default: true},});
        return {code: 200, count: 11, aaaas: 111, aaa: 111, message: '111'};
    }

    @Get('list')
    @ApiOperation({summary: '获取地址列表'})
    async findBy(@Req() req: any) {
        console.log('req.user', req.user.id);
        const list = await this.pgService.addressInfo.findMany({where: {userId: req.user.id}});
        // return {code: 200, message: '成功:获取地址列表',   count: list.length, list};
        // return {code: 200, message: '成功:获取地址列表', data:  {count: list.length, list},};
        return {code: 200, message: '成功:获取地址列表', data: list};
    }

    @Get('alllist')
    @ApiOperation({summary: '获取所有地址列表'})
    findAll() {
        return {code: 200, count: 11, aaaas: 111, aaa: 111, message: '111'};
    }
}
