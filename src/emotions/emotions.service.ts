import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from './entities/emotion.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmotionDto } from './dto/emotion.dto';

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

  async findAll(userId: string): Promise<null | EmotionDto[]> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new NotFoundException('Not exist user');
    const all = await this.emotionRepository.find({ where: { user } });
    return all;
  }

  async findOneById(id: string): Promise<null | EmotionDto> {
    const find = await this.emotionRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Not exist Emotion');
    return find;
  }

  async update(id: string, updateEmotionDto: UpdateEmotionDto) {
    const find = await this.emotionRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Not exist emotion');
    await this.emotionRepository.update(id, { ...find, ...updateEmotionDto });
    return id;
  }

  async remove(id: string) {
    const find = await this.emotionRepository.findOneBy({ id });
    if (!find) throw new NotFoundException('Not exist emotion');
    await this.emotionRepository.softDelete(id);
    return id;
  }
}
