import { Injectable } from '@nestjs/common';
import {
  LogAction,
  LogEvent,
  PlayerLogEvent,
  WorldLogEvent,
  Match,
} from '../dtos';

@Injectable()
export class LogparserService {
  processFile(file: string): Match[] {
    const lines = file.split('\n');
    const result = lines
      .map((line) => {
        const [dateTime, rest] = line.split(' - ');
        const [date, time] = dateTime.split(' ');
        const [day, month, year] = date.split('/');
        const isoDateStr = `${year}-${month}-${day}T${time}`;

        const parsedDate = new Date(isoDateStr);

        if (!date || !time || !rest) {
          return null;
        }

        const matchStartRegex = /New match (\d+) has started/;
        const match = rest.match(matchStartRegex);
        if (match) {
          return {
            when: parsedDate,
            action: LogAction.NewMatch,
            matchId: parseInt(match[1], 10),
          } as LogEvent;
        }

        const matchEndRegex = /Match (\d+) has ended/;
        const matchEnd = rest.match(matchEndRegex);
        if (matchEnd) {
          return {
            when: parsedDate,
            action: LogAction.MatchEnd,
            matchId: parseInt(matchEnd[1], 10),
          } as LogEvent;
        }

        const matchKillRegex = /(.+) killed (.+) using (.+)/;
        const kill = rest.match(matchKillRegex);
        if (kill) {
          return {
            when: parsedDate,
            action: LogAction.PlayerKill,
            player1: kill[1],
            player2: kill[2],
            weapon: kill[3],
          } as PlayerLogEvent;
        }

        const matchKillWorldRegex = /<WORLD> killed (.+) by (.+)/;
        const killWorld = rest.match(matchKillWorldRegex);
        if (killWorld) {
          return {
            when: parsedDate,
            action: LogAction.PlayerKillWorld,
            player1: killWorld[1],
            how: killWorld[2],
          } as WorldLogEvent;
        }
      })
      .filter((item) => item !== null);

    const processedResults: Match[] = [];

    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (item.action === LogAction.NewMatch) {
        const match: Match = {
          id: item.matchId,
          createdAt: item.when,
          events: [],
        };

        for (let j = i + 1; j < result.length; j++) {
          const nextItem = result[j];
          if (nextItem.action === LogAction.MatchEnd) {
            i = j;
            match.finishedAt = nextItem.when;
            break;
          }

          nextItem.matchId = item.matchId;
          match.events.push(nextItem);
        }

        processedResults.push(match);
      }
    }

    return processedResults;
  }
}
