import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * mock 객체를 사용하는 이유
 *  1. 테스트할 유닛 외 다른 유닛을 모두 개발하지 않아도 테스트가 가능함
 *  2. 실제 DB에 데이터가 들어가면 rollback 작업이 필요한데, mock 객체를 사용하면 rollback 하지 않아도 테스트가 가능
 * */

// 가짜 유저
const mockUser = {
  id: 'mockuser-123',
  email: 'test@gmail.com',
  password: bcrypt.hash('1234', 10),
};

// 진짜 repository 대신 주입할 repository
class MockRepository {
  //repository.create() 함수 호출시 대신 실행될 함수 정의. 여기선 mockuser의 email을 반환하고 있다
  create = jest.fn().mockResolvedValue(mockUser.email);
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

  it('새로운 유저를 생성합니다', () => {
    const user = new CreateUserDto('test@gmail.com', '1234');
    expect(service.create(user)).toBeDefined();
  });
});
