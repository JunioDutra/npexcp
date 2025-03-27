import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from './entities/match.entity';
import { MatchEventEntity } from './entities/match-event.entity';
import { databaseConfig } from './config/database.config';
import { LogparserModule } from './logparser/logparser.module';
import { MatchModule } from './match/match.module';
import { MatchService } from './match/match.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([MatchEntity, MatchEventEntity]),
    LogparserModule,
    MatchModule,
  ],
  controllers: [AppController],
  providers: [MatchService],
})
export class AppModule {}
