import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('JournalsEmotionsController', () => {
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

  it('/je/id/:id (GET)', () => {
    const ej = {
      journalId: 'cb0130ee-4e37-4de7-b3b5-acec5611d687',
      emotionId: 'a34ca11e-d39f-4541-b67d-983b242b0783',
      intensity: '10',
    };

    return request(app.getHttpServer()).post('/je').send(ej).expect(201);
  });

  it('/je/date/:date (GET)', () => {
    const ej = {
      journalId: 'cb0130ee-4e37-4de7-b3b5-acec5611d687',
      emotionId: 'a34ca11e-d39f-4541-b67d-983b242b0783',
      intensity: '10',
    };

    return request(app.getHttpServer()).post('/je').send(ej).expect(201);
  });
});
