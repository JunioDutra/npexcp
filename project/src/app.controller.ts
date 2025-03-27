import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { MatchService } from './match/match.service';

@Controller()
export class AppController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @Render('index')
  @ApiExcludeEndpoint()
  async root() {
    return {
      events: await this.matchService.findAllMatchs(),
      g_ranking: await this.matchService.findGlobalStats(),
    };
  }
}
