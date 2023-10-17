import { ApiProperty, PickType } from '@nestjs/swagger';
import { Journal } from '../entities/journal.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJournalDto extends PickType(Journal, ['content', 'date']) {
  @ApiProperty({
    required: true,
    description: '감정 관계 id',
    example: 'a34ca11e-d39f-4541-b67d-983b242b0783',
  })
  @IsString()
  @IsNotEmpty()
  emotionId: string;

  @ApiProperty({
    required: true,
    description: '감정의 강도',
    example: '10',
  })
  @IsString()
  @IsNotEmpty()
  intensity: string;
}
