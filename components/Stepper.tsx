import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  accessibilityLabel?: string;
}

export default function Stepper({ value, onChange, min = 0, max = 13, accessibilityLabel }: Props) {
  return (
    <View style={styles.row} accessibilityLabel={accessibilityLabel}>
      <Pressable
        style={[styles.btn, value <= (min ?? 0) && styles.btnDisabled]}
        onPress={() => onChange(Math.max(min ?? 0, value - 1))}
        disabled={value <= (min ?? 0)}
        accessibilityLabel="Decrease"
        hitSlop={8}
      >
        <Text style={styles.btnTxt}>−</Text>
      </Pressable>

      <Text style={styles.value}>{value}</Text>

      <Pressable
        style={[styles.btn, value >= (max ?? 13) && styles.btnDisabled]}
        onPress={() => onChange(Math.min(max ?? 13, value + 1))}
        disabled={value >= (max ?? 13)}
        accessibilityLabel="Increase"
        hitSlop={8}
      >
        <Text style={styles.btnTxt}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  btn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.3 },
  btnTxt: { fontSize: 28, color: Colors.textPrimary, lineHeight: 32 },
  value: { fontSize: 48, fontWeight: 'bold', color: Colors.textPrimary, minWidth: 64, textAlign: 'center' },
});
