import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  totalGames: number;
  correctAnswers: number;
  streak: number;
  accuracy: number;
  rank: number;
}

export default function Leaderboard() {
  const { player } = usePlayer();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all-time' | 'weekly' | 'accuracy'>('all-time');

  useEffect(() => {
    // Mock leaderboard data - in a real app, this would come from your API
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'QuoteMaster',
        score: 15420,
        totalGames: 89,
        correctAnswers: 76,
        streak: 12,
        accuracy: 85,
        rank: 1
      },
      {
        id: '2',
        name: 'HistoryBuff',
        score: 12890,
        totalGames: 67,
        correctAnswers: 58,
        streak: 8,
        accuracy: 87,
        rank: 2
      },
      {
        id: '3',
        name: 'AIDetective',
        score: 11750,
        totalGames: 54,
        correctAnswers: 48,
        streak: 15,
        accuracy: 89,
        rank: 3
      },
      {
        id: '4',
        name: 'WisdomSeeker',
        score: 10200,
        totalGames: 45,
        correctAnswers: 38,
        streak: 6,
        accuracy: 84,
        rank: 4
      },
      {
        id: '5',
        name: 'QuoteNinja',
        score: 9850,
        totalGames: 42,
        correctAnswers: 36,
        streak: 9,
        accuracy: 86,
        rank: 5
      }
    ];

    // Add current player if they exist
    if (player && player.totalGames > 0) {
      const playerEntry: LeaderboardEntry = {
        id: player.id,
        name: player.name,
        score: player.score,
        totalGames: player.totalGames,
        correctAnswers: player.correctAnswers,
        streak: player.streak,
        accuracy: player.totalGames > 0 ? Math.round((player.correctAnswers / player.totalGames) * 100) : 0,
        rank: 0
      };

      const combinedLeaderboard = [...mockLeaderboard, playerEntry]
        .sort((a, b) => {
          if (selectedTab === 'accuracy') return b.accuracy - a.accuracy;
          return b.score - a.score;
        })
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboard(combinedLeaderboard);
    } else {
      setLeaderboard(mockLeaderboard);
    }
  }, [player, selectedTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-white/60 font-bold">{rank}</div>;
    }
  };

  const getRankBg = (rank: number, isCurrentPlayer: boolean) => {
    if (isCurrentPlayer) return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50';
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-lg text-white/70">
            See how you stack up against other quote detectives
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-8 border border-white/20">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab('all-time')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                selectedTab === 'all-time'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              All Time
            </button>
            <button
              onClick={() => setSelectedTab('weekly')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                selectedTab === 'weekly'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Star className="h-4 w-4 inline mr-2" />
              This Week
            </button>
            <button
              onClick={() => setSelectedTab('accuracy')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                selectedTab === 'accuracy'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Accuracy
            </button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <div
              key={entry.id}
              className={`${getRankBg(entry.rank, entry.id === player?.id)} backdrop-blur-md rounded-2xl p-6 border text-center transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex justify-center mb-4">
                {getRankIcon(entry.rank)}
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                {entry.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{entry.name}</h3>
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {selectedTab === 'accuracy' ? `${entry.accuracy}%` : entry.score.toLocaleString()}
              </div>
              <div className="text-white/70 text-sm space-y-1">
                <div>Games: {entry.totalGames}</div>
                <div>Streak: {entry.streak}</div>
                <div>Accuracy: {entry.accuracy}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Full Rankings</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`p-6 hover:bg-white/5 transition-colors ${
                  entry.id === player?.id ? 'bg-purple-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        {entry.name}
                        {entry.id === player?.id && (
                          <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <div className="text-white/60 text-sm">
                        {entry.totalGames} games played
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">
                      {selectedTab === 'accuracy' ? `${entry.accuracy}%` : entry.score.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">
                      {selectedTab === 'accuracy' ? 'Accuracy' : 'Points'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-white">{entry.correctAnswers}</div>
                    <div className="text-white/60 text-xs">Correct</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{entry.streak}</div>
                    <div className="text-white/60 text-xs">Best Streak</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{entry.accuracy}%</div>
                    <div className="text-white/60 text-xs">Accuracy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!player && (
          <div className="text-center mt-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Join the Competition!</h3>
              <p className="text-white/70 mb-6">
                Create a player profile to track your progress and compete on the leaderboard.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}