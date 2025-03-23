import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private processedResults: any[] = [];

  processFile(file: string): any[] {
    const lines = file.split('\n');
    const result = lines
      .map((line) => {
        const [dateTime, rest] = line.split(' - ');
        const [date, time] = dateTime.split(' ');

        if (!date || !time || !rest) {
          return null;
        }

        const matchStartRegex = /New match (\d+) has started/;
        const match = rest.match(matchStartRegex);
        if (match) {
          return {
            date,
            time,
            action: 'New match started',
            matchId: match[1],
          };
        }

        const matchEndRegex = /Match (\d+) has ended/;
        const matchEnd = rest.match(matchEndRegex);
        if (matchEnd) {
          return {
            date,
            time,
            action: 'Match ended',
            matchId: matchEnd[1],
          };
        }

        const matchKillRegex = /(.+) killed (.+) using (.+)/;
        const kill = rest.match(matchKillRegex);
        if (kill) {
          return {
            date,
            time,
            action: 'Player killed',
            player1: kill[1],
            player2: kill[2],
            weapon: kill[3],
          };
        }

        const matchKillWorldRegex = /<WORLD> killed (.+) by (.+)/;
        const killWorld = rest.match(matchKillWorldRegex);
        if (killWorld) {
          return {
            date,
            time,
            action: 'Player killed by world',
            player1: killWorld[1],
            how: killWorld[2],
          };
        }
      })
      .filter((item) => item !== null);

    this.processedResults = result;

    return result;
  }

  getProcessedResults(): any[] {
    return this.processedResults;
  }
}
