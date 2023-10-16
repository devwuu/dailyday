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

@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@Controller('je')
export class JournalsEmotionsController {
  constructor(
    private readonly journalsEmotionsService: JournalsEmotionsService,
  ) {}

  @Get('id/:id')
  findOneByJournalId(@Param('id') id: string) {
    return this.journalsEmotionsService.findOneByJournalIdWithAllContent(id);
  }

  @Get('date/:date')
  findOneByJournalDate(@User() user: UserDto, @Param('date') date: Date) {
    return this.journalsEmotionsService.findOneByJournalDateWithAllContent(
      user.id,
      date,
    );
  }
}
