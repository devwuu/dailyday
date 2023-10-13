import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { JournalsEmotionsService } from './journals-emotions.service';
import { CreateJournalsEmotionDto } from './dto/create-journals-emotion.dto';
import { UpdateJournalsEmotionDto } from './dto/update-journals-emotion.dto';

@Controller('journals-emotions')
export class JournalsEmotionsController {
  constructor(
    private readonly journalsEmotionsService: JournalsEmotionsService,
  ) {}

  @Post()
  create(@Body() createJournalsEmotionDto: CreateJournalsEmotionDto) {
    return this.journalsEmotionsService.create(createJournalsEmotionDto);
  }

  @Get()
  findAll() {
    return this.journalsEmotionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journalsEmotionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJournalsEmotionDto: UpdateJournalsEmotionDto,
  ) {
    return this.journalsEmotionsService.update(+id, updateJournalsEmotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journalsEmotionsService.remove(+id);
  }
}
