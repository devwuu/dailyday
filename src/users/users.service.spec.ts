import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * mock 객체를 사용하는 이유
 *  1. 테스트할 유닛 외 다른 유닛을 모두 개발하지 않아도 테스트가 가능함
 *  2. 실제 DB에 데이터가 들어가면 rollback 작업이 필요한데, mock 객체를 사용하면 rollback 하지 않아도 테스트가 가능
 * */

// 가짜 유저
const mockusers = [
  {
    id: 'mockuser-123',
    email: 'test@gmail.com',
    password: '1234',
    name: 'mockuser1',
  },
  {
    id: 'mockuser-124',
    email: 'test@gmail.com',
    password: '5678',
    name: 'mockuser2',
  },
  {
    id: 'mockuser-125',
    email: 'test@gmail.com',
    password: '9012',
    name: 'mockuser3',
  },
];

// 진짜 repository 대신 주입할 repository
class MockRepository {
  //repository.save() 함수 호출시 대신 실행될 함수 정의. 여기선 mockuser의 email을 반환하고 있다
  save = jest
    .fn()
    .mockImplementation((t) => mockusers.find((u) => u.email === t.email));

  exist = jest
    .fn()
    .mockImplementation((t) => mockusers.find((u) => u.email === t.email));

  find = jest.fn().mockResolvedValue(mockusers);

  findOneBy = jest
    .fn()
    .mockImplementation((c) => mockusers.find((u) => u.id === c.id));

  update = jest.fn().mockImplementation((c, u) => {
    mockusers.forEach((target, index) => {
      if (target.id === c.id) {
        mockusers[index] = { ...target, ...u };
      }
    });
    return c.id;
  });
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: MockRepository },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  // 유저 생성 테스트
  describe('create user', () => {
    it('새로운 유저를 생성합니다', async () => {
      const user: CreateUserDto = {
        email: 'test@gmail.com',
        password: '1234',
      };
      const find = await service.create(user);
      console.log('find', find);
      expect(find).toBeDefined();
    });

    it('중복된 email로 유저를 생성할 수 없습니다', () => {
      const existUser: CreateUserDto = {
        email: 'test@gmail.com',
        password: '1234',
      };
      const newUSer: CreateUserDto = {
        email: existUser.email,
        password: existUser.password,
      };
      expect(service.create(existUser)).resolves; // resolves, rejects -> promise 메서드를 테스트 하기 위한 수정자. 이 뒤로 mathcer(toThrowError 같은)를 연이어 사용할 수 있음
      expect(service.create(newUSer)).rejects.toThrowError();
    });
  });

  // 유저 조회 테스트
  describe('find user', () => {
    it('둥록된 모든 유저 정보를 가져옵니다', async () => {
      const all = await service.findAll();
      console.log('all', all);
      expect(all).toBeDefined();
    });

    it('특정 유저 정보를 가져옵니다', async () => {
      const find = await service.findOne('mockuser-123');
      console.log('find', find);
      expect(find).toBeDefined();
    });

    it('등록되지 않은 특정 유저를 조회하면 error가 발생합니다', () => {
      expect(service.findOne('mockuser')).resolves.toThrowError();
    });
  });

  // 유저 수정 테스트
  describe('update user', () => {
    it('유저 정보를 수정합니다', () => {
      const newInfo: UpdateUserDto = {
        email: 'new@test.com',
        name: 'test user',
        password: '1234',
      };
      expect(service.update('mockuser-125', newInfo)).resolves.toBe(
        'mockuser-125',
      );
    });

    it('존재하지 않는 유저 정보를 수정할 시 에러가 발생합니다', () => {
      const newInfo: UpdateUserDto = {
        email: 'new@test.com',
        name: 'test user',
        password: '1234',
      };
      expect(service.update('notexist', newInfo)).rejects.toThrowError();
    });
  });

  // 유저 삭제 테스트
  describe('delete user', () => {});
});
