import { Body, Controller, Logger, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ tags: ['회원'], summary: '회원 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      properties: {
        token: {
          type: 'string',
          description: 'jwt token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NGYzYzUwYy0wNWU3LTRiODMtYjMxMS0xZmI0Y2Y4NGIzYTEiLCJpYXQiOjE2OTc0MzY1MzMxMTIsImV4cCI6MTY5NzQzNjUzNDkxMn0.kx4R0gbHj9fZNKRpCO0t5SCAlBw_P7rrKuEdyyXk-Pg"',
        },
      },
    },
  })
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const token = await this.authService.login(loginRequestDto);
    return { token };
  }
}
