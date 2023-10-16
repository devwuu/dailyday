import { Test, TestingModule } from '@nestjs/testing';
import { JournalsEmotionsService } from './journals-emotions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Emotion } from '../emotions/entities/emotion.entity';
import { JournalsEmotion } from './entities/journals-emotion.entity';
import { CreateJournalsEmotionDto } from './dto/create-journals-emotion.dto';
import { UpdateJournalsEmotionDto } from './dto/update-journals-emotion.dto';
import { NotFoundException } from '@nestjs/common';

const mockemotions = [
  {
    id: 'mockemotion-124',
    name: '기쁨',
    etc: '기쁜 감정',
    userId: 'mockuser-123',
  },
];

const mockejs = [
  {
    id: 'mockjs-124',
    intensity: '5',
    journalId: 'mockjournal-122',
    journalContent: '새로운일기',
    journalDate: new Date(2023, 9, 12),
    emotionId: 'mockemotion-124',
    emotionName: '기쁨',
  },
  {
    id: 'mockjs-123',
    intensity: '1',
    journalId: 'mockjournal-123',
    journalContent: '새로운일기',
    journalDate: new Date(2023, 9, 13),
    emotionId: 'mockemotion-124',
    emotionName: '기쁨',
  },
];

class EmotionMockRepository {
  findOneBy = jest
    .fn()
    .mockImplementation(({ id }) => mockemotions.find((e) => e.id === id));
}

class JoinMockRepository {
  save = jest.fn().mockResolvedValue(mockejs[0]);

  exist = jest.fn().mockImplementation(({ where }) => {
    if (where.journal) {
      return mockejs.find((js) => js.journalId === where.journal.id);
    } else {
      return mockejs.find((js) => js.id === where.id);
    }
  });

  update = jest.fn().mockImplementation((id, update) => {
    mockejs.forEach((ej, index) => {
      if (ej.id === id) mockejs[index] = { ...ej, ...update };
    });
  });

  findOneBy = jest
    .fn()
    .mockImplementation(({ id }) => mockejs.find((ej) => ej.id === id));

  delete = jest.fn().mockImplementation((id) => {
    mockejs.forEach((ej, index) => {
      if (ej.id === id) mockejs.splice(index, 1);
    });
  });

  createQueryBuilder = jest.fn(() => ({
    id: '',

    leftJoinAndSelect() {
      return this;
    },
    where(query, { id }) {
      if (id === 'mockjs-123' || id === 'mockjournal-123') this.id = id;
      return this;
    },
    getOne() {
      if (!this.id) throw new NotFoundException('Not Exist Journal-Emotion');
      return {
        id: 'mockjs-123',
        emotion: {
          id: 'mockemotion-124',
          name: '희망',
        },
        journal: {
          id: 'mockjournal-123',
          content: '새로운 일기',
          date: '2023-10-15T15:00:00.000Z',
        },
        intensity: '10',
      };
    },
    getExists() {
      return this.id;
    },
  }));
}

describe('JournalsEmotionsService', () => {
  let service: JournalsEmotionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalsEmotionsService,
        {
          provide: getRepositoryToken(Emotion),
          useClass: EmotionMockRepository,
        },
        {
          provide: getRepositoryToken(JournalsEmotion),
          useClass: JoinMockRepository,
        },
      ],
    }).compile();

    service = module.get<JournalsEmotionsService>(JournalsEmotionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create emotion-journal', () => {
    it('일기에 감정을 등록할 수 있습니다', () => {
      const ej: CreateJournalsEmotionDto = {
        journal: {
          date: new Date(),
          content: '',
          id: '',
          deletedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            email: '',
            password: '',
            id: '',
            updatedAt: new Date(),
            createdAt: new Date(),
            deletedAt: new Date(),
          },
        },
        emotionId: 'mockemotion-124',
        intensity: '10',
      };
      expect(service.create(ej)).resolves.toBeDefined();
    });

    it('이미 감정이 등록된 일기일 경우, 중복하여 등록할 수 없습니다', () => {
      const ej: CreateJournalsEmotionDto = {
        journal: {
          date: new Date(),
          content: '',
          id: 'mockjournal-123',
          deletedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            email: '',
            password: '',
            id: '',
            updatedAt: new Date(),
            createdAt: new Date(),
            deletedAt: new Date(),
          },
        },
        emotionId: 'mockemotion-124',
        intensity: '10',
      };
      expect(service.create(ej)).rejects.toThrowError();
    });
  });

  describe('update emotion-journal', () => {
    it('일기에 등록된 감정을 수정합니다', () => {
      const ej: UpdateJournalsEmotionDto = {
        emotionId: 'mockemotion-124',
        intensity: '8',
      };
      expect(service.update('mockjs-124', ej)).resolves.toEqual('mockjs-124');
    });

    it('등록되지 않은 일기-감장은 수정할 수 없습니다', () => {
      const ej: UpdateJournalsEmotionDto = {
        emotionId: 'mockemotion-124',
        intensity: '8',
      };
      expect(service.update('notexistej', ej)).rejects.toThrowError();
    });

    it('등록되지 않은 감정으로 일기-감정을 수정할 수 없습니다.', () => {
      const ej: UpdateJournalsEmotionDto = {
        emotionId: 'notexistemotion',
        intensity: '8',
      };
      expect(service.update('mockjs-124', ej)).rejects.toThrowError();
    });
  });

  describe('delete emotion-journal', () => {
    it('등록된 일기-감정을 삭제할 수 있습니다', () => {
      expect(service.removeByJournalId('mockjs-123')).resolves.toEqual(
        'mockjs-123',
      );
    });

    it('등록되지 않은 id로 일기-감정을 삭제할 수 없습니다', () => {
      expect(service.removeByJournalId('notexistej')).rejects.toThrowError();
    });
  });

  describe('find emotion-journal', () => {
    it('일기 id로 일기 정보, 감정 정보를 조회할 수 있습니다', () => {
      expect(
        service.findOneByJournalIdWithAllContent('mockjs-123'),
      ).resolves.toBeDefined();
    });

    it('일기 또는 감정이 등록되지 않은 상태에서 일기 정보, 감정 정보를 조회할 수 없습니다', () => {
      expect(
        service.findOneByJournalIdWithAllContent('notexist'),
      ).rejects.toThrowError();
    });
  });
});
