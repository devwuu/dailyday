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

@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Post()
  create(@User() user: UserDto, @Body() createJournalDto: CreateJournalDto) {
    return this.journalsService.create(user.id, createJournalDto);
  }

  @Get()
  findAll(@User() user: UserDto) {
    return this.journalsService.findAll(user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJournalDto: UpdateJournalDto) {
    return this.journalsService.update(id, updateJournalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journalsService.remove(id);
  }
}
