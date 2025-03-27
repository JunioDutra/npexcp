import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { MatchService } from './match/match.service';

describe('AppController', () => {
  let appController: AppController;

  const mockMatchService = {
    findAllMatchs: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    findGlobalStats: jest.fn().mockResolvedValue('global stats'),
    findMatchStatsById: jest
      .fn()
      .mockImplementation((id: number) =>
        Promise.resolve(id === 1 ? { stats: 'matchstats' } : null),
      ),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: MatchService, useValue: mockMatchService }],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('root method', () => {
    it('should return the expected view model without match query', async () => {
      const result = await appController.root('');
      expect(result).toEqual({
        events: [{ id: 1 }, { id: 2 }],
        g_ranking: 'global stats',
        m_ranking: undefined,
        selectedMatch: '',
        allMatchIds: [1, 2],
      });
    });

    it('should return the expected view model with match query provided and found', async () => {
      const result = await appController.root('1');
      expect(result).toEqual({
        events: [{ id: 1 }, { id: 2 }],
        g_ranking: 'global stats',
        m_ranking: 'matchstats',
        selectedMatch: '1',
        allMatchIds: [1, 2],
      });
      expect(mockMatchService.findMatchStatsById).toHaveBeenCalledWith(1);
    });

    it('should return the expected view model with match query provided but not found', async () => {
      const result = await appController.root('2');
      expect(result).toEqual({
        events: [{ id: 1 }, { id: 2 }],
        g_ranking: 'global stats',
        m_ranking: undefined,
        selectedMatch: '2',
        allMatchIds: [1, 2],
      });
    });
  });
});
