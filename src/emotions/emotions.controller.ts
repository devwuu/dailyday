import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { OnlyPrivateInterceptor } from '../common/interceptors/only-private.interceptor';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { EmotionDto } from './dto/emotion.dto';

@ApiBearerAuth()
@Controller('emotions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
export class EmotionsController {
  private logger: Logger = new Logger(EmotionsController.name);

  constructor(private readonly emotionsService: EmotionsService) {}

  @ApiOperation({
    tags: ['감정'],
    summary: '감정 등록',
  })
  @ApiResponse({
    status: 201,
    description: '감정 등록 성공',
    schema: {
      properties: {
        emotionId: {
          type: 'string',
          description: '등록된 감정 id',
          example: 'a34ca11e-d39f-4541-b67d-983b242b0783',
        },
      },
    },
  })
  @Post()
  async create(
    @User() user: UserDto,
    @Body() createEmotionDto: CreateEmotionDto,
  ) {
    const emotionId = await this.emotionsService.create(
      user.id,
      createEmotionDto,
    );
    return { emotionId };
  }

  @ApiOperation({
    tags: ['감정'],
    summary: '등록된 감정 조회',
  })
  @ApiResponse({
    status: 200,
    type: EmotionDto,
    isArray: true,
  })
  @Get()
  findAll(@User() user: UserDto) {
    return this.emotionsService.findAll(user.id);
  }

  @ApiOperation({
    tags: ['감정'],
    summary: '감정 상세 조회',
  })
  @ApiResponse({
    status: 200,
    type: EmotionDto,
  })
  @ApiParam({
    required: true,
    description: '조회할 감정 id',
    name: 'id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emotionsService.findOneById(id);
  }

  @ApiOperation({
    tags: ['감정'],
    summary: '등록된 감정 수정',
  })
  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        emotionId: {
          type: 'string',
          description: '수정한 감정 id',
          example: 'a34ca11e-d39f-4541-b67d-983b242b0783',
        },
      },
    },
  })
  @ApiParam({
    required: true,
    description: '수정할 감정 id',
    name: 'id',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmotionDto: UpdateEmotionDto,
  ) {
    const emotionId = await this.emotionsService.update(id, updateEmotionDto);
    return { emotionId };
  }

  @ApiOperation({
    tags: ['감정'],
    summary: '등록된 감정 삭제',
  })
  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        emotionId: {
          type: 'string',
          description: '삭제된 감정 id',
          example: 'a34ca11e-d39f-4541-b67d-983b242b0783',
        },
      },
    },
  })
  @ApiParam({
    required: true,
    description: '삭제할 감정 id',
    name: 'id',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emotionsService.remove(id);
  }
}
