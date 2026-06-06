import { View } from 'react-native';
import { Colors } from '../constants/theme';

interface IconProps {
  color: string;
  size: number;
}

/**
 * A single playing card (ace of diamonds): card outline with a diamond in the centre.
 */
export function CardsIcon({ color, size }: IconProps) {
  const cw = Math.round(size * 0.55);
  const ch = Math.round(size * 0.74);
  const cl = Math.round((size - cw) / 2);
  const ct = Math.round((size - ch) / 2);

  // Diamond is a square rotated 45°; its diagonal equals ~34% of size.
  const ds = Math.round(size * 0.24);
  const dl = Math.round((size - ds) / 2);
  const dt = Math.round((size - ds) / 2);

  return (
    <View style={{ width: size, height: size }}>
      {/* Card outline */}
      <View style={{
        position: 'absolute',
        left: cl, top: ct,
        width: cw, height: ch,
        borderRadius: 3,
        borderWidth: 1.5,
        borderColor: color,
        backgroundColor: Colors.surface,
      }} />
      {/* Diamond pip (rotated square, outline only) */}
      <View style={{
        position: 'absolute',
        left: dl, top: dt,
        width: ds, height: ds,
        borderWidth: 1.5,
        borderColor: color,
        backgroundColor: 'transparent',
        transform: [{ rotate: '45deg' }],
      }} />
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

/**
 * An open book: rectangle split by a centered spine, with ruled lines on each page.
 */
export function BookIcon({ color, size }: IconProps) {
  const bw = Math.round(size * 0.84);
  const bh = Math.round(size * 0.76);
  const bx = Math.round((size - bw) / 2);
  const by = Math.round((size - bh) / 2);
  const spineX = bx + Math.round(bw / 2);
  const halfPageW = Math.round(bw / 2);
  const lineW = Math.round(halfPageW * 0.62);
  const leftLineX = bx + Math.round(halfPageW * 0.17);
  const rightLineX = spineX + Math.round(halfPageW * 0.17);

  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute', left: bx, top: by,
        width: bw, height: bh,
        borderRadius: 3, borderWidth: 1.5, borderColor: color,
      }} />
      <View style={{
        position: 'absolute',
        left: spineX, top: by + 2,
        width: 1.5, height: bh - 4,
        backgroundColor: color,
      }} />
      {[0.30, 0.52, 0.72].map((frac, i) => (
        <View key={`l${i}`} style={{
          position: 'absolute',
          left: leftLineX, top: Math.round(by + bh * frac),
          width: lineW, height: 1.5, backgroundColor: color,
        }} />
      ))}
      {[0.30, 0.52, 0.72].map((frac, i) => (
        <View key={`r${i}`} style={{
          position: 'absolute',
          left: rightLineX, top: Math.round(by + bh * frac),
          width: lineW, height: 1.5, backgroundColor: color,
        }} />
      ))}
    </View>
  );
}

/**
 * Android-style share icon: three dots (top, bottom-left, bottom-right) connected by two lines.
 */
export function ShareIcon({ color, size }: IconProps) {
  const r = Math.round(size * 0.125);
  const ax = Math.round(size * 0.5);
  const ay = Math.round(size * 0.17);
  const bx = Math.round(size * 0.17);
  const by = Math.round(size * 0.83);
  const cx = Math.round(size * 0.83);
  const cy = Math.round(size * 0.83);
  const lineLen = Math.round(size * 0.745);
  const thick = 1.5;
  const abMidX = Math.round((ax + bx) / 2);
  const abMidY = Math.round((ay + by) / 2);
  const acMidX = Math.round((ax + cx) / 2);
  const acMidY = Math.round((ay + cy) / 2);

  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute',
        left: abMidX - lineLen / 2, top: abMidY - thick / 2,
        width: lineLen, height: thick,
        backgroundColor: color,
        transform: [{ rotate: '116.57deg' }],
      }} />
      <View style={{
        position: 'absolute',
        left: acMidX - lineLen / 2, top: acMidY - thick / 2,
        width: lineLen, height: thick,
        backgroundColor: color,
        transform: [{ rotate: '63.43deg' }],
      }} />
      {[{ x: ax, y: ay }, { x: bx, y: by }, { x: cx, y: cy }].map((n, i) => (
        <View key={i} style={{
          position: 'absolute',
          left: n.x - r, top: n.y - r,
          width: r * 2, height: r * 2,
          borderRadius: r, backgroundColor: color,
        }} />
      ))}
    </View>
  );
}
