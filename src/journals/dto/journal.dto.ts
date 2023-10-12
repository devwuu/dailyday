import { PickType } from '@nestjs/swagger';
import { Journal } from '../entities/journal.entity';

export class JournalDto extends PickType(Journal, ['id', 'content', 'date']) {}
