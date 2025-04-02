
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { useGame } from '../contexts/GameContext';
import { cn } from '@/lib/utils';

const GradesDisplay = ({ grades }: { grades: number }) => {
  const gradesArray = Array.from({ length: 9 }, (_, i) => i < grades);
  
  return (
    <div className="flex flex-wrap justify-center gap-1 mb-1">
      {gradesArray.map((filled, index) => (
        <div 
          key={index} 
          className={cn(
            "w-6 h-8 flex items-end transition-all duration-300",
            filled ? 'text-amber-400 scale-110' : 'text-amber-900/20'
          )}
        >
          <Icons.beerCan className="w-5 h-5" />
        </div>
      ))}
    </div>
  );
};

const LevelPrizes = ({ currentLevel }: { currentLevel: number }) => {
  const prizes = [
    { level: 1, icon: <Icons.coffee className="h-5 w-5" />, label: "Café" },
    { level: 2, icon: <Icons.beer className="h-5 w-5" />, label: "Chopp" },
    { level: 3, icon: <Icons.gift className="h-5 w-5" />, label: "Brinde" },
    { level: 4, icon: <Icons.medal className="h-5 w-5" />, label: "Medalha" },
    { level: 5, icon: <Icons.trophy className="h-5 w-5" />, label: "Troféu" },
  ];

  return (
    <div className="flex justify-center gap-2 mt-1">
      {prizes.map((prize) => (
        <div 
          key={prize.level}
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-all",
            currentLevel >= prize.level 
              ? 'bg-amber-100/80 text-amber-900 shadow-md' 
              : 'bg-amber-900/20 text-amber-100/50'
          )}
        >
          <div className="mb-1">{prize.icon}</div>
          <span className="text-xs font-medium">{prize.label}</span>
        </div>
      ))}
    </div>
  );
};

const GameBoard = () => {
  const { gameData, loading, error, startGame, processAnswer, resetGame } = useGame();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userId] = useState("156e4122-dfdf-495b-a8f9-141f786c7e65");
  const [progress, setProgress] = useState(0);
  const [processingAnswer, setProcessingAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (!gameData && !loading && !error) {
      startGame(userId);
    }
  }, [gameData, loading, error, startGame, userId]);
  
  useEffect(() => {
    if (gameData?.currentQuestionIndex !== undefined) {
      const newProgress = ((gameData.currentQuestionIndex + 1) / 12) * 100;
      setProgress(newProgress);
    }
  }, [gameData?.currentQuestionIndex]);
  
  useEffect(() => {
    if (gameData?.nextQuestion?.id) {
      // Se a ID da pergunta mudou, resetamos a seleção
      if (currentQuestion !== gameData.nextQuestion.id) {
        setSelectedOption(null);
        setProcessingAnswer(false);
        setCurrentQuestion(gameData.nextQuestion.id);
        console.log("Nova pergunta carregada:", gameData.nextQuestion.id);
      }
    }
  }, [gameData?.nextQuestion?.id, currentQuestion]);

  const handleAnswer = async (option: string) => {
    // Evitar múltiplos cliques ou processamento durante carregamento
    if (processingAnswer || loading || !gameData?.nextQuestion) return;
    
    setSelectedOption(option);
    setProcessingAnswer(true);
    
    try {
      console.log("Enviando resposta:", option, "para a pergunta ID:", gameData.nextQuestion.id);
      await processAnswer(option);
      
      // Aguardar um momento para mostrar feedback visual
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Erro ao processar resposta:", error);
    }
  };

  if (loading && !gameData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Icons.spinner className="h-8 w-8 animate-spin text-amber-400" />
        <p className="text-amber-100">Preparando seu jogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-800 to-amber-600">
        <CardHeader>
          <h2 className="text-xl font-bold text-center text-amber-100">Erro no Jogo</h2>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-amber-200 mb-4">{error}</p>
          <div className="flex justify-center gap-2">
            <Button 
              onClick={() => {
                resetGame();
                setTimeout(() => startGame(userId), 100);
              }} 
              className="bg-amber-500 hover:bg-amber-400 text-amber-900"
            >
              <Icons.refresh className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gameData?.nextQuestion) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-800 to-amber-600">
        <CardHeader className="text-center">
          <h2 className="text-xl font-bold text-amber-100">Quiz Cervejeiro</h2>
          <p className="text-amber-200">Teste seu conhecimento cervejeiro!</p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            onClick={() => startGame(userId)} 
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-amber-900 font-bold"
          >
            <Icons.play className="mr-2 h-4 w-4" />
            Começar Jogo
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameData.isGameOver) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-800 to-amber-600">
        <CardHeader className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-amber-100">Fim do Jogo!</h2>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-amber-200 mb-2">Você conquistou:</p>
            <GradesDisplay grades={gameData.grades} />
            <p className="text-xs text-amber-300 mt-1">
              {gameData.grades} latinhas de cerveja
            </p>
          </div>
          <LevelPrizes currentLevel={gameData.currentLevel} />
          <Badge variant="secondary" className="text-sm bg-amber-500 text-amber-900">
            <Icons.trophy className="mr-1 h-4 w-4" />
            Pontuação: {gameData.grades}
          </Badge>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={() => {
              resetGame();
              setTimeout(() => startGame(userId), 100);
            }} 
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-amber-900 font-bold"
          >
            <Icons.refresh className="mr-2 h-4 w-4" />
            Jogar Novamente
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl bg-gradient-to-br from-amber-800 to-amber-600 border-amber-700">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col items-start">
            <p className="text-xs font-medium text-amber-300">Nível Atual</p>
            <LevelPrizes currentLevel={gameData.currentLevel} />
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-xs font-medium text-amber-300">tuas vidas</p>
            <GradesDisplay grades={gameData.grades} />
            <p className="text-xs text-amber-300 mt-1">
              {gameData.grades}/9 copos de fino
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="relative h-2 bg-amber-900/50 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-amber-300 mt-1">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <h2 className="text-xl font-semibold leading-tight text-center p-4 bg-amber-900/30 text-amber-100 rounded-lg">
          {gameData.nextQuestion.content}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {gameData.nextQuestion.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index);
            const isSelected = selectedOption === option;
            const isCorrect = gameData.nextQuestion && option === gameData.nextQuestion.correctOption;
            
            let variant: "link" | "secondary" | "default" | "destructive" | "outline" | "ghost" | null | undefined = "secondary";
            if (selectedOption !== null) {
              if (isCorrect) variant = "default";
              else if (isSelected) variant = "destructive";
            }

            return (
              <Button
                key={`${gameData.nextQuestion.id}-option-${index}`}
                variant={variant}
                className={cn(
                  "justify-start py-6 h-auto min-h-[3rem] whitespace-normal text-left",
                  "border-2 rounded-lg transition-all duration-200 cursor-pointer",
                  "hover:scale-[1.02] hover:shadow-md hover:brightness-110",
                  variant === 'secondary' 
                    ? 'bg-amber-700/50 border-amber-600 text-amber-100 hover:bg-amber-700/70' 
                    : variant === 'default' 
                      ? 'bg-green-600/90 border-green-500 text-white' 
                      : 'bg-red-600/90 border-red-500 text-white'
                )}
                onClick={() => handleAnswer(option)}
                disabled={loading || processingAnswer || selectedOption !== null}
              >
                <span className="font-bold mr-3 bg-white/20 px-2 py-1 rounded-full">
                  {optionLetter}
                </span>
                <span className="flex-1">{option}</span>
                {selectedOption !== null && isCorrect && (
                  <Icons.check className="ml-2 h-5 w-5" />
                )}
                {selectedOption !== null && isSelected && !isCorrect && (
                  <Icons.close className="ml-2 h-5 w-5" />
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center text-sm text-amber-300">
        <span>Pergunta {gameData.currentQuestionIndex + 1} de 12</span>
        <div className="flex items-center">
          {processingAnswer ? (
            <>
              <Icons.spinner className="h-4 w-4 mr-1 animate-spin" />
              <span>Processando resposta...</span>
            </>
          ) : (
            <>
              <Icons.helpCircle className="h-4 w-4 mr-1" />
              <span>Selecione uma opção</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GameBoard;