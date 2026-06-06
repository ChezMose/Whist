import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/theme';
import { useGameStore } from '../../store/gameStore';
import { CardsIcon, NotebookIcon, BookIcon, ShareIcon } from '../../components/TabIcons';

export default function TabLayout() {
  const { t } = useTranslation();
  const game = useGameStore((s) => s.game);
  const roundNumber = game ? game.rounds.length + 1 : null;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.game'),
          tabBarBadge: roundNumber ?? undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.accent },
          tabBarIcon: ({ color, size }) => <CardsIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color, size }) => <NotebookIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="rules"
        options={{
          title: t('tabs.rules'),
          tabBarIcon: ({ color, size }) => <BookIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: t('tabs.share'),
          tabBarIcon: ({ color, size }) => <ShareIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
