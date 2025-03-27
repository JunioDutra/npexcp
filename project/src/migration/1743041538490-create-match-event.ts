import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMatchEvent1743041538490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE match_event_action_enum AS ENUM (
        'New match started',
        'Match ended',
        'Player killed',
        'Player killed by world'
      );`);

    await queryRunner.query(
      `CREATE TABLE
        public.match_event (
          id serial NOT NULL,
          "when" timestamp without time zone NOT NULL,
          action match_event_action_enum NOT NULL,
          player1 character varying NULL,
          player2 character varying NULL,
          weapon character varying NULL,
          how character varying NULL,
          "matchId" integer NULL
        );

      ALTER TABLE
        public.match_event
      ADD
        CONSTRAINT "PK_c1329cb9d3397d63a39a11f6af5" PRIMARY KEY (id)
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE public.match_event_action_enum;');

    await queryRunner.query('DROP TABLE public.match_event;');
  }
}
