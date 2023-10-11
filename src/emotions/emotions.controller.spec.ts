import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import * as request from 'supertest';

describe('EmotionsController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/emotions (POST)', () => {
    const emotion: CreateEmotionDto = {
      name: '기쁨',
      etc: '기쁜 감정',
    };
    return request(app.getHttpServer())
      .post('/emotions')
      .send(emotion)
      .expect(201);
  });
});
