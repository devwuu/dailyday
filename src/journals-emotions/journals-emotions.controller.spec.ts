import { Test, TestingModule } from '@nestjs/testing';
import { JournalsEmotionsController } from './journals-emotions.controller';
import { JournalsEmotionsService } from './journals-emotions.service';

describe('JournalsEmotionsController', () => {
  let controller: JournalsEmotionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalsEmotionsController],
      providers: [JournalsEmotionsService],
    }).compile();

    controller = module.get<JournalsEmotionsController>(
      JournalsEmotionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
