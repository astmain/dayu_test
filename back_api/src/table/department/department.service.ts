import { executePagedQuery, IQueryParams } from '@/processor/utils/queryBuilder';
import { Injectable } from '@nestjs/common';
import { PrismaService as pgService } from '@/prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly pgService: pgService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const createStatement = {
      data: createDepartmentDto,
      select: { id: true },
    };
    console.log('🚀 ~ DepartmentService ~ create ~ createStatement:', createStatement);
    try {
      const res = await this.pgService.department.create(createStatement);
      if (res?.id) return { code: 200, id: res.id };
    } catch (error) {
      console.log('🚀 ~ xzz: DepartmentService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  async findBy(searchParam: IQueryParams) {
    const res = await executePagedQuery(this.pgService.department, searchParam, '部门');
    return res;
  }

  async findAll() {
    try {
      const res = await this.pgService.department.findMany();
      const total = await this.pgService.department.count();
      return { list: res, total, message: '获取部门列表成功' };
    } catch (error) {
      console.log('🚀 ~ xzz: findAll -> error', error.message);
    }
  }

  async update(updateDepartmentDto: UpdateDepartmentDto) {
    const updateStatement = {
      where: { id: updateDepartmentDto.id },
      data: updateDepartmentDto,
    };
    // try {
    const res = await this.pgService.department.update(updateStatement);
    if (res?.id) return { code: 200, id: res.id, message: '更新部门成功' };
    // } catch (error) {
    //   console.log('🚀 ~ DepartmentService ~ update ~ error:', error);
    //   if (error instanceof PrismaClientKnownRequestError) {
    //     throw new ServiceUnavailableException({
    //       code: error.code,
    //       error: error.message,
    //       message: '数据库服务异常',
    //       meta: error.meta,
    //     });
    //   }
    //   // return { code: 400, error: error.message };
    //   // 这里有数据返回的话  会走向  RequestLogInterceptor  的tap 方法 当成 正常请求成功
    // }
  }

  async batchRemove(idList: number[]) {
    try {
      const res = await this.pgService.department.deleteMany({
        where: { id: { in: idList } },
      });
      if (res?.count) return { code: 200, count: res.count, message: '删除部门成功' };
    } catch (error) {
      console.log('🚀 ~ xzz: DepartmentService -> batchRemove -> error', error);

      return { code: 400, error: error.message };
    }
  }
}
