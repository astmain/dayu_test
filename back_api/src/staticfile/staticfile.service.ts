import { Injectable } from '@nestjs/common';
import { Staticfile } from './type';
import { PrismaService as pgService } from 'src/prisma/prisma.service';
import { executePagedQuery2, IPrismaQueryResult, IQueryParams } from '@/processor/utils/queryBuilder';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class StaticfileService {
  private chunkDir = path.resolve('tmp/chunks');
  constructor(private readonly pgService: pgService) {}

  async create(fileinfo: Staticfile) {
    // 1. 先检查文件是否存在
    const isExist = await this.checkExist(fileinfo.sha256);
    if (isExist) {
      return { code: 400, message: '文件已存在', data: isExist };
    }
    // 2. 文件不存在 则写入数据库
    try {
      const res = await this.pgService.file.create({
        data: {
          ...fileinfo,
        },
      });
      if (res) {
        return { code: 200, message: '文件写入成功', data: res };
      } else {
        return { code: 400, message: '文件写入失败' };
      }
    } catch (error) {
      console.log('xzz2021: StaticfileService -> create -> error', error);
      return { code: 400, message: error?.sqlMessage };
    }
  }

  async checkExist(sha256: string) {
    return this.pgService.file.findFirst({
      where: {
        sha256,
      },
    });
  }

  async findAll(query: IQueryParams): Promise<IPrismaQueryResult<Staticfile>> {
    // 倒序
    query.orderBy = { createdAt: 'desc' };

    // 使用新的辅助函数简化代码
    // return await executePagedQuery<Staticfile>(this.pgService.file, query, '文件');
    return await executePagedQuery2<Staticfile>(this.pgService.file, query, '文件', 'file');
  }

  async delete(sha256: string) {
    try {
      const res = await this.pgService.file.delete({ where: { sha256 } });
      // 同时删除文件
      if (res.filepath) {
        fs.unlinkSync(res.filepath);
        return { code: 200, id: res.id, message: '删除文件成功' };
      } else {
        return { code: 400, message: '删除文件失败' };
      }
    } catch (error) {
      console.log('xzz2021: delete -> error', error.message);
      return { code: 400, message: error.message };
    }
  }

  async batchDelete(sha256Arr: string[]) {
    console.log('xzz2021: StaticfileService -> batchDelete -> sha256Arr', sha256Arr);
    /*
            1. 软删除
            await this.pgService.file.updateMany({
          where: { age: { lt: 18 } },
          data: { isDeleted: true },
        });
        2.  先查出待删除项 再进行循环删除
        const res = await this.pgService.file.findMany({
          where: { sha256: { in: sha256Arr } },
        });
        const deletedFiles = await Promise.all(res.map(async (item) => {
          await this.pgService.file.update({
            where: { id: item.id },
            data: { isDeleted: true },
          });
          fs.unlinkSync(item.filepath);
          return item.id;
        }));
        3. 优化性能 硬删除数据   及 对应文件

    

    */

    //  数据 及 文件 真实删除
    try {
      const deletedFiles = await this.pgService.$transaction(async tx => {
        const filesToDelete = await tx.file.findMany({
          where: { sha256: { in: sha256Arr } },
          select: {
            id: true,
            filepath: true,
          },
        });
        filesToDelete.map(file => {
          if (file.filepath) {
            try {
              fs.unlinkSync(file.filepath);
            } catch (error) {
              console.error(`Error deleting file ${file.filepath}:`, error);
            }
          }
        });

        return await tx.file.updateMany({
          where: { id: { in: filesToDelete.map(file => file.id) } },
          data: { isDeleted: true },
        });
      });

      return { code: 200, message: '删除文件成功', data: deletedFiles };
    } catch (error) {
      console.log('xzz2021: batchDelete -> error', error.message);
      return { code: 400, message: error.message };
    }
  }

  // multipartUpload(body: { sha256: string; filename: string; size: number }) {
  //   return { code: 200, message: '分片上传文件成功', data: body };
  // }

  mergeChunks({
    sha256,
    totalChunks,
    fileName,
    phone,
  }: {
    sha256: string;
    totalChunks: number;
    fileName: string;
    phone: string;
  }) {
    const dateDir = path.resolve('static/file', phone, new Date().toISOString().split('T')[0]);
    const finalPath = path.resolve(dateDir, fileName);
    // 创建目录 uploadDir 加上 日期
    if (!fs.existsSync(dateDir)) {
      fs.mkdirSync(dateDir, { recursive: true });
    }

    // 先检查所有分片是否存在
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.resolve(this.chunkDir, `${sha256}_${i}`);
      if (!fs.existsSync(chunkPath)) {
        console.error(`❌ 分片不存在: ${chunkPath}`);
        throw new Error(`分片 ${i} 缺失，无法合并`);
      }
    }

    const writeStream = fs.createWriteStream(finalPath);
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.resolve('tmp/chunks', `${sha256}_${i}`);
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
      fs.unlinkSync(chunkPath);
    }
    writeStream.end();

    return {
      file_path: `/static/file/${phone}/${fileName}`,
      abstract_path: `${dateDir}/${fileName}`,
      file_size: fs.statSync(finalPath).size,
    };
  }

  async insertFileinfo(fileinfo: any, uploaderId: number) {
    try {
      return this.pgService.$transaction(async tx => {
        // 记录文件信息
        await tx.fileInfo.create({
          data: {
            ...fileinfo,
            uploader: {
              connect: {
                id: uploaderId,
              },
            },
          },
        });
        // 加入购物 关联文件信息
      });
    } catch (error) {
      console.log('xzz2021: insertFileinfo -> error', error.message);
      return { code: 400, message: error.message };
    }
  }
}
