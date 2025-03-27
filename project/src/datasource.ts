import { DataSource } from 'typeorm';
import { CreateRankingView1743041702792 } from './migration/1743041702792-create-ranking-view';
import { CreateMatch1743041474138 } from './migration/1743041474138-create-match';
import { CreateMatchEvent1743041538490 } from './migration/1743041538490-create-match-event';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'dev',
  password: process.env.DB_PASSWORD || 'dev',
  database: process.env.DB_NAME || 'dev',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
  entities: [],
  subscribers: [],
  migrations: [
    CreateMatch1743041474138,
    CreateMatchEvent1743041538490,
    CreateRankingView1743041702792,
  ],
  migrationsRun: process.env.DB_RUN_MIGRATIONS === 'true',
});
