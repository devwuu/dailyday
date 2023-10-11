import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity({
  name: 'EMOTION',
})
export class Emotion extends CommonEntity {
  @Column({
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  name: string;

  @Column({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  etc?: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user?: User;
}
