import { PickType } from '@nestjs/swagger';
import { JournalsEmotion } from '../entities/journals-emotion.entity';

export class JournalEmotionDto extends PickType(JournalsEmotion, [
  'id',
  'intensity',
]) {
  journalId: string;
  journalContent: string;
  journalDate: Date;
  emotionId: string;
  emotionName: string;
}
