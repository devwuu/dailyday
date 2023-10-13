import { PickType } from '@nestjs/swagger';
import { JournalsEmotion } from '../entities/journals-emotion.entity';

export class CreateJournalsEmotionDto extends PickType(JournalsEmotion, [
  'intensity',
]) {
  journalId: string;
  emotionId: string;
}
