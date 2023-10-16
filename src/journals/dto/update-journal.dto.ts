import { PartialType, PickType } from '@nestjs/swagger';
import { CreateJournalDto } from './create-journal.dto';

export class UpdateJournalDto extends PartialType(
  PickType(CreateJournalDto, ['content', 'intensity', 'emotionId']),
) {
  emotionJournalId: string;
}
