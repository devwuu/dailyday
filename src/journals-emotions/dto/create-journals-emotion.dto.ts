import { ApiProperty, PickType } from '@nestjs/swagger';
import { JournalsEmotion } from '../entities/journals-emotion.entity';

export class CreateJournalsEmotionDto extends PickType(JournalsEmotion, [
  'intensity',
  'journal',
]) {
  @ApiProperty({
    required: true,
    description: '등록된 감정 id',
  })
  emotionId: string;
}
