import { Body, Controller, Logger, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(loginRequestDto);
  }
}
