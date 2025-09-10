import React, { useState } from 'react';
import { X, User, Zap } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface PlayerSetupModalProps {
  onClose: () => void;
}

export default function PlayerSetupModal({ onClose }: PlayerSetupModalProps) {
  const { setPlayer } = usePlayer();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const avatarOptions = [
    '🎭', '🎨', '📚', '🔬', '🎪', '🎯', '🎲', '🎸', '🎬', '🎤'
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);

    // Create new player
    const newPlayer = {
      id: uuidv4(),
      name: playerName.trim(),
      score: 0,
      totalGames: 0,
      correctAnswers: 0,
      streak: 0,
      avatar: selectedAvatar,
      joinedAt: new Date()
    };

    setPlayer(newPlayer);
    setIsLoading(false);
    onClose();
    navigate('/game');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md rounded-3xl max-w-md w-full border border-white/20">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Create Your Profile</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Choose Your Avatar
            </label>
            <div className="grid grid-cols-5 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center transition-all duration-300 ${
                    selectedAvatar === avatar
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Player Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-white/40" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                maxLength={20}
                className="pl-10 w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-white/40"
                placeholder="Enter your name"
              />
            </div>
            <p className="text-xs text-white/60 mt-1">
              This will be displayed on the leaderboard
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="h-5 w-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Quick Tips</h3>
            </div>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Look for anachronisms in quotes</li>
              <li>• Consider the historical context</li>
              <li>• Trust your instincts</li>
              <li>• Speed bonuses reward quick thinking</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!playerName.trim() || isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? 'Creating Profile...' : 'Start Playing!'}
          </button>
        </form>
      </div>
    </div>
  );
}