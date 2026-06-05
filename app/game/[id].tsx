import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { loadGame } from '../../storage/games';
import { selectTotals } from '../../store/gameStore';
import { Colors } from '../../constants/theme';
import type { Game } from '../../types';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    loadGame(id).then(setGame);
  }, [id]);

  if (!game) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingTxt}>Loading…</Text>
      </View>
    );
  }

  const totals = selectTotals(game);
  const colWidth = Math.max(64, Math.floor(320 / game.players.length));

  return (
    <View style={styles.container}>
      {/* Horizontal scroll for wide tables */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.labelCol}>
              <Text style={styles.headerTxt}>Round</Text>
            </View>
            {game.players.map((p) => (
              <View key={p.id} style={[styles.dataCol, { width: colWidth }]}>
                <View style={[styles.dot, { backgroundColor: p.color }]} />
                <Text style={[styles.headerName, { color: p.color }]} numberOfLines={1}>
                  {p.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Round rows */}
          <ScrollView style={styles.rounds} showsVerticalScrollIndicator={false}>
            {game.rounds.map((round) => (
              <View key={round.roundNumber} style={styles.dataRow}>
                <View style={styles.labelCol}>
                  <Text style={styles.roundNum}>{round.roundNumber}</Text>
                </View>
                {game.players.map((p) => {
                  const entry = round.players[p.id];
                  const pts = entry?.points ?? 0;
                  return (
                    <View key={p.id} style={[styles.dataCol, { width: colWidth }]}>
                      <Text
                        style={[styles.pts, pts >= 0 ? styles.ptsPos : styles.ptsNeg]}
                        accessibilityLabel={`${p.name} round ${round.roundNumber}: ${pts > 0 ? '+' : ''}${pts}`}
                      >
                        {pts > 0 ? '+' : ''}{pts}
                      </Text>
                      <Text style={styles.detail}>
                        {entry?.result ?? 0}/{entry?.contract ?? 0}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* Sticky totals row */}
          <View style={styles.totalsRow}>
            <View style={styles.labelCol}>
              <Text style={styles.totalsLabel}>Total</Text>
            </View>
            {game.players.map((p) => (
              <View key={p.id} style={[styles.dataCol, { width: colWidth }]}>
                <Text
                  style={styles.total}
                  accessibilityLabel={`${p.name} total: ${totals[p.id] ?? 0}`}
                >
                  {totals[p.id] ?? 0}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingTxt: { color: Colors.textSecondary, fontSize: 16 },
  headerRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderColor: Colors.border,
    paddingVertical: 12,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.border,
    paddingVertical: 10,
  },
  totalsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderTopWidth: 2, borderColor: Colors.accent,
    paddingVertical: 14,
  },
  labelCol: {
    width: 60, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  dataCol: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  headerTxt: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  headerName: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  roundNum: { fontSize: 15, color: Colors.textSecondary },
  pts: { fontSize: 18, fontWeight: 'bold' },
  ptsPos: { color: '#69F0AE' },
  ptsNeg: { color: Colors.danger },
  detail: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  totalsLabel: { fontSize: 13, fontWeight: 'bold', color: Colors.textSecondary },
  total: { fontSize: 22, fontWeight: 'bold', color: Colors.accent },
  rounds: { maxHeight: 420 },
});
