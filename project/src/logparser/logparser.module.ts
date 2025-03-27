import { Module } from '@nestjs/common';
import { LogparserService } from './logparser.service';
import { LogparserController } from './logparser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from 'src/entities/match.entity';
import { MatchEventEntity } from 'src/entities/match-event.entity';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchEntity, MatchEventEntity]),
    MatchModule,
  ],
  providers: [LogparserService],
  controllers: [LogparserController],
})
export class LogparserModule {}
