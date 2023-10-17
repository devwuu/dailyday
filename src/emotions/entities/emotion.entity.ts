import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'EMOTION',
})
export class Emotion extends CommonEntity {
  @ApiProperty({
    description: '감정 이름',
    example: '기쁨',
    required: true,
  })
  @Column({
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  name: string;

  @ApiProperty({
    description: '비고',
    example: '기쁜 감정',
    required: false,
  })
  @Column({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  etc?: string;

  @ApiProperty({
    description: '감정을 등록한 user id',
    example: '94f3c50c-05e7-4b83-b311-1fb4cf84b3a1',
    required: true,
  })
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
