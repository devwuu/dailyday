import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
import { JwtPayload } from './dto/jwt.payload';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<null | UserDto> {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) throw new UnauthorizedException('Authorize error');
    return user;
  }
}
