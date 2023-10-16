import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('JournalsController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest();
          request.user = {
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

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('/journals (POST)', () => {
    const journal = {
      emotionId: 'a34ca11e-d39f-4541-b67d-983b242b0783',
      intensity: '10',
      content: '새로운 일기',
      date: new Date(2023, 9, 28),
    };
    return request(app.getHttpServer())
      .post('/journals')
      .send(journal)
      .expect(201);
  });

  it('/journals/:id (PATCH)', () => {
    const journalId: string = '4399d73f-ab9a-4f6d-9b0d-0e6719d9f4bc';
    const update = {
      intensity: '20',
      emotionId: 'a34ca11e-d39f-4541-b67d-983b242b0783',
      emotionJournalId: '097a6fc8-4115-4af6-a1de-86ac82c5d127',
      content: 'updated journal',
    };
    return request(app.getHttpServer())
      .patch(`/journals/${journalId}`)
      .send(update)
      .expect(200);
  });

  it('/journals/:id (DELETE)', () => {
    const journalId: string = '4399d73f-ab9a-4f6d-9b0d-0e6719d9f4bc';
    return request(app.getHttpServer())
      .delete(`/journals/${journalId}`)
      .expect(200);
  });
});
