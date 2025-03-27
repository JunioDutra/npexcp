import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MatchEntity } from '../entities/match.entity';
import { MatchEventEntity } from '../entities/match-event.entity';
import { join } from 'path';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'dev',
  password: process.env.DB_PASSWORD || 'dev',
  database: process.env.DB_NAME || 'dev',
  entities: [MatchEntity, MatchEventEntity],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
  autoLoadEntities: true,
  migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
  migrationsRun: process.env.DB_RUN_MIGRATIONS === 'true',
};
