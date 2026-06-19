import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { Colors } from '../constants/theme';
import Stepper from './Stepper';

export default function ContractsPhase() {
  const { t } = useTranslation();
  const {
    game, activeRound,
    setTrickCount, setContract, confirmContract, previousContract,
    cancelContracts,
  } = useGameStore();

  const [trickCountConfirmed, setTrickCountConfirmed] = useState(
    () => (activeRound?.trickCount ?? 0) > 0,
  );
  const [trickCountValue, setTrickCountValue] = useState(
    () => activeRound?.trickCount || 1,
  );
  const [value, setValue] = useState(0);

  const currentPlayerIndex = activeRound?.currentPlayerIndex ?? 0;

  useEffect(() => {
    if (!game || !activeRound || !trickCountConfirmed) return;
    const firstIdx = game.rounds.length % game.players.length;
    const p = game.players[(firstIdx + activeRound.currentPlayerIndex) % game.players.length];
    setValue(activeRound.contracts[p.id] ?? 0);
  }, [currentPlayerIndex, trickCountConfirmed]);

  if (!game || !activeRound) return null;

  // ── Step 0: ask how many tricks are in this round ──────────────────────────
  if (!trickCountConfirmed) {
    const handleConfirmTrickCount = () => {
      setTrickCount(trickCountValue);
      setTrickCountConfirmed(true);
    };

    return (
      <View style={styles.container}>
        <Text style={styles.phase}>{t('contracts.roundSetup')}</Text>

        <View style={styles.card}>
          <Text style={styles.playerName}>{t('contracts.tricksLabel')}</Text>
          <Text style={styles.prompt}>{t('contracts.tricksPrompt')}</Text>
          <Stepper
            value={trickCountValue}
            onChange={setTrickCountValue}
            min={1}
            max={13}
            accessibilityLabel={t('contracts.tricksInRound')}
          />
        </View>

        <View style={styles.btnRow}>
          <Pressable
            style={styles.prevBtn}
            onPress={cancelContracts}
            accessibilityLabel={t('contracts.previous')}
          >
            <Text style={styles.prevTxt}>{t('contracts.previous')}</Text>
          </Pressable>

          <Pressable style={styles.nextBtn} onPress={handleConfirmTrickCount} accessibilityLabel={t('contracts.next')}>
            <Text style={styles.nextTxt}>{t('contracts.next')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Step 1+: player contract entry ────────────────────────────────────────
  const firstPlayerIndex = game.rounds.length % game.players.length;
  const player = game.players[(firstPlayerIndex + activeRound.currentPlayerIndex) % game.players.length];
  const isFirst = activeRound.currentPlayerIndex === 0;
  const isLast = activeRound.currentPlayerIndex === game.players.length - 1;
  const progress = `${activeRound.currentPlayerIndex + 1} / ${game.players.length}`;

  const confirmedContractsSum = Object.values(activeRound.contracts).reduce((sum, v) => sum + v, 0);
  const blocked = isLast && confirmedContractsSum + value === activeRound.trickCount;

  const handleNext = () => {
    if (blocked) return;
    setContract(player.id, value);
    confirmContract();
  };

  const handlePrevious = () => {
    if (isFirst) {
      cancelContracts();
      return;
    }
    previousContract();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phase}>{t('contracts.phase', { progress })}</Text>

      <View style={[styles.card, { borderColor: player.color }]}>
        <Text style={[styles.playerName, { color: player.color }]} numberOfLines={1}>
          {player.name}
        </Text>
        <Text style={styles.prompt}>{t('contracts.winPrompt')}</Text>
        <Stepper
          value={value}
          onChange={setValue}
          accessibilityLabel={`${player.name} contract`}
        />
        {blocked && (
          <Text style={styles.warning}>
            {t('contracts.blocked', { count: activeRound.trickCount })}
          </Text>
        )}
      </View>

      <View style={styles.btnRow}>
        <Pressable
          style={styles.prevBtn}
          onPress={handlePrevious}
          accessibilityLabel={t('contracts.previous')}
        >
          <Text style={styles.prevTxt}>{t('contracts.previous')}</Text>
        </Pressable>

        <Pressable
          style={[styles.nextBtn, blocked && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={blocked}
          accessibilityLabel={isLast ? t('contracts.done') : t('contracts.next')}
        >
          <Text style={[styles.nextTxt, blocked && styles.nextTxtDisabled]}>
            {isLast ? t('contracts.done') : t('contracts.next')}
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
    alignItems: 'center', justifyContent: 'center', gap: 24,
  },
  playerName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: Colors.textPrimary },
  prompt: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
  warning: { fontSize: 14, color: Colors.danger, textAlign: 'center' },
  btnRow: {
    flexDirection: 'row', gap: 12, marginTop: 16,
  },
  prevBtn: {
    flex: 1, borderRadius: 12, height: 56, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  prevTxt: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600' },
  nextBtn: {
    flex: 1, backgroundColor: Colors.accent, borderRadius: 12,
    height: 56, alignItems: 'center', justifyContent: 'center',
  },
  nextBtnDisabled: { backgroundColor: Colors.surfaceHigh, opacity: 0.5 },
  nextTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  nextTxtDisabled: { color: Colors.textSecondary },
});
