import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../constants/theme';
import { ShareIcon } from '../../components/TabIcons';

const REPO_URL = 'https://github.com/ChezMose/Whist';

export default function ShareScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ShareIcon color={Colors.accent} size={56} />
      <Text style={styles.title}>{t('share.title')}</Text>
      <Text style={styles.subtitle}>{t('share.scanPrompt')}</Text>
      <View style={styles.qrWrapper}>
        <QRCode
          value={REPO_URL}
          size={200}
          color={Colors.textPrimary}
          backgroundColor={Colors.surface}
        />
      </View>
      <TouchableOpacity onPress={() => Linking.openURL(REPO_URL)} style={styles.linkRow}>
        <Text style={styles.linkLabel}>{t('share.orFollowLink')}</Text>
        <Text style={styles.link}>{REPO_URL}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 32,
  },
  linkRow: {
    alignItems: 'center',
    gap: 6,
  },
  linkLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  link: {
    fontSize: 14,
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
});
