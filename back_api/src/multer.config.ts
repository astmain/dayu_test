import { decode } from 'iconv-lite';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';

export const multerConfigForAvatar = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // console.log('✨ 🍰 ✨ xzz2021: file', file);
      // 获取前端传的完整 filename，例如：'avatar/2025/03/user123.jpg'

      // 根目录（打包后的 static 目录）
      const staticRoot = join(__dirname, '..', 'static/avatar');
      // 拼接完整目录路径
      if (req?.user && 'phone' in req.user) {
        const targetDir = join(staticRoot, req.user.phone as string);

        // 确保目录存在
        fs.mkdirSync(targetDir, { recursive: true });

        cb(null, targetDir);
      } else {
        cb(null, staticRoot);
      }
    },

    filename: (req, file, cb) => {
      const originalName = decode(Buffer.from(file.originalname, 'latin1'), 'utf-8');

      cb(null, originalName);
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};
