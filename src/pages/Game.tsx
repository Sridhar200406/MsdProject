import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, Target, CheckCircle, XCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { usePlayer } from '../context/PlayerContext';
import { useNotification } from '../context/NotificationContext';
import GameSetupModal from '../components/GameSetupModal';
import GameResultModal from '../components/GameResultModal';

export default function Game() {
  const { gameSession, startGame, submitAnswer, nextRound, endGame, updateTimer } = useGame();
  const { player, updateScore, updateStats } = usePlayer();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  
  const [showSetup, setShowSetup] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (!player) {
      navigate('/');
      return;
    }

    if (!gameSession.isActive && !showSetup) {
      setShowSetup(true);
    }
  }, [player, gameSession.isActive, navigate, showSetup]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameSession.isActive && gameSession.timeLeft > 0 && !isAnswered) {
      timer = setInterval(() => {
        updateTimer();
      }, 1000);
    } else if (gameSession.isActive && gameSession.timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }

    return () => clearInterval(timer);
  }, [gameSession.isActive, gameSession.timeLeft, isAnswered]);

  const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    startGame(difficulty);
    setShowSetup(false);
    setIsAnswered(false);
    setLastAnswerCorrect(null);
  };

  const handleAnswer = async (guess: boolean) => {
    if (isAnswered || !gameSession.currentQuote) return;
    
    setIsAnswered(true);
    const isCorrect = await submitAnswer(guess);
    setLastAnswerCorrect(isCorrect);
    
    updateStats(isCorrect);
    
    if (isCorrect) {
      const timeBonus = Math.floor(gameSession.timeLeft / 2);
      const difficultyMultiplier = gameSession.difficulty === 'easy' ? 1 : 
                                  gameSession.difficulty === 'medium' ? 1.5 : 2;
      const points = Math.floor((100 + timeBonus) * difficultyMultiplier);
      
      updateScore(points);
      showNotification({
        title: 'Correct!',
        message: `+${points} points`,
        type: 'success'
      });
    } else {
      showNotification({
        title: 'Wrong!',
        message: `The quote was ${gameSession.currentQuote.isReal ? 'real' : 'fake'}`,
        type: 'error'
      });
    }

    setTimeout(() => {
      if (gameSession.currentRound >= gameSession.totalRounds) {
        endGame();
        setShowResult(true);
      } else {
        nextRound();
        setIsAnswered(false);
        setLastAnswerCorrect(null);
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setLastAnswerCorrect(false);
    updateStats(false);
    
    showNotification({
      title: 'Time\'s Up!',
      message: 'You ran out of time',
      type: 'warning'
    });

    setTimeout(() => {
      if (gameSession.currentRound >= gameSession.totalRounds) {
        endGame();
        setShowResult(true);
      } else {
        nextRound();
        setIsAnswered(false);
        setLastAnswerCorrect(null);
      }
    }, 2000);
  };

  const getTimerColor = () => {
    if (gameSession.timeLeft > 10) return 'text-green-400';
    if (gameSession.timeLeft > 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-white';
    }
  };

  if (!player) {
    return null;
  }

  if (!gameSession.isActive && !showSetup && !showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Ready to Play?</h1>
          <button
            onClick={() => setShowSetup(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300"
          >
            Start New Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {gameSession.isActive && gameSession.currentQuote && (
          <>
            {/* Game Header */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {gameSession.currentRound}/{gameSession.totalRounds}
                    </div>
                    <div className="text-white/70 text-sm">Round</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {gameSession.score.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm">Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold capitalize ${getDifficultyColor(gameSession.difficulty)}`}>
                      {gameSession.difficulty}
                    </div>
                    <div className="text-white/70 text-sm">Mode</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl font-bold ${getTimerColor()}`}>
                    {gameSession.timeLeft}
                  </div>
                  <Clock className={`h-8 w-8 ${getTimerColor()}`} />
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="text-6xl text-white/20 mb-4">"</div>
                  <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-6">
                    {gameSession.currentQuote.text}
                  </blockquote>
                  <div className="text-xl text-white/80">
                    — {gameSession.currentQuote.author}
                  </div>
                  <div className="text-sm text-white/60 mt-2">
                    {gameSession.currentQuote.category}
                  </div>
                </div>

                {!isAnswered ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-400 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                    >
                      <CheckCircle className="mr-2 h-6 w-6" />
                      Real Quote
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                    >
                      <XCircle className="mr-2 h-6 w-6" />
                      AI Fake
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-4 ${lastAnswerCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {lastAnswerCorrect ? 'Correct!' : 'Wrong!'}
                    </div>
                    <div className="text-white/80">
                      This quote was {gameSession.currentQuote.isReal ? 'real' : 'AI-generated'}
                    </div>
                    <div className="mt-4 text-white/60">
                      {gameSession.currentRound < gameSession.totalRounds ? 'Next round starting...' : 'Game complete!'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/10 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(gameSession.currentRound / gameSession.totalRounds) * 100}%` }}
              ></div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showSetup && (
        <GameSetupModal
          onStartGame={handleStartGame}
          onClose={() => navigate('/')}
        />
      )}

      {showResult && (
        <GameResultModal
          score={gameSession.score}
          totalRounds={gameSession.totalRounds}
          difficulty={gameSession.difficulty}
          onPlayAgain={() => {
            setShowResult(false);
            setShowSetup(true);
          }}
          onClose={() => {
            setShowResult(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
}