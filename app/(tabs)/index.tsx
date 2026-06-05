import { useGameStore } from '../../store/gameStore';
import NewGameScreen from '../../components/NewGameScreen';
import ActiveGameScreen from '../../components/ActiveGameScreen';

export default function GameTab() {
  const game = useGameStore((s) => s.game);
  return game ? <ActiveGameScreen /> : <NewGameScreen />;
}
