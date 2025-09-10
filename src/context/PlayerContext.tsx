import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Player {
  id: string;
  name: string;
  score: number;
  totalGames: number;
  correctAnswers: number;
  streak: number;
  avatar: string;
  joinedAt: Date;
}

interface PlayerContextType {
  player: Player | null;
  setPlayer: (player: Player) => void;
  updateScore: (points: number) => void;
  updateStats: (correct: boolean) => void;
  resetPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayerState] = useState<Player | null>(null);

  useEffect(() => {
    const savedPlayer = localStorage.getItem('misquote-player');
    if (savedPlayer) {
      const parsedPlayer = JSON.parse(savedPlayer);
      parsedPlayer.joinedAt = new Date(parsedPlayer.joinedAt);
      setPlayerState(parsedPlayer);
    }
  }, []);

  const setPlayer = (newPlayer: Player) => {
    setPlayerState(newPlayer);
    localStorage.setItem('misquote-player', JSON.stringify(newPlayer));
  };

  const updateScore = (points: number) => {
    if (player) {
      const updatedPlayer = { ...player, score: player.score + points };
      setPlayer(updatedPlayer);
    }
  };

  const updateStats = (correct: boolean) => {
    if (player) {
      const updatedPlayer = {
        ...player,
        totalGames: player.totalGames + 1,
        correctAnswers: correct ? player.correctAnswers + 1 : player.correctAnswers,
        streak: correct ? player.streak + 1 : 0
      };
      setPlayer(updatedPlayer);
    }
  };

  const resetPlayer = () => {
    setPlayerState(null);
    localStorage.removeItem('misquote-player');
  };

  return (
    <PlayerContext.Provider value={{
      player,
      setPlayer,
      updateScore,
      updateStats,
      resetPlayer
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}