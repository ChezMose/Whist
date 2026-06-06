import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/theme';

const GREEN = '#66BB6A';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Body({ children, mt }: { children: string; mt?: boolean }) {
  return <Text style={[styles.body, mt && styles.bodySpaced]}>{children}</Text>;
}

function SubHeading({ children }: { children: string }) {
  return <Text style={styles.subHeading}>{children}</Text>;
}

function BulletItem({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function Callout({ children }: { children: string }) {
  return (
    <View style={styles.callout}>
      <Text style={styles.calloutText}>{children}</Text>
    </View>
  );
}

function ScoreCard({ title, body, good }: { title: string; body: string; good: boolean }) {
  return (
    <View style={[styles.scoreCard, good ? styles.scoreCardGood : styles.scoreCardBad]}>
      <Text style={[styles.scoreCardTitle, { color: good ? GREEN : Colors.danger }]}>{title}</Text>
      <Text style={styles.scoreCardBody}>{body}</Text>
    </View>
  );
}

export default function RulesScreen() {
  const { t } = useTranslation();
  const s = 'rules.sections';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('rules.title')}</Text>
      <Text style={styles.subtitle}>{t('rules.subtitle')}</Text>

      <Section title={t(`${s}.whatIsATrick.title`)}>
        <Body>{t(`${s}.whatIsATrick.body`)}</Body>
        <Body mt>{t(`${s}.whatIsATrick.goal`)}</Body>
      </Section>

      <Section title={t(`${s}.cardValues.title`)}>
        <Body>{t(`${s}.cardValues.body`)}</Body>
        <Body mt>{t(`${s}.cardValues.trump`)}</Body>
      </Section>

      <Section title={t(`${s}.theDeal.title`)}>
        <Body>{t(`${s}.theDeal.body`)}</Body>
        <Text style={[styles.body, styles.bodySpaced]}>{t(`${s}.theDeal.dealIntro`)}</Text>
        <View style={styles.bulletList}>
          <BulletItem>{t(`${s}.theDeal.bullet1`)}</BulletItem>
          <BulletItem>{t(`${s}.theDeal.bullet2`)}</BulletItem>
          <BulletItem>{t(`${s}.theDeal.bullet3`)}</BulletItem>
          <BulletItem>{t(`${s}.theDeal.bullet4`)}</BulletItem>
        </View>
        <SubHeading>{t(`${s}.theDeal.trumpTitle`)}</SubHeading>
        <Body>{t(`${s}.theDeal.trumpBody`)}</Body>
        <Callout>{t(`${s}.theDeal.tip`)}</Callout>
      </Section>

      <Section title={t(`${s}.contracts.title`)}>
        <Body>{t(`${s}.contracts.body`)}</Body>
        <SubHeading>{t(`${s}.contracts.constraintLabel`)}</SubHeading>
        <Body>{t(`${s}.contracts.constraintBody`)}</Body>
        <Callout>{t(`${s}.contracts.example`)}</Callout>
      </Section>

      <Section title={t(`${s}.playingARound.title`)}>
        <Body>{t(`${s}.playingARound.body`)}</Body>
        <Text style={[styles.body, styles.bodySpaced]}>{t(`${s}.playingARound.noSuitIntro`)}</Text>
        <View style={styles.bulletList}>
          <BulletItem>{t(`${s}.playingARound.option1`)}</BulletItem>
          <BulletItem>{t(`${s}.playingARound.option2`)}</BulletItem>
        </View>
        <Body mt>{t(`${s}.playingARound.footer`)}</Body>
      </Section>

      <Section title={t(`${s}.scoring.title`)}>
        <ScoreCard
          good
          title={t(`${s}.scoring.metTitle`)}
          body={t(`${s}.scoring.metBody`)}
        />
        <ScoreCard
          good={false}
          title={t(`${s}.scoring.missedTitle`)}
          body={t(`${s}.scoring.missedBody`)}
        />
        <Text style={styles.examplesLabel}>{t(`${s}.scoring.examplesTitle`)}</Text>
        <View style={styles.exampleBlock}>
          <Text style={styles.exampleLine}>Bid 3, won 3 → <Text style={styles.exampleGood}>+4</Text> ✓</Text>
          <Text style={styles.exampleLine}>Bid 2, won 3 → <Text style={styles.exampleBad}>−2</Text> (off by 1)</Text>
          <Text style={styles.exampleLine}>Bid 3, won 5 → <Text style={styles.exampleBad}>−3</Text> (off by 2)</Text>
          <Text style={styles.exampleLine}>Bid 0, won 0 → <Text style={styles.exampleGood}>+1</Text> ✓</Text>
          <Text style={styles.exampleLine}>Bid 0, won 1 → <Text style={styles.exampleBad}>−2</Text> (off by 1)</Text>
        </View>
        <Text style={styles.bodySmall}>{t(`${s}.scoring.summary`)}</Text>
      </Section>

      <Section title={t(`${s}.winning.title`)}>
        <Body>{t(`${s}.winning.body`)}</Body>
        <Body mt>{t(`${s}.winning.footer`)}</Body>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  bodySpaced: { marginTop: 10 },
  bodySmall: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginTop: 10 },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 6,
  },
  bulletList: { marginTop: 8, gap: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { fontSize: 15, color: Colors.accent, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  callout: {
    backgroundColor: Colors.surfaceHigh,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
  },
  calloutText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  scoreCard: {
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 3,
  },
  scoreCardGood: {
    backgroundColor: '#1A2E1A',
    borderLeftColor: GREEN,
  },
  scoreCardBad: {
    backgroundColor: '#2E1A1A',
    borderLeftColor: Colors.danger,
  },
  scoreCardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  scoreCardBody: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  examplesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  exampleBlock: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  exampleLine: { fontSize: 14, color: Colors.textPrimary },
  exampleGood: { color: GREEN, fontWeight: 'bold' },
  exampleBad: { color: Colors.danger, fontWeight: 'bold' },
});
