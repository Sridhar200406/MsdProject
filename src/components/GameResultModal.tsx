import React from 'react';
import { Trophy, Star, Target, TrendingUp, RotateCcw, Home } from 'lucide-react';

interface GameResultModalProps {
  score: number;
  totalRounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function GameResultModal({ 
  score, 
  totalRounds, 
  difficulty, 
  onPlayAgain, 
  onClose 
}: GameResultModalProps) {
  const getPerformanceMessage = () => {
    const percentage = (score / (totalRounds * 100)) * 100;
    if (percentage >= 80) return { message: "Outstanding!", color: "text-yellow-400", icon: Trophy };
    if (percentage >= 60) return { message: "Great Job!", color: "text-green-400", icon: Star };
    if (percentage >= 40) return { message: "Good Effort!", color: "text-blue-400", icon: Target };
    return { message: "Keep Practicing!", color: "text-purple-400", icon: TrendingUp };
  };

  const performance = getPerformanceMessage();
  const IconComponent = performance.icon;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getDifficultyMultiplier = (diff: string) => {
    switch (diff) {
      case 'easy': return '1x';
      case 'medium': return '1.5x';
      case 'hard': return '2x';
      default: return '1x';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md rounded-3xl max-w-lg w-full border border-white/20">
        <div className="p-8 text-center">
          {/* Performance Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/30">
              <IconComponent className={`h-10 w-10 ${performance.color}`} />
            </div>
            <h2 className={`text-3xl font-bold ${performance.color}`}>
              {performance.message}
            </h2>
          </div>

          {/* Score Display */}
          <div className="mb-8">
            <div className="text-5xl font-bold text-white mb-2">
              {score.toLocaleString()}
            </div>
            <div className="text-white/70">Total Points Earned</div>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">{totalRounds}</div>
              <div className="text-white/70 text-sm">Questions</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className={`text-2xl font-bold capitalize ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </div>
              <div className="text-white/70 text-sm">Difficulty</div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Base Score Potential:</span>
                <span className="text-white">{(totalRounds * 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Difficulty Multiplier:</span>
                <span className={getDifficultyColor(difficulty)}>{getDifficultyMultiplier(difficulty)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Time Bonuses:</span>
                <span className="text-green-400">Included</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                <span className="text-white">Final Score:</span>
                <span className="text-yellow-400">{score.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 px-6 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Play Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 text-white py-3 px-6 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Share your score and challenge your friends!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}