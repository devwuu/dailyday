import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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
    type: 'timestamp with time zone',
  })
  date: Date; // 일기의 날짜(작성일X), 시간은 utc

  @IsNotEmpty()
  @IsString()
  @Column({
    nullable: false,
  })
  content: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;
}
