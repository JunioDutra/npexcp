import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchService } from './match.service';
import { MatchEntity } from '../entities/match.entity';
import { MatchEventEntity } from '../entities/match-event.entity';
import {
  LogAction,
  Match,
  MatchStatsDto,
  PlayerLogEvent,
  WorldLogEvent,
} from '../dtos';

describe('MatchService', () => {
  let service: MatchService;
  let matchRepository: Repository<MatchEntity>;
  let matchEventRepository: Repository<MatchEventEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(MatchEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            query: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MatchEventEntity),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    matchRepository = module.get<Repository<MatchEntity>>(
      getRepositoryToken(MatchEntity),
    );
    matchEventRepository = module.get<Repository<MatchEventEntity>>(
      getRepositoryToken(MatchEventEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveMatch', () => {
    it('should save match and its events', async () => {
      const now = new Date();
      const matchEntity = {
        id: 1,
        started_at: now,
        finished_at: now,
      } as MatchEntity;
      const playerKillEvent: PlayerLogEvent = {
        when: now,
        action: LogAction.PlayerKill,
        player1: 'player1',
        player2: 'player2',
        weapon: 'weapon',
      };
      const worldKillEvent: WorldLogEvent = {
        when: now,
        action: LogAction.PlayerKillWorld,
        player1: 'player1',
        how: 'fell',
      };

      const matchesToSave: Match[] = [
        {
          id: 1,
          createdAt: now,
          finishedAt: now,
          events: [playerKillEvent, worldKillEvent],
        },
      ];

      jest.spyOn(matchRepository, 'save').mockResolvedValue(matchEntity);
      jest
        .spyOn(matchEventRepository, 'save')
        .mockResolvedValue({} as MatchEventEntity);

      await service.saveMatch(matchesToSave);

      expect(matchRepository.save).toHaveBeenCalledWith({
        id: 1,
        started_at: now,
        finished_at: now,
      });
      expect(matchEventRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAllMatchs', () => {
    it('should return all matches with their events', async () => {
      const matches = [
        { id: 1, started_at: new Date(), finished_at: new Date(), events: [] },
      ] as MatchEntity[];

      jest.spyOn(matchRepository, 'find').mockResolvedValue(matches);

      const result = await service.findAllMatchs();

      expect(matchRepository.find).toHaveBeenCalledWith({
        relations: ['events'],
      });
      expect(result).toEqual(matches);
    });
  });

  describe('findGlobalStats', () => {
    it('should return global stats ordered by kills and deaths', async () => {
      const stats = [
        { player: 'player1', k: 10, d: 5 },
        { player: 'player2', k: 8, d: 3 },
      ] as MatchStatsDto[];

      jest.spyOn(matchRepository, 'query').mockResolvedValue(stats);

      const result = await service.findGlobalStats();

      expect(matchRepository.query).toHaveBeenCalledWith(
        'SELECT * FROM view_match_stats vms order by vms.k desc, vms.d asc',
      );
      expect(result).toEqual(stats);
    });
  });

  describe('findMatchStatsById', () => {
    it('should return stats for a specific match', async () => {
      const matchId = 1;
      const match = {
        id: matchId,
        started_at: new Date(),
        finished_at: new Date(),
      } as MatchEntity;
      const stats = [
        { player: 'player1', k: 10, d: 5, matchId },
        { player: 'player2', k: 8, d: 3, matchId },
      ] as MatchStatsDto[];

      jest.spyOn(matchRepository, 'findOne').mockResolvedValue(match);
      jest.spyOn(matchRepository, 'query').mockResolvedValue(stats);

      const result = await service.findMatchStatsById(matchId);

      expect(matchRepository.findOne).toHaveBeenCalledWith({
        where: { id: matchId },
      });
      expect(matchRepository.query).toHaveBeenCalledWith(
        'SELECT * FROM view_match_stats vms WHERE "matchId" = $1 order by vms.k desc, vms.d asc',
        [matchId],
      );
      expect(result).toEqual({
        id: matchId,
        started_at: match.started_at,
        finished_at: match.finished_at,
        stats,
      });
    });

    it('should return empty object when match does not exist', async () => {
      const matchId = 999;
      jest.spyOn(matchRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findMatchStatsById(matchId);

      expect(result).toEqual({});
      expect(matchRepository.query).not.toHaveBeenCalled();
    });
  });
});
