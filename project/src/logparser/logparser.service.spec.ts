import { Test, TestingModule } from '@nestjs/testing';
import { LogparserService } from './logparser.service';
import { LogAction, PlayerLogEvent, WorldLogEvent } from '../dtos';

describe('LogparserService', () => {
  let service: LogparserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogparserService],
    }).compile();

    service = module.get<LogparserService>(LogparserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processFile', () => {
    it('should return empty array for empty file', () => {
      const result = service.processFile('');
      expect(result).toEqual([]);
    });

    it('should process a single match correctly', () => {
      const logContent = `23/04/2013 15:34:22 - New match 11348965 has started
23/04/2013 15:36:04 - Roman killed Nick using M16
23/04/2013 15:36:33 - <WORLD> killed Nick by DROWN
23/04/2013 15:39:22 - Match 11348965 has ended`;

      const result = service.processFile(logContent);

      expect(result).toHaveLength(1);
      expect(result[0].id).toEqual(11348965);
      expect(result[0].events).toHaveLength(2);
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].finishedAt).toBeInstanceOf(Date);
    });

    it('should process multiple matches correctly', () => {
      const logContent = `23/04/2013 15:34:22 - New match 11348965 has started
23/04/2013 15:36:04 - Roman killed Nick using M16
23/04/2013 15:39:22 - Match 11348965 has ended
23/04/2013 15:42:22 - New match 11348966 has started
23/04/2013 15:44:04 - Sarah killed Tom using AK47
23/04/2013 15:46:22 - Match 11348966 has ended`;

      const result = service.processFile(logContent);

      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(11348965);
      expect(result[1].id).toEqual(11348966);
      expect(result[0].events).toHaveLength(1);
      expect(result[1].events).toHaveLength(1);
    });

    it('should parse player kill events correctly', () => {
      const logContent = `23/04/2013 15:34:22 - New match 11348965 has started
23/04/2013 15:36:04 - Roman killed Nick using M16
23/04/2013 15:39:22 - Match 11348965 has ended`;

      const result = service.processFile(logContent);

      const killEvent = result[0].events[0] as PlayerLogEvent;
      expect(killEvent.action).toEqual(LogAction.PlayerKill);
      expect(killEvent.player1).toEqual('Roman');
      expect(killEvent.player2).toEqual('Nick');
      expect(killEvent.weapon).toEqual('M16');
    });

    it('should parse world kill events correctly', () => {
      const logContent = `23/04/2013 15:34:22 - New match 11348965 has started
23/04/2013 15:36:33 - <WORLD> killed Nick by DROWN
23/04/2013 15:39:22 - Match 11348965 has ended`;

      const result = service.processFile(logContent);

      const worldKillEvent = result[0].events[0] as WorldLogEvent;
      expect(worldKillEvent.action).toEqual(LogAction.PlayerKillWorld);
      expect(worldKillEvent.player1).toEqual('Nick');
      expect(worldKillEvent.how).toEqual('DROWN');
    });

    it('should handle malformed log lines gracefully', () => {
      const logContent = `23/04/2013 15:34:22 - New match 11348965 has started
This line is malformed and should be ignored
23/04/2013 15:36:04 - Roman killed Nick using M16
23/04/2013 15:39:22 - Match 11348965 has ended`;

      const result = service.processFile(logContent);

      expect(result).toHaveLength(1);
      expect(result[0].events).toHaveLength(1);
    });

    it('should handle date parsing correctly', () => {
      const logContent = `23/04/2013 15:34:22 - New match 11348965 has started
23/04/2013 15:39:22 - Match 11348965 has ended`;

      const result = service.processFile(logContent);

      const expectedStartDate = new Date('2013-04-23T15:34:22');
      const expectedEndDate = new Date('2013-04-23T15:39:22');

      expect(result[0].createdAt.getTime()).toEqual(
        expectedStartDate.getTime(),
      );
      expect(result[0].finishedAt.getTime()).toEqual(expectedEndDate.getTime());
    });
  });
});
