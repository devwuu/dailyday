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
      content: '새로운 일기',
      date: new Date(2023, 9, 16),
    };
    return request(app.getHttpServer())
      .post('/journals')
      .send(journal)
      .expect(201);
  });

  it('/journals/:date (GET)', () => {
    const date = new Date(2023, 9, 16).toISOString();
    return request(app.getHttpServer()).get(`/journals/${date}`).expect(200);
  });

  it('/journals (GET)', () => {
    return request(app.getHttpServer()).get('/journals').expect(200);
  });

  it('/journals/:id (PATCH)', () => {
    const journalId: string = '77ae5c54-964d-4b53-a1c3-ef99400d7613';
    const update = {
      content: 'updated',
    };
    return request(app.getHttpServer())
      .patch(`/journals/${journalId}`)
      .send(update)
      .expect(200);
  });

  it('/journals/:id (DELETE)', () => {
    const journalId: string = '77ae5c54-964d-4b53-a1c3-ef99400d7613';
    return request(app.getHttpServer())
      .delete(`/journals/${journalId}`)
      .expect(200);
  });
});
