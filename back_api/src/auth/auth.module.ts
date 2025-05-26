import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UtilService } from '@/util/util.service';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '8d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UtilService],
  exports: [AuthService],
})
export class AuthModule {}
