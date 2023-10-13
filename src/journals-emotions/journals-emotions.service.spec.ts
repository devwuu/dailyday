import { Test, TestingModule } from '@nestjs/testing';
import { JournalsEmotionsService } from './journals-emotions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Emotion } from '../emotions/entities/emotion.entity';
import { Journal } from '../journals/entities/journal.entity';
import { JournalsEmotion } from './entities/journals-emotion.entity';
import { CreateJournalsEmotionDto } from './dto/create-journals-emotion.dto';

const mockemotions = [
  {
    id: 'mockemotion-124',
    name: '기쁨',
    etc: '기쁜 감정',
    userId: 'mockuser-123',
  },
];

const mockjournals = [
  {
    id: 'mockjournal-124',
    content: '새로운 일기',
    date: new Date(2023, 9, 13),
  },
  {
    id: 'mockjournal-123',
    content: '새로운 일기',
    date: new Date(2023, 9, 12),
  },
  {
    id: 'mockjournal-122',
    content: '새로운 일기',
    date: new Date(2023, 9, 11),
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

class JournalMockRepository {
  findOneBy = jest
    .fn()
    .mockImplementation(({ id }) => mockjournals.find((j) => j.id === id));
}

class EmotionMockRepository {
  findOneBy = jest
    .fn()
    .mockImplementation(({ id }) => mockemotions.find((e) => e.id === id));
}

class JoinMockRepository {
  save = jest.fn().mockResolvedValue(mockejs[0]);
  exist = jest.fn().mockImplementation(({ where }) => {
    return mockejs.find((js) => js.journalId === where.journal.id);
  });
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
          provide: getRepositoryToken(Journal),
          useClass: JournalMockRepository,
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
        journalId: 'mockjournal-124',
        emotionId: 'mockemotion-124',
        intensity: '10',
      };
      expect(service.create(ej)).resolves.toBeDefined();
    });

    it('등록되지 않은 감정을 일기에 등록할 수 없습니다', () => {
      const ej: CreateJournalsEmotionDto = {
        journalId: 'mockjournal-124',
        emotionId: 'notexistemotion',
        intensity: '10',
      };
      expect(service.create(ej)).rejects.toThrowError();
    });

    it('등록되지 않은 일기에 감정을 등록할 수 없습니다', () => {
      const ej: CreateJournalsEmotionDto = {
        journalId: 'notexistjournal',
        emotionId: 'mockemotion-124',
        intensity: '10',
      };
      expect(service.create(ej)).rejects.toThrowError();
    });

    it('이미 감정이 등록된 일기일 경우, 중복하여 등록할 수 없습니다', () => {
      const ej: CreateJournalsEmotionDto = {
        journalId: 'mockjournal-122',
        emotionId: 'mockemotion-124',
        intensity: '10',
      };
      expect(service.create(ej)).rejects.toThrowError();
    });
  });
});
