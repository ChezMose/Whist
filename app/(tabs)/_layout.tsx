import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { useGameStore } from '../../store/gameStore';
import { CardsIcon, NotebookIcon } from '../../components/TabIcons';

export default function TabLayout() {
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
          title: 'Game',
          tabBarBadge: roundNumber ?? undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.accent },
          tabBarIcon: ({ color, size }) => <CardsIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <NotebookIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
