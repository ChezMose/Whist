import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Body({ children }: { children: string }) {
  return <Text style={styles.body}>{children}</Text>;
}

function ScoreRow({ outcome, formula, example }: { outcome: string; formula: string; example: string }) {
  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreOutcome}>{outcome}</Text>
      <Text style={styles.scoreFormula}>{formula}</Text>
      <Text style={styles.scoreExample}>{example}</Text>
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

      <Section title={t(`${s}.theGame.title`)}>
        <Body>{t(`${s}.theGame.body`)}</Body>
      </Section>

      <Section title={t(`${s}.playersSeats.title`)}>
        <Body>{t(`${s}.playersSeats.body`)}</Body>
      </Section>

      <Section title={t(`${s}.rounds.title`)}>
        <Body>{t(`${s}.rounds.body`)}</Body>
      </Section>

      <Section title={t(`${s}.contracts.title`)}>
        <Body>{t(`${s}.contracts.body`)}</Body>
      </Section>

      <Section title={t(`${s}.results.title`)}>
        <Body>{t(`${s}.results.body`)}</Body>
      </Section>

      <Section title={t(`${s}.scoring.title`)}>
        <View style={styles.scoreTable}>
          <View style={styles.scoreHeader}>
            <Text style={[styles.scoreOutcome, styles.scoreHeaderText]}>{t(`${s}.scoring.outcome`)}</Text>
            <Text style={[styles.scoreFormula, styles.scoreHeaderText]}>{t(`${s}.scoring.formula`)}</Text>
            <Text style={[styles.scoreExample, styles.scoreHeaderText]}>{t(`${s}.scoring.exampleHeader`)}</Text>
          </View>
          <ScoreRow
            outcome={t(`${s}.scoring.contractMet`)}
            formula="+1 + tricks"
            example="Won 3 → +4"
          />
          <ScoreRow
            outcome={t(`${s}.scoring.contractMissed`)}
            formula="−(1 + |bid − won|)"
            example="Won 2 → −2"
          />
        </View>
        <Text style={styles.bodySmall}>{t(`${s}.scoring.summary`)}</Text>
      </Section>

      <Section title={t(`${s}.winning.title`)}>
        <Body>{t(`${s}.winning.body`)}</Body>
      </Section>

      <Section title={t(`${s}.quickExample.title`)}>
        <View style={styles.exampleBlock}>
          <Text style={styles.exampleLine}>Bid 3, won 3 → <Text style={styles.exampleGood}>+4</Text> (met)</Text>
          <Text style={styles.exampleLine}>Bid 3, won 2 → <Text style={styles.exampleBad}>−2</Text> (missed by 1)</Text>
          <Text style={styles.exampleLine}>Bid 3, won 5 → <Text style={styles.exampleBad}>−3</Text> (missed by 2)</Text>
          <Text style={styles.exampleLine}>Bid 0, won 0 → <Text style={styles.exampleGood}>+1</Text> (met)</Text>
          <Text style={styles.exampleLine}>Bid 0, won 1 → <Text style={styles.exampleBad}>−2</Text> (missed by 1)</Text>
        </View>
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
  bodySmall: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginTop: 10 },
  scoreTable: { marginBottom: 4 },
  scoreHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 6,
  },
  scoreHeaderText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  scoreRow: { flexDirection: 'row', paddingVertical: 5 },
  scoreOutcome: { flex: 2, fontSize: 13, color: Colors.textPrimary },
  scoreFormula: { flex: 2, fontSize: 13, color: Colors.textPrimary, fontFamily: 'monospace' },
  scoreExample: { flex: 2, fontSize: 13, color: Colors.textPrimary },
  exampleBlock: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  exampleLine: { fontSize: 14, color: Colors.textPrimary },
  exampleGood: { color: '#66BB6A', fontWeight: 'bold' },
  exampleBad: { color: Colors.danger, fontWeight: 'bold' },
});
