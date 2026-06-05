import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { loadGames, deleteGame } from '../../storage/games';
import { selectTotals } from '../../store/gameStore';
import { Colors } from '../../constants/theme';
import type { Game } from '../../types';

function relativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function HistoryScreen() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);

  const refresh = useCallback(() => {
    loadGames().then(setGames);
  }, []);

  useFocusEffect(refresh);

  const handleDelete = (game: Game) => {
    Alert.alert(
      'Delete game?',
      `${relativeDate(game.startedAt)} — ${game.players.map((p) => p.name).join(', ')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteGame(game.id);
            refresh();
          },
        },
      ]
    );
  };

  if (games.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🃏</Text>
        <Text style={styles.emptyTitle}>No games yet</Text>
        <Text style={styles.emptyBody}>Start your first game on the Game tab!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={games}
      keyExtractor={(g) => g.id}
      renderItem={({ item }) => {
        const totals = selectTotals(item);
        return (
          <Pressable
            style={styles.row}
            onPress={() => router.push(`/game/${item.id}`)}
            onLongPress={() => handleDelete(item)}
            accessibilityLabel={`Game from ${relativeDate(item.startedAt)}, long press to delete`}
          >
            <Text style={styles.date}>{relativeDate(item.startedAt)}</Text>
            <View style={styles.players}>
              {item.players.map((p) => (
                <View key={p.id} style={styles.playerChip}>
                  <View style={[styles.chipDot, { backgroundColor: p.color }]} />
                  <Text style={[styles.chipName, { color: p.color }]} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.chipScore}>{totals[p.id] ?? 0}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  row: {
    backgroundColor: Colors.surface, borderRadius: 12,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  date: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  players: { gap: 8 },
  playerChip: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipDot: { width: 10, height: 10, borderRadius: 5 },
  chipName: { fontSize: 16, fontWeight: '600', flex: 1 },
  chipScore: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  empty: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  emptyBody: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
});
