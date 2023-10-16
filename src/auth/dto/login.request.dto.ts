import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: 'new@test.com',
    description: '이메일 주소',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: '1234',
    description: '비밀번호',
  })
  password: string;
}
