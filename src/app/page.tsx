import GameBoard from "./components/GameBoard";
import { GameProvider } from "./contexts/GameContext";

export default function Home() {
  return (
    <GameProvider>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-600 via-amber-300 to-amber-100 p-4">
        <GameBoard />
      </div>
    </GameProvider>
  );
}