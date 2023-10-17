import { ApiProperty, PickType } from '@nestjs/swagger';
import { JournalsEmotion } from '../entities/journals-emotion.entity';

export class JournalEmotionDto extends PickType(JournalsEmotion, [
  'id',
  'intensity',
]) {
  @ApiProperty({
    description: '등록된 일기 id',
    example: '26767b6c-1660-448e-bdb6-9e3e6fd36afc',
  })
  journalId: string;

  @ApiProperty({
    description: '등록된 일기 내용',
    example: '새로운 일기',
  })
  journalContent: string;

  @ApiProperty({
    description: '등록된 일기 날짜',
    example: '2023-10-27T15:00:00.000Z',
  })
  journalDate: Date;

  @ApiProperty({
    description: '등록된 감정 id',
    example: 'a34ca11e-d39f-4541-b67d-983b242b0783',
  })
  emotionId: string;

  @ApiProperty({
    description: '등록된 감정 이름',
    example: '희망',
  })
  emotionName: string;
}
