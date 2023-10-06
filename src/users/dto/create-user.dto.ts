import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, ['email', 'password']) {
  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }
}
