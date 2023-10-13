import { Test, TestingModule } from '@nestjs/testing';
import { JournalsEmotionsService } from './journals-emotions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Emotion } from '../emotions/entities/emotion.entity';
import { Journal } from '../journals/entities/journal.entity';
import { JournalsEmotion } from './entities/journals-emotion.entity';

const mockemotions = [
  {
    id: 'mockemotion-124',
    name: '슬픔',
    etc: '슬픈 감정',
    userId: 'mockuser-123',
  },
  {
    id: 'mockemotion-125',
    name: '분노',
    etc: '분노한 감정',
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
    id: 'mockjournal-125',
    content: '새로운 일기',
    date: new Date(2023, 9, 14),
  },
];

class JournalMockRepository {}

class EmotionMockRepository {}

class JoinMockRepository {}

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
});
