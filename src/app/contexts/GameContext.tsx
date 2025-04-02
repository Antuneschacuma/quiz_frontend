'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { fetchGameData, sendAnswer } from '../api/gameService';

interface Question {
  id: string;
  content: string;
  options: string[];
  correctOption: string;
}

interface GameData {
  gameSessionId: string;
  currentLevel: number;
  grades: number;
  nextQuestion: Question;
  message: string;
  currentQuestionIndex: number;
  isGameOver: boolean;
}

interface GameContextType {
  gameData: GameData | null;
  loading: boolean;
  error: string | null;
  startGame: (userId: string) => Promise<void>;
  processAnswer: (selectedOption: string) => Promise<void>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetGame = () => {
    setGameData(null);
    setError(null);
    setLoading(false);
  };

  const startGame = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchGameData(userId);
      
      setGameData({
        gameSessionId: data.gameSessionId,
        nextQuestion: data.firstQuestion,
        message: data.message,
        currentLevel: 1,
        currentQuestionIndex: 0,
        isGameOver: false,
        grades: 9
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const processAnswer = async (selectedOption: string) => {
    if (!gameData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newData = await sendAnswer(gameData.gameSessionId, selectedOption);
      
      setGameData(prev => ({
        ...prev!,
        ...newData,
        nextQuestion: newData.nextQuestion
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameContext.Provider value={{ 
      gameData, 
      loading, 
      error, 
      startGame, 
      processAnswer,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};