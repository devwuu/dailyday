import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Journal } from '../../journals/entities/journal.entity';
import { Emotion } from '../../emotions/entities/emotion.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({
  name: 'JOURNAL_EMOTION',
})
export class JournalsEmotion extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({
    nullable: false,
  })
  intensity: string; // 감정 강도

  @OneToOne(() => Journal, (journal: Journal) => journal.id, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'journal_id',
    referencedColumnName: 'id',
  })
  journal: Journal;

  @ManyToOne(() => Emotion, (emotion: Emotion) => emotion.id, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'emotion_id',
    referencedColumnName: 'id',
  })
  emotion: Emotion;
}
