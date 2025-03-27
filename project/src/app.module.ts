import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from './entities/match.entity';
import { MatchEventEntity } from './entities/match-event.entity';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([MatchEntity, MatchEventEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
