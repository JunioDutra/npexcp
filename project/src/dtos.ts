export enum LogAction {
  NewMatch = 'New match started',
  MatchEnd = 'Match ended',
  PlayerKill = 'Player killed',
  PlayerKillWorld = 'Player killed by world',
}

export interface LogEvent {
  when: Date;
  action: LogAction;
  matchId?: number;
}

export interface PlayerLogEvent extends LogEvent {
  player1?: string;
  player2?: string;
  weapon?: string;
}

export interface WorldLogEvent extends LogEvent {
  player1: string;
  how: string;
}

export interface Match {
  id: number;
  createdAt: Date;
  finishedAt?: Date;
  events: LogEvent[];
}

export interface MatchResponse {
  id: number;
  started_at: Date;
  finished_at?: Date;
  stats: MatchStatsDto[];
}

export interface MatchStatsDto {
  matchId: number;
  player: string;
  k: number;
  d: number;
  weapon: string;
}
