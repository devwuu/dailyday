import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as securityUtil from '../common/utils/security.utils';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginRequestDto: LoginRequestDto) {
    const user = await this.userRepository.findOneBy({
      email: loginRequestDto.email,
    });
    if (!user) throw new UnauthorizedException('Authorize error');
    const isMatched = await securityUtil.compare(
      loginRequestDto.password,
      user.password,
    );
    if (!isMatched) throw new UnauthorizedException('Authorize error');

    const payload: JwtPayload = {
      sub: user.id,
      iat: Date.now(),
      // exp 는 Module에서 설정
    };
    return this.jwtService.sign(payload);
  }
}
