import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as securityUtils from '../common/utils/security.utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<null | string> {
    const { email, password, name } = createUserDto;
    const parsedPassword = await securityUtils.encode(password);
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

  async findOneById(id: string): Promise<null | UserDto> {
    const find = await this.userRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Not Exist member');
    return find;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<null | string> {
    const find = await this.userRepository.findOneBy({ id });
    if (!find) throw new UnauthorizedException('Not Exist member');
    await this.userRepository.update({ id }, updateUserDto);
    return id;
  }

  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const find = await this.userRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Not Exist User');
    const isMatched = await securityUtils.compare(
      updateUserPasswordDto.oldPassword,
      find.password,
    );
    if (!isMatched) throw new UnauthorizedException('Not exist User');
    const parsedNewPassword = await securityUtils.encode(
      updateUserPasswordDto.newPassword,
    );
    await this.userRepository.update({ id }, { password: parsedNewPassword });
    return id;
  }

  async remove(id: string) {
    const target = await this.userRepository.findOneBy({ id });
    if (!target) throw new NotFoundException('Not Exist member');
    await this.userRepository.softDelete({ id });
    return id;
  }
}
