import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  it('/users/:id (GET)', () => {
    const userId: string = '075b9be6-6d99-4e08-942d-4e392fef80a7';
    return request(app.getHttpServer()).get(`/users/${userId}`).expect(200);
  });

  it('/users/:id (PATCH)', () => {
    const userId: string = '075b9be6-6d99-4e08-942d-4e392fef80a7';
    const updateInfo: UpdateUserDto = {
      name: 'hello',
    };
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updateInfo)
      .expect(200);
  });

  it('/users/password/:id (PATCH)', () => {
    const userId: string = 'c239d3ba-0a1f-4668-b661-e35bf4217298';
    // $2b$10$upeT2OoyEJOjtwl2nRScmuhZ7vvV1Blr2GC/7n6NW8FhNlOUgyWSK
    const updateInfo: UpdateUserPasswordDto = {
      oldPassword: '1234',
      newPassword: '0000',
    };
    return request(app.getHttpServer())
      .patch(`/users/password/${userId}`)
      .send(updateInfo)
      .expect(200);
  });

  it('/users/{:id} (DELETE)', () => {
    const userId: string = '6b23e325-b795-4dbe-bdcc-78cfc805f332';
    return request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
  });
});
