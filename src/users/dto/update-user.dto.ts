import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password'] as const),
) {}

export class UpdateUserPasswordDto {
  @ApiProperty({
    required: true,
    description: '변경 전 비밀번호',
  })
  oldPassword: string;

  @ApiProperty({
    required: true,
    description: '변경 후 비밀번호',
  })
  newPassword: string;
}
