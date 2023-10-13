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
import { JournalEmotionDto } from './dto/journal-emotion.dto';

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

  /**
   * todo 전체적으로 쿼리 최적화 필요
   * */
  async create(
    createJournalsEmotionDto: CreateJournalsEmotionDto,
  ): Promise<null | string> {
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

  async update(
    id: string,
    updateJournalsEmotionDto: UpdateJournalsEmotionDto,
  ): Promise<null | string> {
    const { emotionId, intensity } = updateJournalsEmotionDto;
    const join = await this.joinRepository.findOneBy({ id });
    if (!join) throw new NotFoundException('Not exist emotion-journal');
    const emotion = await this.emotionRepository.findOneBy({
      id: emotionId,
    });
    if (!emotion) throw new NotFoundException('Not exist emotion');
    await this.joinRepository.update(id, { ...join, emotion, intensity });

    return id;
  }

  async remove(id: string): Promise<null | string> {
    const isExist = await this.joinRepository.exist({ where: { id } });
    if (!isExist) throw new NotFoundException('Not exist emotion-journal');
    await this.joinRepository.delete(id);
    return id;
  }

  async findOneByJournalIdWithAllContent(
    id: string,
  ): Promise<null | JournalEmotionDto> {
    const journalsEmotion = await this.joinRepository
      .createQueryBuilder('ej')
      .leftJoinAndSelect('ej.journal', 'j')
      .leftJoinAndSelect('ej.emotion', 'e')
      .where('j.id = :id', { id })
      .getOne();

    if (!journalsEmotion)
      throw new NotFoundException('Not Exist Journal-Emotion');

    return {
      id: journalsEmotion.id,
      emotionId: journalsEmotion.emotion.id,
      journalId: journalsEmotion.journal.id,
      emotionName: journalsEmotion.emotion.name,
      journalContent: journalsEmotion.journal.content,
      journalDate: journalsEmotion.journal.date,
      intensity: journalsEmotion.intensity,
    };
  }
}
