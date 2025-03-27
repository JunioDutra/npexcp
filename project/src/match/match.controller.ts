import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @ApiOperation({ summary: 'Get ranking' })
  async getRanking() {
    const result = await this.matchService.findAllMatchs();
    return { result };
  }

  @Get('ranking/:id')
  @ApiOperation({ summary: 'Get ranking by MatchID' })
  async getRankingById(@Param('id') id: number) {
    const result = await this.matchService.findMatchStatsById(id);
    return { result };
  }

  @Get('ranking-global')
  @ApiOperation({ summary: 'Get global ranking' })
  async getGlobalRanking() {
    const result = await this.matchService.findGlobalStats();
    return { result };
  }
}
