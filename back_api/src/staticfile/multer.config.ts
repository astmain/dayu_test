import { decode } from 'iconv-lite';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import * as fs from 'fs';
export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // 如果你不想保存文件，可以提供一个空的目录
      const uploadPath = join(__dirname, 'file/test');
      // 检查目录是否存在，如果不存在就创建
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // 文件名使用时间戳和原始文件扩展名
      const filename = decode(Buffer.from(file.originalname, 'latin1'), 'utf-8');
      if (fs.existsSync(join(__dirname, 'file/test', filename))) {
        cb(null, Date.now() + '-' + filename);
      } else {
        cb(null, filename);
      }
    },
  }),
};

export const multerConfigForStaticfile = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // 如果你不想保存文件，可以提供一个空的目录
      const uploadPath = join(__dirname, '..', 'static/file');
      // 检查目录是否存在，如果不存在就创建
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // 文件名使用时间戳和原始文件扩展名
      const filename = decode(Buffer.from(file.originalname, 'latin1'), 'utf-8');
      if (fs.existsSync(join(__dirname, 'file/test', filename))) {
        cb(null, Date.now() + '-' + filename);
      } else {
        cb(null, filename);
      }
    },
  }),
};

export const multerConfigForMultipartUpload = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const dir = path.resolve('tmp/chunks');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const { sha256, chunkNumber } = req.body;
      const filename = `${sha256}_${chunkNumber}`;
      cb(null, filename);
    },
  }),
};
