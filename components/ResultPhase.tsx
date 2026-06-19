import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { saveGame } from '../storage/games';
import { Colors } from '../constants/theme';
import Stepper from './Stepper';

export default function ResultPhase() {
  const { t } = useTranslation();
  const { game, activeRound, setResult, confirmResult, previousResult, cancelResult } = useGameStore();
  const [value, setValue] = useState(0);

  const currentPlayerIndex = activeRound?.currentPlayerIndex ?? 0;

  useEffect(() => {
    if (!game || !activeRound) return;
    const firstIdx = game.rounds.length % game.players.length;
    const p = game.players[(firstIdx + activeRound.currentPlayerIndex) % game.players.length];
    setValue(activeRound.results[p.id] ?? 0);
  }, [currentPlayerIndex]);

  if (!game || !activeRound) return null;

  const firstPlayerIndex = game.rounds.length % game.players.length;
  const player = game.players[(firstPlayerIndex + activeRound.currentPlayerIndex) % game.players.length];
  const contract = activeRound.contracts[player.id] ?? 0;
  const isFirst = activeRound.currentPlayerIndex === 0;
  const isLast = activeRound.currentPlayerIndex === game.players.length - 1;
  const progress = `${activeRound.currentPlayerIndex + 1} / ${game.players.length}`;

  const confirmedResultsSum = Object.values(activeRound.results).reduce((sum, v) => sum + v, 0);
  const blocked = isLast && confirmedResultsSum + value !== activeRound.trickCount;

  const handleNext = async () => {
    if (blocked) return;
    setResult(player.id, value);
    confirmResult();
    if (isLast) {
      const updatedGame = useGameStore.getState().game;
      if (updatedGame) {
        await saveGame(updatedGame);
      }
    }
  };

  const handlePrevious = () => {
    if (isFirst) {
      cancelResult();
      return;
    }
    previousResult();
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
        {blocked && (
          <Text style={styles.warning}>
            {t('result.blocked', { count: activeRound.trickCount })}
          </Text>
        )}
      </View>

      <View style={styles.btnRow}>
        <Pressable
          style={styles.prevBtn}
          onPress={handlePrevious}
          accessibilityLabel={t('result.previous')}
        >
          <Text style={styles.prevTxt}>{t('result.previous')}</Text>
        </Pressable>

        <Pressable
          style={[styles.nextBtn, blocked && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={blocked}
          accessibilityLabel={isLast ? t('result.confirmRound') : t('result.next')}
        >
          <Text style={[styles.nextTxt, blocked && styles.nextTxtDisabled]}>
            {isLast ? t('result.confirmRound') : t('result.next')}
          </Text>
        </Pressable>
      </View>
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
  btnRow: {
    flexDirection: 'row', gap: 12, marginTop: 16,
  },
  prevBtn: {
    flex: 1, borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  prevTxt: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600' },
  nextBtn: {
    flex: 1, backgroundColor: Colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: Colors.surfaceHigh, opacity: 0.5 },
  nextTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  nextTxtDisabled: { color: Colors.textSecondary },
  warning: { fontSize: 14, color: Colors.danger, textAlign: 'center' },
});
