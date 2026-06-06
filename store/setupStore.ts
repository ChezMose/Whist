import { create } from 'zustand';
import type { Player } from '../types';

interface SetupState {
  seats: (Player | null)[];
  pendingSeatIndex: number | null;
  initSeats: () => void;
  setPendingSeat: (index: number) => void;
  assignSeat: (player: Player) => void;
  addSeat: () => void;
  removeSeat: (index: number) => void;
  reset: () => void;
}

const MIN_SEATS = 3;
const MAX_SEATS = 8;

export const useSetupStore = create<SetupState>((set, get) => ({
  seats: [null, null, null],
  pendingSeatIndex: null,

  initSeats: () => set({ seats: [null, null, null], pendingSeatIndex: null }),

  setPendingSeat: (index) => set({ pendingSeatIndex: index }),

  assignSeat: (player) => {
    const { seats, pendingSeatIndex } = get();
    if (pendingSeatIndex === null) return;
    const next = [...seats];
    next[pendingSeatIndex] = player;
    set({ seats: next, pendingSeatIndex: null });
  },

  addSeat: () => {
    const { seats } = get();
    if (seats.length < MAX_SEATS) set({ seats: [...seats, null] });
  },

  removeSeat: (index) => {
    const { seats } = get();
    if (seats.length <= MIN_SEATS) return;
    set({ seats: seats.filter((_, i) => i !== index) });
  },

  reset: () => set({ seats: [null, null, null], pendingSeatIndex: null }),
}));
