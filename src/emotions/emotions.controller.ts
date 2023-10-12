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

@Controller('emotions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
export class EmotionsController {
  private logger: Logger = new Logger(EmotionsController.name);

  constructor(private readonly emotionsService: EmotionsService) {}

  @Post()
  create(@User() user: UserDto, @Body() createEmotionDto: CreateEmotionDto) {
    return this.emotionsService.create(user.id, createEmotionDto);
  }

  @Get()
  findAll(@User() user: UserDto) {
    return this.emotionsService.findAll(user.id);
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
