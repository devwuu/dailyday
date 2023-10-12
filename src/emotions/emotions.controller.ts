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

@Controller('emotions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
export class EmotionsController {
  private logger: Logger = new Logger(EmotionsController.name);

  constructor(private readonly emotionsService: EmotionsService) {}

  // emotion 모든 api : (login) guard 필요!
  private readonly userId: string = '075b9be6-6d99-4e08-942d-4e392fef80a7'; // must be removed

  @Post()
  create(@Body() createEmotionDto: CreateEmotionDto) {
    return this.emotionsService.create(this.userId, createEmotionDto);
  }

  @Get()
  findAll() {
    return this.emotionsService.findAll(this.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emotionsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmotionDto: UpdateEmotionDto) {
    return this.emotionsService.update(id, updateEmotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emotionsService.remove(id);
  }
}
