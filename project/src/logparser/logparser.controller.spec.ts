import { Test, TestingModule } from '@nestjs/testing';
import { LogparserController } from './logparser.controller';
import { LogparserService } from './logparser.service';
import { MatchService } from '../match/match.service';

describe('LogparserController', () => {
  let controller: LogparserController;
  let logparserService: LogparserService;
  let matchService: MatchService;

  beforeEach(async () => {
    const mockLogparserService = {
      processFile: jest.fn(),
    };

    const mockMatchService = {
      saveMatch: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogparserController],
      providers: [
        { provide: LogparserService, useValue: mockLogparserService },
        { provide: MatchService, useValue: mockMatchService },
      ],
    }).compile();

    controller = module.get<LogparserController>(LogparserController);
    logparserService = module.get<LogparserService>(LogparserService);
    matchService = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('should render the upload page', () => {
      const result = controller.upload();
      expect(result).toEqual(undefined);
    });
  });

  describe('uploadFile', () => {
    it('should process the uploaded file and save matches', async () => {
      const mockFile = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.log',
      } as Express.Multer.File;

      const mockParsedMatches = [
        {
          id: 1,
          data: 'test data',
          createdAt: new Date(),
          events: [],
        },
      ];

      jest
        .spyOn(logparserService, 'processFile')
        .mockReturnValue(mockParsedMatches);

      const result = await controller.uploadFile(mockFile);

      expect(logparserService.processFile).toHaveBeenCalledWith(
        'test file content',
      );
      expect(matchService.saveMatch).toHaveBeenCalledWith(mockParsedMatches);

      expect(result).toEqual({ message: 'File uploaded successfully' });
    });

    it('should handle empty files appropriately', async () => {
      const mockEmptyFile = {
        buffer: Buffer.from(''),
        originalname: 'empty.log',
      } as Express.Multer.File;

      const mockEmptyResult = [];
      jest
        .spyOn(logparserService, 'processFile')
        .mockReturnValue(mockEmptyResult);

      const result = await controller.uploadFile(mockEmptyFile);

      expect(logparserService.processFile).toHaveBeenCalledWith('');
      expect(matchService.saveMatch).toHaveBeenCalledWith(mockEmptyResult);
      expect(result).toEqual({ message: 'File uploaded successfully' });
    });
  });
});
