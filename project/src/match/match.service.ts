import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MatchStatsDto,
  MatchResponse,
  Match,
  LogAction,
  PlayerLogEvent,
  WorldLogEvent,
} from '../dtos';
import { MatchEventEntity } from '../entities/match-event.entity';
import { MatchEntity } from '../entities/match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(MatchEventEntity)
    private readonly matchEventRepository: Repository<MatchEventEntity>,
  ) {}
  async saveMatch(processedResults: Match[]) {
    for (const match of processedResults) {
      const matchEntity = await this.matchRepository.save({
        id: match.id,
        started_at: match.createdAt,
        finished_at: match.finishedAt,
      } as MatchEntity);

      for (const event of match.events) {
        if (event.action === LogAction.PlayerKill) {
          await this.matchEventRepository.save({
            match: matchEntity,
            when: event.when,
            action: event.action,
            player1: (event as PlayerLogEvent).player1,
            player2: (event as PlayerLogEvent).player2,
            weapon: (event as PlayerLogEvent).weapon,
          } as MatchEventEntity);
        } else if (event.action === LogAction.PlayerKillWorld) {
          await this.matchEventRepository.save({
            match: matchEntity,
            when: event.when,
            action: event.action,
            player1: (event as WorldLogEvent).player1,
            how: (event as WorldLogEvent).how,
          } as MatchEventEntity);
        }
      }
    }
  }

  async findAllMatchs(): Promise<MatchEntity[]> {
    const matchs = await this.matchRepository.find({
      relations: ['events'],
    });
    return matchs;
  }

  async findGlobalStats(): Promise<MatchStatsDto[]> {
    const stats = (await this.matchRepository.query(
      'SELECT * FROM view_match_stats vms order by vms.k desc, vms.d asc',
    )) as MatchStatsDto[];

    return stats;
  }

  async findMatchStatsById(matchId: number): Promise<MatchResponse> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      return {} as MatchResponse;
    }

    const stats = (await this.matchRepository.query(
      'SELECT * FROM view_match_stats vms WHERE "matchId" = $1 order by vms.k desc, vms.d asc',
      [matchId],
    )) as MatchStatsDto[];

    return {
      id: match.id,
      started_at: match.started_at,
      finished_at: match.finished_at,
      stats,
    } as MatchResponse;
  }
}
