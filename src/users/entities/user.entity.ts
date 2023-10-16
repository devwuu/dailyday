import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'USER',
})
export class User extends CommonEntity {
  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'email cannot be empty' })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({
    description: '닉네임',
    required: false,
    example: 'test',
  })
  @IsString()
  @IsOptional()
  @Column({ nullable: false, default: 'username' })
  name?: string;

  @ApiProperty({
    description: '비밀번호',
    required: true,
  })
  @Exclude()
  @IsNotEmpty()
  @Column({ nullable: false })
  password: string;
}
