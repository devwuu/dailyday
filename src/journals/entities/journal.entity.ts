import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity({
  name: 'JOURNAL',
})
export class Journal extends CommonEntity {
  @IsNotEmpty()
  @Column({
    unique: true,
    nullable: false,
  })
  date: Date;

  @IsNotEmpty()
  @IsString()
  @Column({
    nullable: false,
  })
  content: string;

  // 다대다 관계로 확장 고려
  // @OneToOne(() => Emotion, (emotion) => emotion.id, {
  //   cascade: true,
  //   onDelete: 'SET NULL',
  // })
  // @JoinColumn({
  //   name: 'emotion_id',
  //   referencedColumnName: 'id',
  // })
  // emotion: Emotion;

  @OneToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;
}
