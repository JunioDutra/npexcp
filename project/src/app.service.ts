import { Injectable } from '@nestjs/common';
import {
  LogAction,
  LogEvent,
  Match,
  MatchResponse,
  MatchStatsDto,
  PlayerLogEvent,
  WorldLogEvent,
} from './dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchEntity } from './entities/match.entity';
import { MatchEventEntity } from './entities/match-event.entity';

// Add this interface to represent the view data structure
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
    @InjectRepository(MatchEventEntity)
    private readonly matchEventRepository: Repository<MatchEventEntity>,
  ) {}
  async processFile(file: string) {
    const lines = file.split('\n');
    const result = lines
      .map((line) => {
        const [dateTime, rest] = line.split(' - ');
        const [date, time] = dateTime.split(' ');
        const [day, month, year] = date.split('/');
        const isoDateStr = `${year}-${month}-${day}T${time}`;

        const parsedDate = new Date(isoDateStr);

        if (!date || !time || !rest) {
          return null;
        }

        const matchStartRegex = /New match (\d+) has started/;
        const match = rest.match(matchStartRegex);
        if (match) {
          return {
            when: parsedDate,
            action: LogAction.NewMatch,
            matchId: parseInt(match[1], 10),
          } as LogEvent;
        }

        const matchEndRegex = /Match (\d+) has ended/;
        const matchEnd = rest.match(matchEndRegex);
        if (matchEnd) {
          return {
            when: parsedDate,
            action: LogAction.MatchEnd,
            matchId: parseInt(matchEnd[1], 10),
          } as LogEvent;
        }

        const matchKillRegex = /(.+) killed (.+) using (.+)/;
        const kill = rest.match(matchKillRegex);
        if (kill) {
          return {
            when: parsedDate,
            action: LogAction.PlayerKill,
            player1: kill[1],
            player2: kill[2],
            weapon: kill[3],
          } as PlayerLogEvent;
        }

        const matchKillWorldRegex = /<WORLD> killed (.+) by (.+)/;
        const killWorld = rest.match(matchKillWorldRegex);
        if (killWorld) {
          return {
            when: parsedDate,
            action: LogAction.PlayerKillWorld,
            player1: killWorld[1],
            how: killWorld[2],
          } as WorldLogEvent;
        }
      })
      .filter((item) => item !== null);

    const processedResults: Match[] = [];

    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (item.action === LogAction.NewMatch) {
        const match: Match = {
          id: item.matchId,
          createdAt: item.when,
          events: [],
        };

        for (let j = i + 1; j < result.length; j++) {
          const nextItem = result[j];
          if (nextItem.action === LogAction.MatchEnd) {
            i = j;
            match.finishedAt = nextItem.when;
            break;
          }

          nextItem.matchId = item.matchId;
          match.events.push(nextItem);
        }

        processedResults.push(match);
      }
    }

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
