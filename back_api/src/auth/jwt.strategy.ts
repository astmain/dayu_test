import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  validate(payload: any) {
    // 此处用于返回需要挂载到 所有走jwtguard的接口中 使用 @Request  req.user  的数据
    const { id, username, phone, roleIds } = payload;
    return { id, username, phone, roleIds };
  }
}
