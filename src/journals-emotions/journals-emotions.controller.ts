import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JournalsEmotionsService } from './journals-emotions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OnlyPrivateInterceptor } from '../common/interceptors/only-private.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../common/decorators/user.decorator';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JournalEmotionDto } from './dto/journal-emotion.dto';

@ApiHeader({
  name: 'Authorization',
  description: 'jwt token',
  required: true,
})
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@Controller('je')
export class JournalsEmotionsController {
  constructor(
    private readonly journalsEmotionsService: JournalsEmotionsService,
  ) {}

  @ApiOperation({
    summary: '일기와 감정 상세 조회',
    description: '일기와 일기에 등록된 감정 내용을 일기 id로 조회합니다',
  })
  @ApiResponse({
    status: 200,
    description: '일기와 감정 상세 조회 성공',
    type: JournalEmotionDto,
  })
  @Get('id/:id')
  findOneByJournalId(@Param('id') id: string) {
    return this.journalsEmotionsService.findOneByJournalIdWithAllContent(id);
  }

  @ApiOperation({
    summary: '일기와 감정 상세 조회',
    description: '일기와 일기에 등록된 감정 내용을 일기 날짜로 조회합니다',
  })
  @ApiResponse({
    status: 200,
    description: '일기와 감정 상세 조회 성공',
    type: JournalEmotionDto,
  })
  @Get('date/:date')
  findOneByJournalDate(@User() user: UserDto, @Param('date') date: Date) {
    return this.journalsEmotionsService.findOneByJournalDateWithAllContent(
      user.id,
      date,
    );
  }
}
