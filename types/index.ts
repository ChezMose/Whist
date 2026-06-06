export interface Player {
  id: string;
  name: string;
  color: string; // hex from PLAYER_COLORS palette
}

export interface RoundEntry {
  contract: number;  // tricks declared
  result: number;    // tricks actually won
  points: number;    // +(1+result) if result==contract, else -(1+|contract-result|)
}

export interface Round {
  roundNumber: number;
  firstPlayerId?: string; // optional for backward compatibility with saved games
  trickCount?: number;    // total tricks in this round (optional for backward compat)
  players: Record<string, RoundEntry>; // keyed by playerId
}

export interface Game {
  id: string;
  startedAt: string;  // ISO 8601
  endedAt?: string;   // ISO 8601
  players: Player[];
  rounds: Round[];
}
