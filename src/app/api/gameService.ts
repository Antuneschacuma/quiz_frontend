const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Question {
  id: string;
  content: string;
  options: string[];
  correctOption: string;
}

interface GameStartResponse {
  gameSessionId: string;
  firstQuestion: Question;
  message: string;
}

interface AnswerResponse {
  updatedSession: any;
  currentLevel: number;
  grades: number;
  nextQuestion: Question;
  message: string;
  currentQuestionIndex: number;
  isGameOver: boolean;
}

export const fetchGameData = async (userId: string): Promise<GameStartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/start-game/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
     // credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to start game');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Network error occurred');
  }
};

export const sendAnswer = async (sessionId: string, selectedOption: string): Promise<AnswerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/process-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        selectedOption
      }),
     // credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to process answer');
    }

    // Adicione este log para depuração
    const data = await response.json();
    console.log('API Response:', data);
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Network error occurred');
  }
};