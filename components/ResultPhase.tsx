import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { saveGame } from '../storage/games';
import { Colors } from '../constants/theme';
import Stepper from './Stepper';

export default function ResultPhase() {
  const { t } = useTranslation();
  const { game, activeRound, setResult, confirmResult } = useGameStore();
  const [value, setValue] = useState(0);

  if (!game || !activeRound) return null;

  const firstPlayerIndex = game.rounds.length % game.players.length;
  const player = game.players[(firstPlayerIndex + activeRound.currentPlayerIndex) % game.players.length];
  const contract = activeRound.contracts[player.id] ?? 0;
  const isLast = activeRound.currentPlayerIndex === game.players.length - 1;
  const progress = `${activeRound.currentPlayerIndex + 1} / ${game.players.length}`;

  const handleNext = async () => {
    setResult(player.id, value);
    if (isLast) {
      confirmResult();
      const updatedGame = useGameStore.getState().game;
      if (updatedGame) {
        await saveGame(updatedGame);
      }
    } else {
      confirmResult();
      setValue(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phase}>{t('result.phase', { progress })}</Text>

      <View style={[styles.card, { borderColor: player.color }]}>
        <Text style={[styles.playerName, { color: player.color }]} numberOfLines={1}>
          {player.name}
        </Text>
        <Text style={styles.contractLine}>{t('result.contract', { n: contract })}</Text>
        <Text style={styles.prompt}>{t('result.wonPrompt')}</Text>
        <Stepper
          value={value}
          onChange={setValue}
          accessibilityLabel={`${player.name} result`}
        />
      </View>

      <Pressable
        style={styles.nextBtn}
        onPress={handleNext}
        accessibilityLabel={isLast ? t('result.confirmRound') : t('result.next')}
      >
        <Text style={styles.nextTxt}>{isLast ? t('result.confirmRound') : t('result.next')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  phase: { fontSize: 16, color: Colors.textSecondary, marginBottom: 32 },
  card: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16,
    borderLeftWidth: 6, padding: 24,
    alignItems: 'center', justifyContent: 'center', gap: 20,
  },
  playerName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  contractLine: { fontSize: 18, color: Colors.textSecondary },
  prompt: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
  nextBtn: {
    backgroundColor: Colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 16,
  },
  nextTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
