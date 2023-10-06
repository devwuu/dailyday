import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<null | string> {
    const { email, password } = createUserDto;
    const parsedPassword = await bcrypt.hash(password, 10);
    const isExist = await this.userRepository.exist({ where: { email } });
    if (isExist) throw new UnauthorizedException('already exist email');
    const saved = await this.userRepository.save({
      email,
      password: parsedPassword,
    });
    return saved.email;
  }

  async findAll(): Promise<null | UserDto[]> {
    const users = await this.userRepository.find();
    return users.map((u) => u);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
