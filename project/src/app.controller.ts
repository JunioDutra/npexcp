import {
  Controller,
  Get,
  Param,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  @ApiExcludeEndpoint()
  async root() {
    return { events: await this.appService.findAllMatchs() };
  }

  @Get('upload')
  @Render('upload')
  @ApiExcludeEndpoint()
  upload() {}

  @Get('match')
  @ApiOperation({ summary: 'Get ranking' })
  async getRanking() {
    const result = await this.appService.findAllMatchs();
    return { result };
  }

  @Get('ranking/:id')
  @ApiOperation({ summary: 'Get ranking by ID' })
  async getRankingById(@Param('id') id: number) {
    const result = await this.appService.findMatchStatsById(id);
    return { result };
  }

  @Get('ranking-global')
  @ApiOperation({ summary: 'Get global ranking' })
  async getGlobalRanking() {
    const result = await this.appService.findGlobalStats();
    return { result };
  }

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
    await this.appService.processFile(file.buffer.toString());
    return { message: 'File uploaded successfully' };
  }
}
