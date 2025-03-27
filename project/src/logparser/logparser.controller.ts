import {
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
} from '@nestjs/swagger';
import { LogparserService } from './logparser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MatchService } from '../match/match.service'; // Changed from 'src/match/match.service'

@Controller('logparser')
export class LogparserController {
  constructor(
    private readonly logService: LogparserService,
    private readonly matchService: MatchService,
  ) {}

  @Get('upload')
  @Render('upload')
  @ApiExcludeEndpoint()
  upload() {}

  @Post('upload')
  @Render('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file for processing' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const parsedMatchs = this.logService.processFile(file.buffer.toString());
    await this.matchService.saveMatch(parsedMatchs);
    return { message: 'File uploaded successfully' };
  }
}
