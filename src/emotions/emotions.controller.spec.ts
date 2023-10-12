import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UpdateEmotionDto } from './dto/update-emotion.dto';

describe('EmotionsController', () => {
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

  it('/emotions (POST)', () => {
    const emotion: CreateEmotionDto = {
      name: '사랑',
      etc: '사랑하는 감정',
    };
    return request(app.getHttpServer())
      .post('/emotions')
      .send(emotion)
      .expect(201);
  });

  it('/emotions (GET)', () => {
    return request(app.getHttpServer()).get(`/emotions`).expect(200);
  });

  it('/emotions/:id (GET)', () => {
    const emotionId = '50897216-78c7-49da-9e3c-f0dcd693657c';
    return request(app.getHttpServer())
      .get(`/emotions/${emotionId}`)
      .expect(200);
  });

  it('/emotions/:id (PATCH)', () => {
    const emotionId = '50897216-78c7-49da-9e3c-f0dcd693657c';
    const updated: UpdateEmotionDto = {
      name: 'updated emotion',
      etc: 'updated',
    };
    return request(app.getHttpServer())
      .patch(`/emotions/${emotionId}`)
      .send(updated)
      .expect(200);
  });

  it('/emotions/:id (DELETE)', () => {
    const emotionId = '50897216-78c7-49da-9e3c-f0dcd693657c';
    return request(app.getHttpServer())
      .delete(`/emotions/${emotionId}`)
      .expect(200);
  });
});
