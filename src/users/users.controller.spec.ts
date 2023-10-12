import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

describe('UsersController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            id: '94f3c50c-05e7-4b83-b311-1fb4cf84b3a1',
            email: 'new@test.com',
            name: 'test user',
          };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/users (POST)', () => {
    const user: CreateUserDto = {
      email: 'password1@test.com',
      name: 'test user',
      password: '1234',
    };
    return request(app.getHttpServer()).post('/users').send(user).expect(201);
  });

  it('/users/info (GET)', () => {
    return request(app.getHttpServer()).get(`/users/info`).expect(200);
  });

  it('/users (PATCH)', () => {
    const updateInfo: UpdateUserDto = {
      name: 'hello',
    };
    return request(app.getHttpServer())
      .patch(`/users`)
      .send(updateInfo)
      .expect(200);
  });

  it('/users/password (PATCH)', () => {
    const updateInfo: UpdateUserPasswordDto = {
      oldPassword: '1234',
      newPassword: '0000',
    };
    return request(app.getHttpServer())
      .patch(`/users/password`)
      .send(updateInfo)
      .expect(200);
  });

  it('/users (DELETE)', () => {
    return request(app.getHttpServer()).delete(`/users`).expect(200);
  });
});
