// // useGameLogic.ts
// import { useState, useEffect, useCallback } from 'react';
// import { useGame } from '../contexts/GameContext';

// export const useGameLogic = () => {
//   const { gameData, loading, error, startGame, processAnswer, resetGame } = useGame();
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [processingAnswer, setProcessingAnswer] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleStartGame = useCallback(() => {
//     const userId = "548c102b-7176-4d75-a4f7-5b17f26055ab"; 
//     startGame(userId);
//   }, [startGame]);

//   useEffect(() => {
//     if (gameData?.currentQuestionIndex !== undefined) {
//       setProgress(((gameData.currentQuestionIndex + 1) / 12) * 100);
//     }
//   }, [gameData?.currentQuestionIndex]);


//   const handleAnswer = useCallback(async (option: string) => {
//     if (processingAnswer || loading || !gameData?.nextQuestion) return;
    
//     setSelectedOption(option);
//     setProcessingAnswer(true);
    
//     try {
//       await processAnswer(option);
      
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     } catch (err) {
//       console.error("Error processing answer:", err);
//     } finally {
//       setProcessingAnswer(false);
//     }
//   }, [processingAnswer, loading, gameData, processAnswer]);

//   return {
//     gameData,
//     loading,
//     error,
//     progress,
//     selectedOption,
//     processingAnswer,
//     handleAnswer,
//     startGame: handleStartGame,
//     resetGame
//   };
// };