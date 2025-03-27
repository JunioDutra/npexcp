import { Test, TestingModule } from '@nestjs/testing';
import { LogparserService } from './logparser.service';

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
});
