import { Test, TestingModule } from '@nestjs/testing';
import { LogparserController } from './logparser.controller';

describe('LogparserController', () => {
  let controller: LogparserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogparserController],
    }).compile();

    controller = module.get<LogparserController>(LogparserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
