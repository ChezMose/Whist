import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { loadGames, deleteGame } from '../../storage/games';
import { selectTotals } from '../../store/gameStore';
import { Colors } from '../../constants/theme';
import type { Game } from '../../types';
import PlayersScreen from '../../components/PlayersScreen';

type Tab = 'games' | 'players';

function relativeDate(iso: string, t: ReturnType<typeof useTranslation>['t']): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return t('history.today');
  if (diffDays === 1) return t('history.yesterday');
  if (diffDays < 7) return t('history.daysAgo', { count: diffDays });
  return date.toLocaleDateString();
}

function GamesTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);

  const refresh = useCallback(() => {
    loadGames().then(setGames);
  }, []);

  useFocusEffect(refresh);

  const handleDelete = (game: Game) => {
    Alert.alert(
      t('history.deleteGame.title'),
      `${relativeDate(game.startedAt, t)} — ${game.players.map((p) => p.name).join(', ')}`,
      [
        { text: t('history.deleteGame.cancel'), style: 'cancel' },
        {
          text: t('history.deleteGame.delete'),
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
        <Text style={styles.emptyTitle}>{t('history.empty.title')}</Text>
        <Text style={styles.emptyBody}>{t('history.empty.body')}</Text>
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
            accessibilityLabel={`${t('history.today')} ${relativeDate(item.startedAt, t)}`}
          >
            <Text style={styles.date}>{relativeDate(item.startedAt, t)}</Text>
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

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('games');

  return (
    <View style={styles.screen}>
      <View style={styles.segmentBar}>
        <Pressable
          style={[styles.segment, activeTab === 'games' && styles.segmentActive]}
          onPress={() => setActiveTab('games')}
        >
          <Text style={[styles.segmentText, activeTab === 'games' && styles.segmentTextActive]}>
            {t('history.segments.games')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.segment, activeTab === 'players' && styles.segmentActive]}
          onPress={() => setActiveTab('players')}
        >
          <Text style={[styles.segmentText, activeTab === 'players' && styles.segmentTextActive]}>
            {t('history.segments.players')}
          </Text>
        </Pressable>
      </View>

      {activeTab === 'games' ? (
        <GamesTab />
      ) : (
        <PlayersScreen active={activeTab === 'players'} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  segmentBar: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: { backgroundColor: Colors.accent },
  segmentText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  segmentTextActive: { color: Colors.background },

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
