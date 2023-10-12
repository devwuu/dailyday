import { PickType } from '@nestjs/swagger';
import { Emotion } from '../entities/emotion.entity';

export class CreateEmotionDto extends PickType(Emotion, [
  'name',
  'etc',
] as const) {}
