import { Module } from '@nestjs/common';
import { JournalsEmotionsService } from './journals-emotions.service';
import { JournalsEmotionsController } from './journals-emotions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalsEmotion } from './entities/journals-emotion.entity';
import { EmotionsModule } from '../emotions/emotions.module';
import { JournalsModule } from '../journals/journals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JournalsEmotion]),
    EmotionsModule,
    JournalsModule,
  ],
  controllers: [JournalsEmotionsController],
  providers: [JournalsEmotionsService],
})
export class JournalsEmotionsModule {}
