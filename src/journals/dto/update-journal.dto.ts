import { PartialType, PickType } from '@nestjs/swagger';
import { CreateJournalDto } from './create-journal.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateJournalDto extends PartialType(
  PickType(CreateJournalDto, ['content', 'intensity', 'emotionId']),
) {
  @IsString()
  @IsNotEmpty({ message: 'emotion-journal id cannot be empty' })
  emotionJournalId: string;
}
