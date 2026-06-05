import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Player } from '../types';

const KEY = 'whist:players';

export async function loadPlayers(): Promise<Player[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Player[]) : [];
}

export async function savePlayer(player: Player): Promise<void> {
  const players = await loadPlayers();
  const idx = players.findIndex((p) => p.id === player.id);
  if (idx >= 0) {
    players[idx] = player;
  } else {
    players.push(player);
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(players));
}

export async function deleteSavedPlayer(id: string): Promise<void> {
  const players = await loadPlayers();
  await AsyncStorage.setItem(KEY, JSON.stringify(players.filter((p) => p.id !== id)));
}
