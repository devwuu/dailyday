import { Test, TestingModule } from '@nestjs/testing';
import { EmotionsService } from './emotions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Emotion } from './entities/emotion.entity';
import { User } from '../users/entities/user.entity';
import { CreateEmotionDto } from './dto/create-emotion.dto';

const mockuser = {
  id: 'mockuser-123',
  email: 'test@gmail.com',
  password: '1234',
  name: 'mockuser1',
};

const mockemotions = [
  {
    id: 'mockemotion-123',
    name: '행복',
    etc: '행복한 감정',
    userId: 'mockuser-123',
  },
];

class EmotionMockRepository {
  save = jest.fn().mockResolvedValue(mockemotions[0]);
}

class UserMockRepository {
  findOneBy = jest.fn().mockResolvedValue(mockuser);
}

describe('EmotionsService', () => {
  let service: EmotionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmotionsService,
        {
          provide: getRepositoryToken(Emotion),
          useClass: EmotionMockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: UserMockRepository,
        },
      ],
    }).compile();

    service = module.get<EmotionsService>(EmotionsService);
  });

  describe('create emotion', () => {
    it('새로운 감정을 등록합니다', () => {
      const emotion: CreateEmotionDto = {
        name: '행복',
        etc: '행복한 감정',
      };
      expect(service.create('mockuser-123', emotion)).resolves.toBeDefined();
    });
  });
});
