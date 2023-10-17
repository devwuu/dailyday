import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OnlyPrivateInterceptor } from '../common/interceptors/only-private.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JournalDto } from './dto/journal.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @ApiOperation({
    tags: ['일기'],
    summary: '일기 등록',
  })
  @ApiResponse({
    status: 201,
    description: '일기 등록 성공',
    schema: {
      properties: {
        journalId: {
          type: 'string',
          description: '등록된 일기 Id',
          example: '26767b6c-1660-448e-bdb6-9e3e6fd36afc',
        },
      },
    },
  })
  @Post()
  async create(
    @User() user: UserDto,
    @Body() createJournalDto: CreateJournalDto,
  ) {
    const journalId = await this.journalsService.create(
      user.id,
      createJournalDto,
    );
    return { journalId };
  }

  @ApiOperation({
    tags: ['일기'],
    summary: '등록된 일기 리스트 조회',
  })
  @ApiResponse({
    status: 200,
    description: '등록된 일기 리스트',
    type: JournalDto,
    isArray: true,
  })
  @Get()
  findAll(@User() user: UserDto) {
    return this.journalsService.findAll(user.id);
  }

  @ApiOperation({
    tags: ['일기'],
    summary: '등록된 일기 수정',
  })
  @ApiResponse({
    status: 200,
    description: '일기 수정 성공',
    schema: {
      properties: {
        journalId: {
          type: 'string',
          description: '수정된 일기 Id',
          example: '26767b6c-1660-448e-bdb6-9e3e6fd36afc',
        },
      },
    },
  })
  @ApiParam({
    required: true,
    description: '수정할 일기 id',
    name: 'id',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJournalDto: UpdateJournalDto,
  ) {
    const journalId = await this.journalsService.update(id, updateJournalDto);
    return { journalId };
  }

  @ApiOperation({
    tags: ['일기'],
    summary: '등록된 일기 삭제',
  })
  @ApiResponse({
    status: 200,
    description: '일기 삭제 성공',
    schema: {
      properties: {
        journalId: {
          type: 'string',
          description: '수정된 일기 Id',
          example: '26767b6c-1660-448e-bdb6-9e3e6fd36afc',
        },
      },
    },
  })
  @ApiParam({
    required: true,
    description: '삭제할 일기 id',
    name: 'id',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const journalId = await this.journalsService.remove(id);
    return { journalId };
  }
}
