import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiCommonResponse } from '../common/decorators/api-common-response.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ tags: ['회원'], summary: '회원 로그인' })
  @ApiCommonResponse({
    token: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NGYzYzUwYy0wNWU3LTRiODMtYjMxMS0xZmI0Y2Y4NGIzYTEiLCJpYXQiOjE2OTc0MzY1MzMxMTIsImV4cCI6MTY5NzQzNjUzNDkxMn0.kx4R0gbHj9fZNKRpCO0t5SCAlBw_P7rrKuEdyyXk-Pg"',
    },
  })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const token = await this.authService.login(loginRequestDto);
    return { token };
  }
}
