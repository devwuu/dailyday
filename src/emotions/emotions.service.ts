import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from './entities/emotion.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmotionsService {
  constructor(
    @InjectRepository(Emotion)
    private readonly emotionRepository: Repository<Emotion>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, createEmotionDto: CreateEmotionDto) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new NotFoundException('Not exist user');
    const saved = await this.emotionRepository.save({
      ...createEmotionDto,
      user,
    });
    return saved.id;
  }

  findAll() {
    return `This action returns all emotions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emotion`;
  }

  update(id: number, updateEmotionDto: UpdateEmotionDto) {
    return `This action updates a #${id} emotion`;
  }

  remove(id: number) {
    return `This action removes a #${id} emotion`;
  }
}
