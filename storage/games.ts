import * as SQLite from 'expo-sqlite';
import type { Game } from '../types';

const db = SQLite.openDatabaseSync('whist.db');

export async function initDb(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );
  `);
}

export async function saveGame(game: Game): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO games (id, data) VALUES (?, ?);',
    game.id,
    JSON.stringify(game)
  );
}

export async function loadGames(): Promise<Game[]> {
  const rows = await db.getAllAsync<{ data: string }>('SELECT data FROM games ORDER BY rowid DESC;');
  return rows.map((r) => JSON.parse(r.data) as Game);
}

export async function loadGame(id: string): Promise<Game | null> {
  const row = await db.getFirstAsync<{ data: string }>('SELECT data FROM games WHERE id = ?;', id);
  return row ? (JSON.parse(row.data) as Game) : null;
}

export async function deleteGame(id: string): Promise<void> {
  await db.runAsync('DELETE FROM games WHERE id = ?;', id);
}
