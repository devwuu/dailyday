import { PickType } from '@nestjs/swagger';
import { Journal } from '../entities/journal.entity';

export class CreateJournalDto extends PickType(Journal, ['content', 'date']) {
  emotionId: string;
  intensity: string;
}
