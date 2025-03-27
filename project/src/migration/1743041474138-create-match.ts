import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMatch1743041474138 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE
        public.match (
          id integer NOT NULL,
          started_at timestamp without time zone NOT NULL,
          finished_at timestamp without time zone NULL
        );

      ALTER TABLE
        public.match
      ADD
        CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY (id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.match;');
  }
}
