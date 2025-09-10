import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Quote {
  id: string;
  text: string;
  author: string;
  isReal: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface GameSession {
  id: string;
  currentQuote: Quote | null;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  roundTimeLimit: number;
  score: number;
  isActive: boolean;
  isLoading: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameContextType {
  gameSession: GameSession;
  startGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
  submitAnswer: (guess: boolean) => Promise<boolean>;
  nextRound: () => void;
  endGame: () => void;
  updateTimer: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Mock quotes database - in a real app, this would come from your API
const mockQuotes: Quote[] = [
  {
    id: '1',
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    isReal: true,
    difficulty: 'easy',
    category: 'Technology'
  },
  {
    id: '2',
    text: "Innovation distinguishes between a leader and a follower, especially when you're debugging code at 3 AM.",
    author: "Steve Jobs",
    isReal: false,
    difficulty: 'medium',
    category: 'Technology'
  },
  {
    id: '3',
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    isReal: true,
    difficulty: 'easy',
    category: 'Science'
  },
  {
    id: '4',
    text: "Genius is one percent inspiration, ninety-nine percent perspiration, and a really good Wi-Fi connection.",
    author: "Thomas Edison",
    isReal: false,
    difficulty: 'hard',
    category: 'Science'
  },
  {
    id: '5',
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    isReal: true,
    difficulty: 'medium',
    category: 'Business'
  },
  {
    id: '6',
    text: "All our dreams can come true, if we have the courage to pursue them, and a solid social media strategy.",
    author: "Walt Disney",
    isReal: false,
    difficulty: 'hard',
    category: 'Business'
  },
  {
    id: '7',
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    isReal: true,
    difficulty: 'easy',
    category: 'Literature'
  },
  {
    id: '8',
    text: "I can resist everything except temptation, and really good memes.",
    author: "Oscar Wilde",
    isReal: false,
    difficulty: 'medium',
    category: 'Literature'
  }
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameSession, setGameSession] = useState<GameSession>({
    id: '',
    currentQuote: null,
    currentRound: 0,
    totalRounds: 10,
    timeLeft: 0,
    roundTimeLimit: 15,
    score: 0,
    isActive: false,
    isLoading: false,
    difficulty: 'medium'
  });

  const getRandomQuote = (difficulty: 'easy' | 'medium' | 'hard'): Quote => {
    const filteredQuotes = mockQuotes.filter(q => q.difficulty === difficulty);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex] || mockQuotes[0];
  };

  const startGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    const newSession: GameSession = {
      id: uuidv4(),
      currentQuote: getRandomQuote(difficulty),
      currentRound: 1,
      totalRounds: 10,
      timeLeft: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10,
      roundTimeLimit: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10,
      score: 0,
      isActive: true,
      isLoading: false,
      difficulty
    };
    setGameSession(newSession);
  };

  const submitAnswer = async (guess: boolean): Promise<boolean> => {
    if (!gameSession.currentQuote) return false;
    
    const isCorrect = guess === gameSession.currentQuote.isReal;
    
    if (isCorrect) {
      const timeBonus = Math.floor(gameSession.timeLeft / 2);
      const difficultyMultiplier = gameSession.difficulty === 'easy' ? 1 : 
                                  gameSession.difficulty === 'medium' ? 1.5 : 2;
      const points = Math.floor((100 + timeBonus) * difficultyMultiplier);
      
      setGameSession(prev => ({
        ...prev,
        score: prev.score + points
      }));
    }
    
    return isCorrect;
  };

  const nextRound = () => {
    if (gameSession.currentRound >= gameSession.totalRounds) {
      endGame();
      return;
    }

    setGameSession(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      currentQuote: getRandomQuote(prev.difficulty),
      timeLeft: prev.roundTimeLimit,
      isLoading: false
    }));
  };

  const endGame = () => {
    setGameSession(prev => ({
      ...prev,
      isActive: false,
      currentQuote: null,
      timeLeft: 0
    }));
  };

  const updateTimer = () => {
    setGameSession(prev => {
      if (prev.timeLeft <= 1) {
        return { ...prev, timeLeft: 0 };
      }
      return { ...prev, timeLeft: prev.timeLeft - 1 };
    });
  };

  return (
    <GameContext.Provider value={{
      gameSession,
      startGame,
      submitAnswer,
      nextRound,
      endGame,
      updateTimer
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}