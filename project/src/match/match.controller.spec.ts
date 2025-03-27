import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;
  let service: MatchService;

  const mockMatches = [
    { id: 1, name: 'Match 1' },
    { id: 2, name: 'Match 2' },
  ];
  const mockMatchStats = {
    id: 1,
    name: 'Match 1',
    stats: { wins: 10, losses: 5 },
  };
  const mockGlobalStats = {
    totalMatches: 50,
    totalPlayers: 20,
    averageScore: 75,
  };

  beforeEach(async () => {
    const mockMatchService = {
      findAllMatchs: jest.fn().mockResolvedValue(mockMatches),
      findMatchStatsById: jest.fn().mockResolvedValue(mockMatchStats),
      findGlobalStats: jest.fn().mockResolvedValue(mockGlobalStats),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: mockMatchService,
        },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return all matches', async () => {
      const result = await controller.getRanking();

      expect(service.findAllMatchs).toHaveBeenCalled();
      expect(result).toEqual({ result: mockMatches });
    });
  });

  describe('getRankingById', () => {
    it('should return match stats by id', async () => {
      const matchId = 1;
      const result = await controller.getRankingById(matchId);

      expect(service.findMatchStatsById).toHaveBeenCalledWith(matchId);
      expect(result).toEqual({ result: mockMatchStats });
    });
  });

  describe('getGlobalRanking', () => {
    it('should return global stats', async () => {
      const result = await controller.getGlobalRanking();

      expect(service.findGlobalStats).toHaveBeenCalled();
      expect(result).toEqual({ result: mockGlobalStats });
    });
  });
});
