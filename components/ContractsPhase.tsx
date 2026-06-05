import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Colors } from '../constants/theme';
import Stepper from './Stepper';

export default function ContractsPhase() {
  const { game, activeRound, setContract, confirmContract } = useGameStore();
  const [value, setValue] = useState(0);

  if (!game || !activeRound) return null;

  const player = game.players[activeRound.currentPlayerIndex];
  const isLast = activeRound.currentPlayerIndex === game.players.length - 1;
  const progress = `${activeRound.currentPlayerIndex + 1} / ${game.players.length}`;

  const handleNext = () => {
    setContract(player.id, value);
    confirmContract();
    setValue(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phase}>Contracts — {progress}</Text>

      <View style={[styles.card, { borderColor: player.color }]}>
        <Text style={[styles.playerName, { color: player.color }]} numberOfLines={1}>
          {player.name}
        </Text>
        <Text style={styles.prompt}>How many tricks will you win?</Text>
        <Stepper
          value={value}
          onChange={setValue}
          accessibilityLabel={`${player.name} contract`}
        />
      </View>

      <Pressable style={styles.nextBtn} onPress={handleNext} accessibilityLabel="Confirm contract">
        <Text style={styles.nextTxt}>{isLast ? 'Done →' : 'Next →'}</Text>
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
    alignItems: 'center', justifyContent: 'center', gap: 24,
  },
  playerName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  prompt: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
  nextBtn: {
    backgroundColor: Colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 16,
  },
  nextTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
