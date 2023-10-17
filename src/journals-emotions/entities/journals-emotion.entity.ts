import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Journal } from '../../journals/entities/journal.entity';
import { Emotion } from '../../emotions/entities/emotion.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'JOURNAL_EMOTION',
})
export class JournalsEmotion extends CommonEntity {
  @ApiProperty({
    required: true,
    description: '감정 강도',
    example: '10',
  })
  @IsString()
  @IsNotEmpty()
  @Column({
    nullable: false,
  })
  intensity: string; // 감정 강도

  @ApiProperty({
    required: true,
    description: '등록된 일기',
  })
  @OneToOne(() => Journal, (journal: Journal) => journal.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'journal_id',
    referencedColumnName: 'id',
  })
  journal: Journal;

  @ApiProperty({
    required: true,
    description: '등록된 감정',
  })
  @ManyToOne(() => Emotion, (emotion: Emotion) => emotion.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'emotion_id',
    referencedColumnName: 'id',
  })
  emotion: Emotion;
}
