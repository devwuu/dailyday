import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UpdateJournalsEmotionDto } from './dto/update-journals-emotion.dto';

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

  it('/je (POST)', () => {
    const ej = {
      journalId: 'cb0130ee-4e37-4de7-b3b5-acec5611d687',
      emotionId: 'a34ca11e-d39f-4541-b67d-983b242b0783',
      intensity: '10',
    };

    return request(app.getHttpServer()).post('/je').send(ej).expect(201);
  });

  it('/je/:id (PATCH)', () => {
    const ejId: string = 'e3b16201-7dd3-4da1-b981-52dd7805c525';
    const update: UpdateJournalsEmotionDto = {
      emotionId: '072df4f1-997d-486d-b41e-72b3b94a24ee',
      intensity: '5',
    };
    return request(app.getHttpServer())
      .patch(`/je/${ejId}`)
      .send(update)
      .expect(200);
  });

  it('/je/:id (DELETE)', () => {
    const ejId: string = 'e3b16201-7dd3-4da1-b981-52dd7805c525';
    return request(app.getHttpServer()).delete(`/je/${ejId}`).expect(200);
  });
});
