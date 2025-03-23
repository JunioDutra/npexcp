import {
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @Render('index')
  root() {
    return { events: this.appService.getProcessedResults() };
  }

  @Get('upload')
  @Render('upload')
  upload() {}

  @Post('upload')
  @Render('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.appService.processFile(file.buffer.toString());
    return { message: 'File uploaded successfully' };
  }
}
