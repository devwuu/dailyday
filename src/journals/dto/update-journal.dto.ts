import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateJournalDto } from './create-journal.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateJournalDto extends PartialType(
  PickType(CreateJournalDto, ['content', 'intensity', 'emotionId']),
) {
  @ApiProperty({
    required: true,
    description: '일기-감정 관계 id',
    example: '26767b6c-1660-448e-bdb6-9e3e6fd36afc',
  })
  @IsString()
  @IsNotEmpty({ message: 'emotion-journal id cannot be empty' })
  emotionJournalId: string;
}
