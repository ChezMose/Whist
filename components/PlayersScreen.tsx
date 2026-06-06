import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, Alert,
  Modal, TextInput,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { loadPlayers, savePlayer, deleteSavedPlayer } from '../storage/players';
import { Colors, PLAYER_COLORS } from '../constants/theme';
import type { Player } from '../types';

interface Props {
  active: boolean;
}

export default function PlayersScreen({ active }: Props) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [editTarget, setEditTarget] = useState<Player | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const refresh = useCallback(() => {
    loadPlayers().then(setPlayers);
  }, []);

  useFocusEffect(useCallback(() => {
    if (active) refresh();
  }, [active, refresh]));

  useEffect(() => {
    if (active) refresh();
  }, [active, refresh]);

  const openEdit = (player: Player) => {
    setEditTarget(player);
    setEditName(player.name);
    setEditColor(player.color);
  };

  const saveEdit = async () => {
    if (!editTarget || !editName.trim()) return;
    await savePlayer({ ...editTarget, name: editName.trim(), color: editColor });
    setEditTarget(null);
    refresh();
  };

  const handleDelete = (player: Player) => {
    Alert.alert(
      t('players.deleteTitle'),
      t('players.deleteBody', { name: player.name }),
      [
        { text: t('players.cancel'), style: 'cancel' },
        {
          text: t('players.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteSavedPlayer(player.id);
            refresh();
          },
        },
      ]
    );
  };

  if (players.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyBody}>{t('players.empty')}</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={players}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={[styles.name, { color: item.color }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Pressable style={styles.actionBtn} onPress={() => openEdit(item)}>
              <Text style={styles.actionText}>{t('players.edit')}</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item)}>
              <Text style={styles.deleteText}>{t('players.delete')}</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal visible={editTarget !== null} transparent animationType="fade" onRequestClose={() => setEditTarget(null)}>
        <Pressable style={styles.overlay} onPress={() => setEditTarget(null)}>
          <Pressable style={styles.modal}>
            <Text style={styles.modalTitle}>{t('players.modalTitle')}</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder={t('players.namePlaceholder')}
              placeholderTextColor={Colors.textDisabled}
              autoFocus
            />
            <Text style={styles.colorLabel}>{t('players.colorLabel')}</Text>
            <View style={styles.palette}>
              {PLAYER_COLORS.map((c) => (
                <Pressable
                  key={c}
                  style={[styles.swatch, { backgroundColor: c }, editColor === c && styles.swatchSelected]}
                  onPress={() => setEditColor(c)}
                />
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditTarget(null)}>
                <Text style={styles.cancelText}>{t('players.cancel')}</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, !editName.trim() && styles.saveBtnDisabled]}
                onPress={saveEdit}
                disabled={!editName.trim()}
              >
                <Text style={styles.saveText}>{t('players.save')}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  dot: { width: 12, height: 12, borderRadius: 6, flexShrink: 0 },
  name: { flex: 1, fontSize: 16, fontWeight: '600' },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surfaceHigh,
  },
  deleteBtn: { backgroundColor: Colors.dangerDim },
  actionText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  deleteText: { fontSize: 13, color: Colors.danger, fontWeight: '600' },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyBody: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: Colors.accentDim },
  saveText: { fontSize: 16, color: Colors.background, fontWeight: '700' },
});
