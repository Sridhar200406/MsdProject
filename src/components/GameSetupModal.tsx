import React, { useState } from 'react';
import { X, Clock, Zap, Target, Trophy } from 'lucide-react';

interface GameSetupModalProps {
  onStartGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onClose: () => void;
}

export default function GameSetupModal({ onStartGame, onClose }: GameSetupModalProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const difficulties = [
    {
      level: 'easy' as const,
      name: 'Easy',
      description: 'Perfect for beginners',
      time: 20,
      multiplier: '1x',
      color: 'from-green-500 to-emerald-500',
      icon: Clock,
      features: ['20 seconds per question', 'Obvious AI tells', 'Forgiving scoring']
    },
    {
      level: 'medium' as const,
      name: 'Medium',
      description: 'Balanced challenge',
      time: 15,
      multiplier: '1.5x',
      color: 'from-yellow-500 to-orange-500',
      icon: Target,
      features: ['15 seconds per question', 'Subtle differences', 'Good point rewards']
    },
    {
      level: 'hard' as const,
      name: 'Hard',
      description: 'Expert level',
      time: 10,
      multiplier: '2x',
      color: 'from-red-500 to-pink-500',
      icon: Zap,
      features: ['10 seconds per question', 'Nearly indistinguishable', 'Maximum points']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md rounded-3xl max-w-4xl w-full border border-white/20">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Choose Your Challenge</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {difficulties.map((difficulty) => {
              const IconComponent = difficulty.icon;
              return (
                <button
                  key={difficulty.level}
                  onClick={() => setSelectedDifficulty(difficulty.level)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedDifficulty === difficulty.level
                      ? 'border-yellow-400 bg-white/10 scale-105'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${difficulty.color} flex items-center justify-center mr-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{difficulty.name}</h3>
                      <p className="text-white/70 text-sm">{difficulty.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Time per question:</span>
                      <span className="text-white font-semibold">{difficulty.time}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Point multiplier:</span>
                      <span className="text-yellow-400 font-semibold">{difficulty.multiplier}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {difficulty.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-white/70">
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-6 w-6 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Game Rules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
              <div>
                <h4 className="font-medium text-white mb-2">Scoring System</h4>
                <ul className="space-y-1">
                  <li>• Base points: 100 per correct answer</li>
                  <li>• Time bonus: Up to 50% extra points</li>
                  <li>• Difficulty multiplier applies to total</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Game Format</h4>
                <ul className="space-y-1">
                  <li>• 10 rounds per game</li>
                  <li>• Mix of real and AI-generated quotes</li>
                  <li>• Various historical figures and topics</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => onStartGame(selectedDifficulty)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Game - {difficulties.find(d => d.level === selectedDifficulty)?.name} Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}