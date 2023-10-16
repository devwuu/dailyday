import { PickType } from '@nestjs/swagger';
import { Journal } from '../entities/journal.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJournalDto extends PickType(Journal, ['content', 'date']) {
  @IsString()
  @IsNotEmpty()
  emotionId: string;

  @IsString()
  @IsNotEmpty()
  intensity: string;
}
