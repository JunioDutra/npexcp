import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRankingView1743041702792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW view_match_stats AS
      WITH
      -- Kills (player1 que matou, excluindo os "world")
      k AS (
        SELECT me."matchId", me.player1 AS player, COUNT(*) AS k
        FROM match_event me
        WHERE me.action <> 'Player killed by world'
        GROUP BY me."matchId", me.player1
      ),
      -- Deaths (player2 que morreu)
      d1 AS (
        SELECT me."matchId", me.player2 AS player, COUNT(*) AS d
        FROM match_event me
        WHERE me.player2 IS NOT NULL
        GROUP BY me."matchId", me.player2
      ),
      -- Deaths por "world" (player1 que morreu)
      d2 AS (
        SELECT me."matchId", me.player1 AS player, COUNT(*) AS d
        FROM match_event me
        WHERE me.action = 'Player killed by world'
        GROUP BY me."matchId", me.player1
      ),
      -- Determina a arma mais utilizada por cada jogador (nos eventos de kill)
      weapon_most AS (
        SELECT sub."matchId", sub.player, sub.weapon
        FROM (
          SELECT
            me."matchId",
            me.player1 AS player,
            me.weapon,
            COUNT(*) AS weapon_count,
            ROW_NUMBER() OVER (
              PARTITION BY me."matchId", me.player1
              ORDER BY COUNT(*) DESC
            ) AS rn
          FROM match_event me
          WHERE me.action <> 'Player killed by world'
          GROUP BY me."matchId", me.player1, me.weapon
        ) sub
        WHERE sub.rn = 1
      )
      SELECT
        COALESCE(k."matchId", d1."matchId", d2."matchId") AS "matchId",
        COALESCE(k.player, d1.player, d2.player) AS player,
        COALESCE(k.k, 0) AS k,
        COALESCE(d1.d, 0) + COALESCE(d2.d, 0) AS d,
        wm.weapon AS weapon
      FROM k
      FULL OUTER JOIN d1
        ON k."matchId" = d1."matchId"
        AND k.player = d1.player
      FULL OUTER JOIN d2
        ON COALESCE(k."matchId", d1."matchId") = d2."matchId"
        AND COALESCE(k.player, d1.player) = d2.player
      LEFT JOIN weapon_most wm
        ON COALESCE(k."matchId", d1."matchId", d2."matchId") = wm."matchId"
        AND COALESCE(k.player, d1.player, d2.player) = wm.player
      ORDER BY "matchId", k DESC;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW view_match_stats');
  }
}
