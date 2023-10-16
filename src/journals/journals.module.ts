import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { UsersModule } from '../users/users.module';
import { JournalsEmotionsModule } from '../journals-emotions/journals-emotions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journal]),
    UsersModule,
    JournalsEmotionsModule,
  ],
  controllers: [JournalsController],
  providers: [JournalsService],
  exports: [TypeOrmModule],
})
export class JournalsModule {}
