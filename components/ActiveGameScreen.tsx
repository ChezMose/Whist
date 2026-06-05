import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useGameStore, selectTotals } from '../store/gameStore';
import { saveGame } from '../storage/games';
import { Colors } from '../constants/theme';
import ContractsPhase from './ContractsPhase';
import ResultPhase from './ResultPhase';

export default function ActiveGameScreen() {
  const { game, phase, activeRound, beginContracts, beginResult, exitGame } = useGameStore();

  if (!game) return null;

  if (phase === 'contracts') return <ContractsPhase />;
  if (phase === 'result') return <ResultPhase />;

  const totals = selectTotals(game);
  const currentRound = game.rounds.length + 1;
  const contractsEntered = activeRound !== null;

  const handleExit = () => {
    Alert.alert(
      'End game?',
      'The current unfinished round will be discarded.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End game',
          style: 'destructive',
          onPress: async () => {
            if (game.rounds.length > 0) {
              await saveGame({ ...game, endedAt: new Date().toISOString() });
            }
            exitGame();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roundLabel}>Round {currentRound}</Text>
        <Pressable onPress={handleExit} style={styles.exitBtn} accessibilityLabel="Exit game">
          <Text style={styles.exitTxt}>Exit</Text>
        </Pressable>
      </View>

      {contractsEntered && (
        <Text style={styles.contractsHeader}>Contracts — Round {currentRound}</Text>
      )}

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {game.players.map((player) => (
          <View key={player.id} style={[styles.row, { borderLeftColor: player.color }]}>
            <Text
              style={[styles.playerName, { color: player.color }]}
              numberOfLines={1}
              accessibilityLabel={`${player.name}`}
            >
              {player.name}
            </Text>
            {contractsEntered && (
              <Text
                style={styles.contract}
                accessibilityLabel={`${player.name} contract: ${activeRound.contracts[player.id] ?? 0}`}
              >
                {activeRound.contracts[player.id] ?? 0}
              </Text>
            )}
            <Text
              style={styles.score}
              accessibilityLabel={`${player.name} score: ${totals[player.id] ?? 0}`}
            >
              {totals[player.id] ?? 0}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {contractsEntered ? (
          <Pressable
            style={styles.actionBtn}
            onPress={beginResult}
            accessibilityLabel="Enter results for this round"
          >
            <Text style={styles.actionTxt}>Result →</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.actionBtn}
            onPress={beginContracts}
            accessibilityLabel="Enter contracts for this round"
          >
            <Text style={styles.actionTxt}>Contracts →</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  roundLabel: { fontSize: 20, fontWeight: '600', color: Colors.textSecondary },
  exitBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  exitTxt: { color: Colors.danger, fontSize: 16 },
  contractsHeader: {
    fontSize: 13, color: Colors.textSecondary, fontWeight: '600',
    paddingHorizontal: 16, paddingBottom: 4,
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingVertical: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: 12,
    borderLeftWidth: 6, paddingHorizontal: 16, paddingVertical: 18,
    marginBottom: 12,
  },
  playerName: { fontSize: 20, fontWeight: '600', flex: 1, marginRight: 12 },
  contract: { fontSize: 22, fontWeight: '600', color: Colors.textSecondary, marginRight: 16 },
  score: { fontSize: 48, fontWeight: 'bold', color: Colors.textPrimary },
  footer: { padding: 16 },
  actionBtn: {
    backgroundColor: Colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  actionTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
