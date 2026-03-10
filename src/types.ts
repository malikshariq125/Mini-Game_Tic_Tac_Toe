export type Player = 'X' | 'O' | null;

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

export type ScreenState = 'login' | 'game' | 'stats';
