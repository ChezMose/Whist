import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Game, Player, Round, RoundEntry } from '../types';

export type GamePhase = 'idle' | 'contracts' | 'result';

interface ActiveRound {
  trickCount: number;                  // total tricks in this round
  contracts: Record<string, number>;   // playerId -> declared tricks
  results: Record<string, number>;     // playerId -> actual tricks
  currentPlayerIndex: number;
}

interface GameState {
  game: Game | null;
  phase: GamePhase;
  activeRound: ActiveRound | null;

  // Setup
  startGame: (players: Player[]) => void;

  // Contracts phase
  beginContracts: () => void;
  setTrickCount: (count: number) => void;
  setContract: (playerId: string, value: number) => void;
  confirmContract: () => void; // advances to next player or returns to game screen

  // Result phase
  beginResult: () => void;
  setResult: (playerId: string, value: number) => void;
  confirmResult: () => void; // advances to next player or commits round

  // Game end
  exitGame: () => void;
}

function computePoints(contract: number, outcome: number): number {
  if (outcome === contract) return 1 + outcome;
  return -(1 + Math.abs(contract - outcome));
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      game: null,
      phase: 'idle',
      activeRound: null,

      startGame: (players) =>
        set({
          game: {
            id: new Date().toISOString() + '-' + Math.random().toString(36).slice(2, 7),
            startedAt: new Date().toISOString(),
            players,
            rounds: [],
          },
          phase: 'idle',
          activeRound: null,
        }),

      beginContracts: () =>
        set({
          phase: 'contracts',
          activeRound: { trickCount: 0, contracts: {}, results: {}, currentPlayerIndex: 0 },
        }),

      setTrickCount: (count) =>
        set((s) => ({
          activeRound: s.activeRound ? { ...s.activeRound, trickCount: count } : s.activeRound,
        })),

      setContract: (playerId, value) =>
        set((s) => ({
          activeRound: s.activeRound
            ? { ...s.activeRound, contracts: { ...s.activeRound.contracts, [playerId]: value } }
            : s.activeRound,
        })),

      confirmContract: () => {
        const { game, activeRound } = get();
        if (!game || !activeRound) return;
        const nextIndex = activeRound.currentPlayerIndex + 1;
        if (nextIndex < game.players.length) {
          set({ activeRound: { ...activeRound, currentPlayerIndex: nextIndex } });
        } else {
          // Return to game screen so the user can review contracts before entering results
          set({ phase: 'idle', activeRound: { ...activeRound, currentPlayerIndex: 0 } });
        }
      },

      beginResult: () =>
        set((s) => ({
          phase: 'result',
          activeRound: s.activeRound ? { ...s.activeRound, currentPlayerIndex: 0 } : s.activeRound,
        })),

      setResult: (playerId, value) =>
        set((s) => ({
          activeRound: s.activeRound
            ? { ...s.activeRound, results: { ...s.activeRound.results, [playerId]: value } }
            : s.activeRound,
        })),

      confirmResult: () => {
        const { game, activeRound } = get();
        if (!game || !activeRound) return;
        const nextIndex = activeRound.currentPlayerIndex + 1;
        if (nextIndex < game.players.length) {
          set({ activeRound: { ...activeRound, currentPlayerIndex: nextIndex } });
          return;
        }
        // All results confirmed — commit the round
        const entries: Record<string, RoundEntry> = {};
        for (const p of game.players) {
          const contract = activeRound.contracts[p.id] ?? 0;
          const result = activeRound.results[p.id] ?? 0;
          entries[p.id] = { contract, result, points: computePoints(contract, result) };
        }
        const firstPlayerIndex = game.rounds.length % game.players.length;
        const round: Round = {
          roundNumber: game.rounds.length + 1,
          firstPlayerId: game.players[firstPlayerIndex].id,
          trickCount: activeRound.trickCount,
          players: entries,
        };
        set({
          game: { ...game, rounds: [...game.rounds, round] },
          phase: 'idle',
          activeRound: null,
        });
      },

      exitGame: () =>
        set({ game: null, phase: 'idle', activeRound: null }),
    }),
    {
      name: 'whist:game',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selector helpers
export function selectTotals(game: Game): Record<string, number> {
  return game.rounds.reduce<Record<string, number>>((acc, round) => {
    for (const [id, entry] of Object.entries(round.players)) {
      acc[id] = (acc[id] ?? 0) + entry.points;
    }
    return acc;
  }, {});
}
