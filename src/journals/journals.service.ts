import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JournalDto } from './dto/journal.dto';
import { JournalsEmotionsService } from '../journals-emotions/journals-emotions.service';

@Injectable()
export class JournalsService {
  constructor(
    @InjectRepository(Journal)
    private readonly journalRepository: Repository<Journal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly joinService: JournalsEmotionsService,
  ) {}

  async create(
    userId: string,
    createJournalDto: CreateJournalDto,
  ): Promise<null | string> {
    const { intensity, emotionId } = createJournalDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Not exist user');
    const isExist = await this.journalRepository.exist({
      where: {
        date: createJournalDto.date,
      },
    });
    if (isExist) throw new BadRequestException('Journal is already exist');
    const journal = await this.journalRepository.save({
      ...createJournalDto,
      user,
    });

    const joinId = await this.joinService.create({
      intensity,
      emotionId,
      journal,
    });

    return joinId;
  }

  async findAll(userId: string): Promise<null | JournalDto[]> {
    const isUserExist = await this.userRepository.exist({
      where: { id: userId },
    });
    if (!isUserExist) throw new UnauthorizedException('Not exist user');
    const journals = await this.journalRepository
      .createQueryBuilder('j')
      .leftJoin('j.user', 'u')
      .where('u.id = :id', { id: userId })
      .getMany();
    return journals;
  }

  async findOneById(id: string): Promise<null | JournalDto> {
    const journal = await this.journalRepository.findOneBy({ id });
    if (!journal) throw new NotFoundException('Not exist journal');
    return journal;
  }

  async findOneByDate(userId: string, date: Date): Promise<null | JournalDto> {
    const journal = await this.journalRepository
      .createQueryBuilder('j')
      .leftJoin('j.user', 'u')
      .where('u.id = :id', { id: userId })
      .andWhere('j.date = :date', { date })
      .getOne();
    if (!journal) throw new NotFoundException('Not exist journal');
    return journal;
  }

  /**
   * todo journal-emotion 테이블에서 emotion 수정 필요
   * */
  async update(
    id: string,
    updateJournalDto: UpdateJournalDto,
  ): Promise<null | string> {
    const journal = await this.journalRepository.findOneBy({ id });
    if (!journal) throw new NotFoundException('Not exist journal');
    await this.journalRepository.update({ id }, updateJournalDto);
    return id;
  }

  async remove(id: string): Promise<null | string> {
    const isExist = await this.journalRepository.exist({ where: { id } });
    if (!isExist) throw new NotFoundException('Not exist journal');
    await this.journalRepository.softDelete(id);
    return id;
  }
}
