import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { useTranslation } from 'react-i18next';
import { useGameStore, selectTotals } from '../store/gameStore';
import { saveGame } from '../storage/games';
import { Colors } from '../constants/theme';
import ContractsPhase from './ContractsPhase';
import ResultPhase from './ResultPhase';

export default function ActiveGameScreen() {
  useKeepAwake();
  const { t } = useTranslation();
  const { game, phase, activeRound, beginContracts, beginResult, exitGame, previousRound, goBackToContracts } = useGameStore();

  if (!game) return null;

  if (phase === 'contracts') return <ContractsPhase />;
  if (phase === 'result') return <ResultPhase />;

  const totals = selectTotals(game);
  const currentRound = game.rounds.length + 1;
  const contractsEntered = activeRound !== null;
  const firstPlayerIndex = game.rounds.length % game.players.length;
  const firstPlayerId = game.players[firstPlayerIndex].id;

  const handleExit = () => {
    Alert.alert(
      t('activeGame.endGameTitle'),
      t('activeGame.endGameBody'),
      [
        { text: t('activeGame.cancel'), style: 'cancel' },
        {
          text: t('activeGame.endGame'),
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
        <Text style={styles.roundLabel}>{t('activeGame.round', { n: currentRound })}</Text>
        <Pressable onPress={handleExit} style={styles.exitBtn} accessibilityLabel={t('activeGame.exit')}>
          <Text style={styles.exitTxt}>{t('activeGame.exit')}</Text>
        </Pressable>
      </View>

      {contractsEntered && (
        <Text style={styles.contractsHeader}>
          {t('activeGame.contractsHeader', { n: currentRound })}
        </Text>
      )}

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {game.players.map((player) => {
          const isFirst = player.id === firstPlayerId;
          return (
            <View key={player.id} style={[styles.row, { borderLeftColor: player.color }]}>
              <View style={styles.nameContainer}>
                <View
                  style={[
                    isFirst && styles.firstPlayerCircle,
                    isFirst && { borderColor: player.color },
                  ]}
                  accessibilityLabel={isFirst ? `${player.name}, first player` : undefined}
                >
                  <Text
                    style={[styles.playerName, { color: player.color }]}
                    numberOfLines={1}
                  >
                    {player.name}
                  </Text>
                </View>
              </View>
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
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {contractsEntered ? (
            <Pressable
              style={styles.prevBtn}
              onPress={goBackToContracts}
              accessibilityLabel={t('activeGame.previous')}
            >
              <Text style={styles.prevTxt}>{t('activeGame.previous')}</Text>
            </Pressable>
          ) : game.rounds.length > 0 ? (
            <Pressable
              style={styles.prevBtn}
              onPress={previousRound}
              accessibilityLabel={t('activeGame.previous')}
            >
              <Text style={styles.prevTxt}>{t('activeGame.previous')}</Text>
            </Pressable>
          ) : null}

          {contractsEntered ? (
            <Pressable
              style={styles.actionBtn}
              onPress={beginResult}
              accessibilityLabel={t('activeGame.resultBtn')}
            >
              <Text style={styles.actionTxt}>{t('activeGame.resultBtn')}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.actionBtn}
              onPress={beginContracts}
              accessibilityLabel={t('activeGame.contractsBtn')}
            >
              <Text style={styles.actionTxt}>{t('activeGame.contractsBtn')}</Text>
            </Pressable>
          )}
        </View>
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
  nameContainer: { flex: 1, marginRight: 12, justifyContent: 'center' },
  firstPlayerCircle: {
    borderWidth: 2, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  playerName: { fontSize: 20, fontWeight: '600' },
  contract: { fontSize: 22, fontWeight: '600', color: Colors.textSecondary, marginRight: 16 },
  score: { fontSize: 48, fontWeight: 'bold', color: Colors.textPrimary },
  footer: { padding: 16 },
  footerRow: { flexDirection: 'row', gap: 12 },
  prevBtn: {
    flex: 1, borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  prevTxt: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600' },
  actionBtn: {
    flex: 1, backgroundColor: Colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  actionTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
