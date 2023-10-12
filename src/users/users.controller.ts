import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { UserDto } from './dto/user.dto';
import { OnlyPrivateInterceptor } from '../common/interceptors/only-private.interceptor';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('info')
  findCurrentUser(@User() user: UserDto) {
    return user;
  }

  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(
    @User() user: UserDto,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(user.id, updateUserPasswordDto);
  }

  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('')
  remove(@User() user: UserDto) {
    return this.usersService.remove(user.id);
  }

  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('')
  update(@User() user: UserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
