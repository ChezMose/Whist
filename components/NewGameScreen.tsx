import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { useSetupStore } from '../store/setupStore';

const MAX_SEATS = 8;
const MIN_SEATS = 3;

export default function NewGameScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const startGame = useGameStore((s) => s.startGame);
  const { seats, initSeats, setPendingSeat, addSeat, removeSeat } = useSetupStore();

  useEffect(() => {
    initSeats();
  }, []);

  const allFilled = seats.length >= MIN_SEATS && seats.every(Boolean);

  const openPlayerSelect = (index: number) => {
    setPendingSeat(index);
    router.push('/player-select');
  };

  const handleStart = () => {
    const players = seats.filter(Boolean) as NonNullable<typeof seats[0]>[];
    startGame(players);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('newGame.title')}</Text>
        <Pressable onPress={initSeats} style={styles.cancelBtn} accessibilityLabel={t('newGame.cancel')}>
          <Text style={styles.cancelTxt}>{t('newGame.cancel')}</Text>
        </Pressable>
      </View>

      {seats.map((player, i) => (
        <View key={i} style={styles.seatRow}>
          <Pressable
            style={[styles.seatBtn, player ? { borderColor: player.color } : null]}
            onPress={() => openPlayerSelect(i)}
            accessibilityLabel={
              player
                ? `Seat ${i + 1}: ${player.name}, tap to change`
                : `Seat ${i + 1}: tap to assign player`
            }
          >
            {player ? (
              <>
                <View style={[styles.dot, { backgroundColor: player.color }]} />
                <Text style={[styles.seatName, { color: player.color }]} numberOfLines={1}>
                  {player.name}
                </Text>
              </>
            ) : (
              <Text style={styles.seatEmpty}>{t('newGame.seatEmpty', { n: i + 1 })}</Text>
            )}
          </Pressable>

          {seats.length > MIN_SEATS && (
            <Pressable
              style={styles.removeBtn}
              onPress={() => removeSeat(i)}
              accessibilityLabel={`Remove seat ${i + 1}`}
              hitSlop={8}
            >
              <Text style={styles.removeTxt}>✕</Text>
            </Pressable>
          )}
        </View>
      ))}

      {seats.length < MAX_SEATS && (
        <Pressable style={styles.addBtn} onPress={addSeat} accessibilityLabel={t('newGame.addPlayer')}>
          <Text style={styles.addTxt}>{t('newGame.addPlayer')}</Text>
        </Pressable>
      )}

      <Pressable
        style={[styles.startBtn, !allFilled && styles.startBtnOff]}
        onPress={handleStart}
        disabled={!allFilled}
        accessibilityLabel={t('newGame.startGame')}
      >
        <Text style={[styles.startTxt, !allFilled && styles.startTxtOff]}>{t('newGame.startGame')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  cancelTxt: { color: Colors.danger, fontSize: 16 },
  seatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  seatBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 14, minHeight: 56,
  },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  seatName: { fontSize: 18, fontWeight: '600', flexShrink: 1 },
  seatEmpty: { fontSize: 16, color: Colors.textSecondary },
  removeBtn: {
    marginLeft: 10, width: 44, height: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  removeTxt: { color: Colors.textSecondary, fontSize: 18 },
  addBtn: {
    marginTop: 4, marginBottom: 24,
    borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  addTxt: { color: Colors.textSecondary, fontSize: 16 },
  startBtn: {
    backgroundColor: Colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  startBtnOff: { backgroundColor: Colors.surfaceHigh },
  startTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  startTxtOff: { color: Colors.textDisabled },
});
