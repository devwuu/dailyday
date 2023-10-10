import { PartialType, PickType } from '@nestjs/swagger';
import { CreateEmotionDto } from './create-emotion.dto';

export class UpdateEmotionDto extends PartialType(
  PickType(CreateEmotionDto, ['name', 'etc'] as const),
) {}
