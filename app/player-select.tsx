import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, PLAYER_COLORS } from '../constants/theme';
import { loadPlayers, savePlayer } from '../storage/players';
import { useSetupStore } from '../store/setupStore';
import type { Player } from '../types';

type Mode = 'list' | 'create';

export default function PlayerSelectScreen() {
  const router = useRouter();
  const { seats, pendingSeatIndex, assignSeat } = useSetupStore();

  const [mode, setMode] = useState<Mode>('list');
  const [saved, setSaved] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PLAYER_COLORS[0]);

  const takenIds = new Set(
    seats
      .filter((_, i) => i !== pendingSeatIndex)
      .filter(Boolean)
      .map((p) => p!.id)
  );
  const available = saved.filter((p) => !takenIds.has(p.id));

  useEffect(() => {
    loadPlayers().then(setSaved);
  }, []);

  const pick = (player: Player) => {
    assignSeat(player);
    router.back();
  };

  const createAndPick = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const player: Player = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: trimmed,
      color,
    };
    await savePlayer(player);
    pick(player);
  };

  if (mode === 'create') {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>New player</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={(t) => setName(t.slice(0, 20))}
            autoFocus
            maxLength={20}
            accessibilityLabel="Player name"
          />

          <Text style={styles.label}>Color</Text>
          <View style={styles.palette}>
            {PLAYER_COLORS.map((c) => (
              <Pressable
                key={c}
                style={[styles.swatch, { backgroundColor: c }, color === c && styles.swatchSelected]}
                onPress={() => setColor(c)}
                accessibilityLabel={`Color ${c}`}
              />
            ))}
          </View>

          <Pressable
            style={[styles.primaryBtn, !name.trim() && styles.primaryBtnOff]}
            onPress={createAndPick}
            disabled={!name.trim()}
            accessibilityLabel="Create player"
          >
            <Text style={[styles.primaryTxt, !name.trim() && styles.primaryTxtOff]}>
              Create &amp; Add
            </Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={() => setMode('list')}>
            <Text style={styles.secondaryTxt}>← Back to list</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={available}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {available.length ? 'Saved players' : 'No saved players yet'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.playerRow}
            onPress={() => pick(item)}
            accessibilityLabel={`Select ${item.name}`}
          >
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={[styles.playerName, { color: item.color }]}>{item.name}</Text>
          </Pressable>
        )}
        ListFooterComponent={
          <Pressable style={styles.newBtn} onPress={() => setMode('create')} accessibilityLabel="Create new player">
            <Text style={styles.newTxt}>+ New player</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 20, fontWeight: '600', color: Colors.textPrimary, marginBottom: 16,
  },
  playerRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
    minHeight: 56,
  },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  playerName: { fontSize: 18, fontWeight: '600' },
  newBtn: {
    marginTop: 16,
    borderWidth: 1.5, borderColor: Colors.accent, borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  newTxt: { color: Colors.accent, fontSize: 16, fontWeight: '600' },
  input: {
    backgroundColor: Colors.surface, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 18, color: Colors.textPrimary, marginBottom: 24,
  },
  label: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  swatch: { width: 40, height: 40, borderRadius: 20 },
  swatchSelected: {
    borderWidth: 3, borderColor: Colors.textPrimary,
    transform: [{ scale: 1.15 }],
  },
  primaryBtn: {
    backgroundColor: Colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnOff: { backgroundColor: Colors.surfaceHigh },
  primaryTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  primaryTxtOff: { color: Colors.textDisabled },
  secondaryBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12 },
  secondaryTxt: { color: Colors.textSecondary, fontSize: 16 },
});
