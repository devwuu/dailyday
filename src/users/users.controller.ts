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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonResponse } from '../common/decorators/api-common-response.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    tags: ['회원'],
    summary: '회원가입',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      properties: {
        userId: {
          type: 'string',
          description: '생성된 user Id',
          example: '075b9be6-6d99-4e08-942d-4e392fef80a7',
        },
      },
    },
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userId = await this.usersService.create(createUserDto);
    return { userId };
  }

  @ApiBearerAuth()
  @ApiOperation({
    tags: ['회원'],
    summary: '회원정보 조회',
  })
  @ApiExtraModels(UserDto)
  @ApiCommonResponse({
    $ref: getSchemaPath(UserDto),
  })
  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('info')
  findCurrentUser(@User() user: UserDto) {
    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({
    tags: ['회원'],
    summary: '비밀번호 변경',
  })
  @ApiResponse({
    status: 200,
    description: '비밀번호 변경 성공',
    schema: {
      properties: {
        userId: {
          type: 'string',
          description: 'user Id',
          example: '075b9be6-6d99-4e08-942d-4e392fef80a7',
        },
      },
    },
  })
  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(
    @User() user: UserDto,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const userId = await this.usersService.updatePassword(
      user.id,
      updateUserPasswordDto,
    );
    return { userId };
  }

  @ApiBearerAuth()
  @ApiOperation({
    tags: ['회원'],
    summary: '회원탈퇴',
  })
  @ApiResponse({
    status: 200,
    description: '탈퇴 성공',
    schema: {
      properties: {
        userId: {
          type: 'string',
          description: 'user Id',
          example: '075b9be6-6d99-4e08-942d-4e392fef80a7',
        },
      },
    },
  })
  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('')
  remove(@User() user: UserDto) {
    return this.usersService.remove(user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    tags: ['회원'],
    summary: '회원정보 수정',
  })
  @ApiResponse({
    status: 200,
    description: '회원정보 변경 성공',
    schema: {
      properties: {
        userId: {
          type: 'string',
          description: 'user Id',
          example: '075b9be6-6d99-4e08-942d-4e392fef80a7',
        },
      },
    },
  })
  @UseInterceptors(OnlyPrivateInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('')
  update(@User() user: UserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
