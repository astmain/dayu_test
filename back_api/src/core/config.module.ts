import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
const envPath = [process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.pro', '.env'];

export const CONFIG_MODULE = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: envPath,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
  }),
});
