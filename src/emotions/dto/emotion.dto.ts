import { PickType } from '@nestjs/swagger';
import { Emotion } from '../entities/emotion.entity';

export class EmotionDto extends PickType(Emotion, [
  'id',
  'name',
  'etc',
] as const) {}
