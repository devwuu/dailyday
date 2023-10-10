import { Module } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { EmotionsController } from './emotions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emotion } from './entities/emotion.entity';

@Module({
  controllers: [EmotionsController],
  providers: [EmotionsService],
  imports: [TypeOrmModule.forFeature([Emotion])],
})
export class EmotionsModule {}
