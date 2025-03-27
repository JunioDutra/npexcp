import { Controller, Get, Render, Query } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { MatchService } from './match/match.service';

@Controller()
export class AppController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @Render('index')
  @ApiExcludeEndpoint()
  async root(@Query('match') match: string) {
    const events = await this.matchService.findAllMatchs();
    const g_ranking = await this.matchService.findGlobalStats();
    const matchStatsById = match
      ? await this.matchService.findMatchStatsById(Number(match))
      : null;
    const allMatchIds = events.map((e) => e.id);
    return {
      events,
      g_ranking,
      m_ranking: matchStatsById?.stats,
      selectedMatch: match || '',
      allMatchIds,
    };
  }
}
