import { Controller, Post, Body, Req, Get, UploadedFile, UseInterceptors, Query, Delete, Param } from '@nestjs/common';
import { StaticfileService } from './staticfile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfigForMultipartUpload, multerConfigForStaticfile } from '@/staticfile/multer.config';
import { IQueryParams } from '@/processor/utils/queryBuilder';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@/processor/decorator/throttle.decorator';
import path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
import { stat } from 'fs/promises';
// import { access } from 'fs/promises';
const access = promisify(fs.access);

async function waitForFileReady(filePath: string, maxWait = 5000, interval = 1000): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    try {
      // 文件存在，并且大小大于0
      await access(filePath, fs.constants.F_OK);
      const fileStats = await stat(filePath);
      if (fileStats.size > 0) {
        return; // ✅ 文件准备好了
      }
    } catch {
      // 文件还没写完
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`文件未准备好或超时: ${filePath}`);
}

@ApiTags('静态文件')
@Controller('file')
export class StaticfileController {
  constructor(private readonly staticfileService: StaticfileService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file', multerConfigForStaticfile))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { remark: string; sha256: string },
    @Req() req: any,
  ) {
    if (!file) {
      return { code: 400, message: '文件上传失败' };
    }
    const { remark, sha256 } = body;
    const fileExt = file.filename.split('.').pop(); // 文件扩展名

    const { filename, path } = file;
    const name = filename.replace(/\.[^/.]+$/, ''); // 文件名
    const url = `${req.protocol}://${req.get('host')}/static/file/${filename}`; // 文件路径
    const size = file.size; // 文件大小
    return this.staticfileService.create({
      filename,
      filepath: path,
      uploaderId: req?.user?.id || null,
      uploader: req?.user?.username || null,
      extension: fileExt || null,
      name,
      remark,
      sha256,
      size,
      url,
    });
  }

  @Get('list')
  @ApiOperation({ summary: '获取文件列表' })
  list(@Query() query: IQueryParams) {
    return this.staticfileService.findAll(query);
  }

  @Delete('sha256/:sha256')
  @ApiOperation({ summary: '删除文件' })
  delete(@Param('sha256') sha256: string) {
    return this.staticfileService.delete(sha256);
  }

  @Post('batchDelete')
  @ApiOperation({ summary: '批量删除文件' })
  batchDelete(@Body() sha256s: string[]) {
    if (!Array.isArray(sha256s)) return { code: 400, message: '参数不合法,请检查后重试!' };
    if (sha256s.length < 1) return { code: 400, message: '文件参数为空,请检查后重试!' };
    return this.staticfileService.batchDelete(sha256s);
  }

  //  单独设置速率限制  取消全局动态限流  DynamicThrottlerGuard
  @SkipThrottle()
  @Post('3dUpload')
  @UseInterceptors(FileInterceptor('file', multerConfigForMultipartUpload))
  @ApiOperation({ summary: '分片上传文件' })
  async multipartUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      sha256: string;
      chunkNumber: string;
      totalChunks: string;
      fileName: string;
    },
    @Req() req: any,
  ) {
    const phone: string = req.user.phone || '13100001111';
    const { sha256, chunkNumber, totalChunks, fileName } = body;
    const filepath = path.resolve('tmp/chunks', `${sha256}_${chunkNumber}`);
    await waitForFileReady(filepath);

    //  前面的分片 multerConfigForMultipartUpload 已经做了临时存储
    // 如果当前是最后一片，触发合并
    if (+chunkNumber + 1 === +totalChunks) {
      const { file_path, file_size } = this.staticfileService.mergeChunks({
        sha256,
        totalChunks: +totalChunks,
        fileName,
        phone,
      });
      // 合并成功后 需要解析

      // 解析文件
      // const fileInfo = await this.staticfileService.parseFile(filePath);
      // 暂时模拟解析结果
      const rawFileInfo = {
        screenshot: '/static/image/aaa.png',
        length: 484.782,
        width: 163.837,
        height: 56.0,
        volume: 26960.831,
        surface: 7230.4,
        triangles: 111784,
        points: 55891,
        min_thickness: 2.6,
        thickness_proportion: 1,
        geometric_complexity: 1,
        structural_strength: 1,
      };
      const fileInfo = {
        ...rawFileInfo,
        file_type: fileName.split('.').pop(),
        file_size,
        filename: fileName,
        filepath: file_path,
        sha256,
      };

      // 同步写入数据库
      await this.staticfileService.insertFileinfo(fileInfo, req.user.id as number);

      return {
        code: 200,
        message: '文件上传成功',
        data: fileInfo,
      };
    }

    return {
      code: 200,
      message: 'Chunk uploaded',
    };
  }
}
