import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJournalsEmotionDto } from './dto/create-journals-emotion.dto';
import { UpdateJournalsEmotionDto } from './dto/update-journals-emotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalsEmotion } from './entities/journals-emotion.entity';
import { Repository } from 'typeorm';
import { Journal } from '../journals/entities/journal.entity';
import { Emotion } from '../emotions/entities/emotion.entity';

@Injectable()
export class JournalsEmotionsService {
  constructor(
    @InjectRepository(JournalsEmotion)
    private readonly joinRepository: Repository<JournalsEmotion>,

    @InjectRepository(Journal)
    private readonly journalRepository: Repository<Journal>,

    @InjectRepository(Emotion)
    private readonly emotionRepository: Repository<Emotion>,
  ) {}

  async create(createJournalsEmotionDto: CreateJournalsEmotionDto) {
    const { emotionId, journalId, intensity } = createJournalsEmotionDto;
    const emotion = await this.emotionRepository.findOneBy({
      id: emotionId,
    });
    const journal = await this.journalRepository.findOneBy({
      id: journalId,
    });

    if (!emotion || !journal)
      throw new NotFoundException('Not exist Emotion OR Journal');

    const isJoinedRowExist = await this.joinRepository.exist({
      where: {
        journal,
      },
    });

    if (isJoinedRowExist)
      throw new BadRequestException('emotion is already registered');

    const saved = await this.joinRepository.save({
      intensity,
      journal,
      emotion,
    });

    return saved.id;
  }

  findAll() {
    return `This action returns all journalsEmotions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} journalsEmotion`;
  }

  update(id: number, updateJournalsEmotionDto: UpdateJournalsEmotionDto) {
    return `This action updates a #${id} journalsEmotion`;
  }

  remove(id: number) {
    return `This action removes a #${id} journalsEmotion`;
  }
}
