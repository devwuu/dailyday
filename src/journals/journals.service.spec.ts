import { Test, TestingModule } from '@nestjs/testing';
import { JournalsService } from './journals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { CreateJournalDto } from './dto/create-journal.dto';
import { User } from '../users/entities/user.entity';
import { UpdateJournalDto } from './dto/update-journal.dto';

const mockuser = [
  {
    id: 'mockuser-123',
    email: 'test@test.com',
    password: '1234',
    name: 'mockuser1',
  },
];

const mockJournals = [
  {
    id: 'mockjournal-123',
    content: '새로운 일기',
    date: new Date(2023, 9, 12),
  },
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

class MockUserRepository {
  findOneBy = jest
    .fn()
    .mockImplementation((c) => mockuser.find((u) => u.id === c.id));
  exist = jest.fn().mockImplementation((c) => {
    return mockuser.find((u) => u.id === c.where.id);
  });
}

class MockJournalRepository {
  save = jest.fn().mockResolvedValue(mockJournals[0]);
  findOneBy = jest.fn().mockImplementation((c) => {
    if (c.date) {
      return mockJournals.find((j) => +j.date === +c.date);
    } else {
      return mockJournals.find((j) => j.id === c.id);
    }
  });
  exist = jest
    .fn()
    .mockImplementation((c) => mockJournals.find((j) => j.id === c.where.id));
  softDelete = jest.fn().mockImplementation((id) => {
    mockJournals.forEach((j, index) => {
      if (j.id === id) mockJournals.splice(index, 1);
    });
    console.log(mockJournals);
    return id;
  });
  createQueryBuilder = jest.fn(() => ({
    condition: '',
    leftJoin() {
      return this;
    },
    where() {
      return this;
    },
    andWhere(query, c) {
      this.condition = c;
      return this;
    },
    getOne() {
      return mockJournals.find((j) => +j.date === +this.condition);
    },
    getMany() {
      return mockJournals;
    },
  }));
  update = jest.fn().mockImplementation((c, dto) => {
    mockJournals.forEach((j, index) => {
      if (j.id === c.id) mockJournals[index] = { ...j, ...dto };
    });
    return c.id;
  });
}

describe('JournalsService', () => {
  let service: JournalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalsService,
        {
          provide: getRepositoryToken(Journal),
          useClass: MockJournalRepository,
        },
        { provide: getRepositoryToken(User), useClass: MockUserRepository },
      ],
    }).compile();

    service = module.get<JournalsService>(JournalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create journal', () => {
    it('새로운 일기를 등록합니다', () => {
      const journal: CreateJournalDto = {
        content: '새로운 일기',
        date: new Date(Date.now()),
      };
      expect(service.create('mockuser-123', journal)).resolves.toBeDefined();
    });

    it('중복된 날짜로 일기를 등록할 수 없습니다', () => {
      const journal: CreateJournalDto = {
        content: '시간이 중복된 일기',
        date: new Date(2023, 9, 13),
      };
      expect(service.create('mockuser-123', journal)).rejects.toThrowError();
    });

    it('등록되지 않은 유저로 일기를 등록할 수 없습니다', () => {
      const journal: CreateJournalDto = {
        content: '존재하지 않는 유저',
        date: new Date(2023, 9, 13),
      };
      expect(service.create('notexistuser', journal)).rejects.toThrowError();
    });
  });

  describe('find journal', () => {
    it('일기 id로 일기를 찾을 수 있습니다', () => {
      expect(service.findOneById('mockjournal-124')).resolves.toBeDefined();
    });

    it('존재하지 않는 일기 id로 일기를 찾을 경우 에러가 발생합니다', () => {
      expect(service.findOneById('noteixstjournal')).rejects.toThrowError();
    });

    it('일기 날짜로 일기를 찾을 수 있습니다', () => {
      const userId = 'mockuser-123';
      const date = new Date(2023, 9, 14);
      expect(service.findOneByDate(userId, date)).resolves.toBeDefined();
    });

    it('해당 날짜에 등록된 일기가 없을 경우 에러가 발생합니다', () => {
      const userId = 'mockuser-123';
      const date = new Date(2023, 10, 14);
      expect(service.findOneByDate(userId, date)).rejects.toThrowError();
    });

    it('해당 user가 등록한 모든 일기를 찾을 수 있습니다', () => {
      expect(service.findAll('mockuser-123')).resolves.toBeDefined();
    });

    it('등록되지 않은 유저로 일기를 조회할 수 없습니다', () => {
      expect(service.findAll('notexistuser')).rejects.toThrowError();
    });
  });

  describe('update journal', () => {
    it('등록된 일기 내용으르 수정합니다', () => {
      const journal: UpdateJournalDto = {
        content: 'updated',
      };
      expect(service.update('mockjournal-124', journal)).resolves.toBeDefined();
    });
    it('등록되지 않은 일기 id로 일기를 수정하려고 할 경우 에러가 발생합니다', () => {
      const journal: UpdateJournalDto = {
        content: 'updated',
      };
      expect(service.update('notexistjournal', journal)).rejects.toThrowError();
    });
  });

  describe('delete journal', () => {
    it('등록된 일기 id로 일기를 삭제할 수 있습니다', () => {
      expect(service.remove('mockjournal-123')).resolves.toEqual(
        'mockjournal-123',
      );
    });
    it('등록된 일기 id가 없을 경우, 일기를 삭제시 에러가 발생합니다', () => {
      expect(service.remove('notexistjournal')).rejects.toThrowError();
    });
  });
});
