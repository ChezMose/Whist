# Whist — Data Model

```ts
type Player = {
  id: string;
  name: string;
  color: string;  // hex color chosen from palette at player creation
};

type Round = {
  roundNumber: number;
  firstPlayerId: string;  // id of the first player for this round
  players: {
    [playerId: string]: {
      contract: number;  // tricks declared
      result: number;    // tricks actually won
      points: number;    // computed: +(1 + result) if met, -(1 + |contract - result|) if missed
    };
  };
};

type Game = {
  id: string;
  startedAt: string;  // ISO 8601
  endedAt?: string;   // ISO 8601, set on game end
  players: Player[];
  rounds: Round[];
};
```
