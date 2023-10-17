import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'JOURNAL',
})
export class Journal extends CommonEntity {
  @ApiProperty({
    description: '일기를 등록할 시간(UTC)',
    example: '2023-10-27T15:00:00.000Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  @Column({
    unique: false, // typeorm issue로 인한 unique false 처리 :https://github.com/typeorm/typeorm/issues/7736
    nullable: false,
    type: 'timestamp with time zone',
  })
  date: Date; // 일기의 날짜(작성일X), 시간은 utc

  @ApiProperty({
    description: '일기 내용',
    example: '20일 일기',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Column({
    nullable: false,
  })
  content: string;

  @ApiProperty({
    description: '일기를 쓴 user',
    example: '94f3c50c-05e7-4b83-b311-1fb4cf84b3a1',
    required: true,
  })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;
}
