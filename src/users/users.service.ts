import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const { email, password, name } = createUserDto;
    const parsedPassword = await bcrypt.hash(password, 10);
    const isExist = await this.userRepository.exist({ where: { email } });
    if (isExist) throw new UnauthorizedException('already exist email');
    const saved = await this.userRepository.save({
      email,
      password: parsedPassword,
      name,
    });
    return saved.id;
  }

  async findAll(): Promise<null | UserDto[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<null | UserDto> {
    const find = await this.userRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Not Exist member');
    return find;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<null | string> {
    const find = await this.userRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Not Exist member');
    await this.userRepository.update({ id }, updateUserDto);
    return id;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
