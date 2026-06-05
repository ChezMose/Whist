import { View } from 'react-native';
import { Colors } from '../constants/theme';

interface IconProps {
  color: string;
  size: number;
}

/**
 * Three playing cards fanned in a hand.
 * All cards share the same center; each rotates around it to form a spread.
 */
export function CardsIcon({ color, size }: IconProps) {
  const cw = Math.round(size * 0.48);
  const ch = Math.round(size * 0.66);
  const cl = Math.round((size - cw) / 2);
  const ct = Math.round((size - ch) / 2);

  const card = (rotate: string) => ({
    position: 'absolute' as const,
    left: cl,
    top: ct,
    width: cw,
    height: ch,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: color,
    backgroundColor: Colors.surface,
    transform: [{ rotate }],
  });

  return (
    <View style={{ width: size, height: size }}>
      <View style={card('-16deg')} />
      <View style={card('-4deg')} />
      <View style={card('10deg')} />
    </View>
  );
}

/**
 * A notebook: rectangle outline, vertical spine divider on the left, two ruled lines on the page.
 */
export function NotebookIcon({ color, size }: IconProps) {
  const bw = Math.round(size * 0.76);
  const bh = Math.round(size * 0.84);
  const bx = Math.round((size - bw) / 2);
  const by = Math.round((size - bh) / 2);
  const spineW = Math.round(bw * 0.25);
  const pageX = bx + spineW;
  const pageW = bw - spineW;
  const lineW = Math.round(pageW * 0.65);
  const lineX = pageX + Math.round(pageW * 0.15);

  return (
    <View style={{ width: size, height: size }}>
      {/* Notebook outline */}
      <View style={{
        position: 'absolute', left: bx, top: by,
        width: bw, height: bh,
        borderRadius: 3, borderWidth: 1.5, borderColor: color,
      }} />
      {/* Spine divider */}
      <View style={{
        position: 'absolute',
        left: pageX,
        top: by + 2,
        width: 1.5,
        height: bh - 4,
        backgroundColor: color,
      }} />
      {/* Ruled line 1 */}
      <View style={{
        position: 'absolute',
        left: lineX,
        top: Math.round(by + bh * 0.36),
        width: lineW,
        height: 1.5,
        backgroundColor: color,
      }} />
      {/* Ruled line 2 */}
      <View style={{
        position: 'absolute',
        left: lineX,
        top: Math.round(by + bh * 0.58),
        width: lineW,
        height: 1.5,
        backgroundColor: color,
      }} />
    </View>
  );
}
