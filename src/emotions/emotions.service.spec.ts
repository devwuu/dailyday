import { Test, TestingModule } from '@nestjs/testing';
import { EmotionsService } from './emotions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Emotion } from './entities/emotion.entity';
import { User } from '../users/entities/user.entity';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';

const mockuser = [
  {
    id: 'mockuser-123',
    email: 'test@gmail.com',
    password: '1234',
    name: 'mockuser1',
  },
];

const mockemotions = [
  {
    id: 'mockemotion-123',
    name: '행복',
    etc: '행복한 감정',
    userId: 'mockuser-123',
  },
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

class EmotionMockRepository {
  save = jest.fn().mockResolvedValue(mockemotions[0]);
  find = jest.fn().mockResolvedValue(mockemotions);
  findOneBy = jest.fn().mockImplementation((c) => {
    return mockemotions.find((e) => e.id === c.id);
  });
  update = jest.fn().mockImplementation((id, dto) => {
    mockemotions.forEach((target, index) => {
      if (target.id === id) {
        mockemotions[index] = { ...target, ...dto };
      }
    });
    return id;
  });
  softDelete = jest.fn().mockImplementation((id) => {
    mockemotions.forEach((e, index) => {
      if (e.id === id) mockemotions.splice(index, 1);
    });
  });
}

class UserMockRepository {
  findOneBy = jest
    .fn()
    .mockImplementation((c) => mockuser.find((u) => u.id === c.id));
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

    it('등록되지 않은 유저가 새로운 감정을 등록할 시 에러가 발생합니다', () => {
      const emotion: CreateEmotionDto = {
        name: '행복',
        etc: '행복한 감정',
      };
      expect(service.create('notexistuser', emotion)).rejects.toThrowError();
    });
  });

  describe('find emotions', () => {
    it('해당 user가 등록한 모든 감정을 가져옵니다', () => {
      expect(service.findAll('mockuser-123')).resolves.toBeDefined();
    });

    it('등록되지 않은 유저가 감정 찾기를 시도하면 에러가 발생합니다', () => {
      expect(service.findAll('notexist')).rejects.toThrowError();
    });

    it('감정 id를 이용해 감정을 찾을 수 있습니다', () => {
      expect(service.findOneById('mockemotion-124')).resolves.toBeDefined();
    });

    it('존재하지 않는 감정 id를 찾으려 할 경우 에러가 발생합니다', () => {
      expect(service.findOneById('notexistid')).rejects.toThrowError();
    });
  });

  describe('update emotion', () => {
    it('감정 id로 특정 감정을 수정할 수 있습니다', () => {
      const update: UpdateEmotionDto = {
        name: 'updated emotion',
        etc: 'updated',
      };
      expect(service.update('mockemotion-124', update)).resolves.toEqual(
        'mockemotion-124',
      );
    });

    it('존재하지 않는 감정id로 감정을 수정하려 할 경우 에러가 발생합니다', () => {
      const update: UpdateEmotionDto = {
        name: 'updated emotion',
        etc: 'updated',
      };
      expect(service.update('notexistid', update)).rejects.toThrowError();
    });
  });

  describe('delete emotion', () => {
    it('감정id로 감정을 삭제할 수 있습니다', () => {
      expect(service.remove('mockemotion-124')).resolves.toEqual(
        'mockemotion-124',
      );
    });

    it('존재하지 않는 감정id로 삭제를 시도할 경우 에러가 발생합니다', () => {
      expect(service.remove('notexistid')).rejects.toThrowError();
    });
  });
});
