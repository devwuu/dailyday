import { PartialType, PickType } from '@nestjs/swagger';
import { CreateJournalsEmotionDto } from './create-journals-emotion.dto';

export class UpdateJournalsEmotionDto extends PartialType(
  PickType(CreateJournalsEmotionDto, ['intensity', 'emotionId']),
) {}
