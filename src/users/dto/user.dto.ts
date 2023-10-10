import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDto extends PickType(User, ['id', 'email', 'name'] as const) {}
