import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Trophy, Users, Zap, Quote, Brain, Clock, Target } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import PlayerSetupModal from '../components/PlayerSetupModal';

export default function Home() {
  const { player } = usePlayer();
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);

  const handlePlayClick = () => {
    if (!player) {
      setShowPlayerSetup(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 blur-3xl"></div>
            <div className="relative">
              <Quote className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                  Misquote Me
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                Can you tell the difference between real historical quotes and AI-generated fakes? 
                Test your knowledge in this thrilling multiplayer trivia game!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {player ? (
              <Link
                to="/game"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
              >
                <Play className="mr-2 h-6 w-6" />
                Start Playing
              </Link>
            ) : (
              <button
                onClick={handlePlayClick}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
              >
                <Play className="mr-2 h-6 w-6" />
                Start Playing
              </button>
            )}
            <Link
              to="/leaderboard"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
            >
              <Trophy className="mr-2 h-6 w-6" />
              Leaderboard
            </Link>
          </div>

          {player && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">Welcome back, {player.name}!</h3>
                  <div className="text-white/70 space-y-1">
                    <div>Score: {player.score.toLocaleString()} points</div>
                    <div>Accuracy: {player.totalGames > 0 ? Math.round((player.correctAnswers / player.totalGames) * 100) : 0}%</div>
                    <div>Best Streak: {player.streak}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Challenge yourself with quotes from history's greatest minds - but beware of the AI imposters!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 backdrop-blur-sm border border-white/10">
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Read the Quote</h3>
              <p className="text-white/70">
                Each round presents you with a quote attributed to a famous historical figure.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-green-500/30 group-hover:to-teal-500/30 transition-all duration-300 backdrop-blur-sm border border-white/10">
                <Target className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Make Your Guess</h3>
              <p className="text-white/70">
                Decide if it's a real historical quote or an AI-generated fake designed to fool you.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-300 backdrop-blur-sm border border-white/10">
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Score Points</h3>
              <p className="text-white/70">
                Earn points for correct answers, with bonuses for speed and difficulty level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Choose Your Challenge
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Three difficulty levels to test players of all skill levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-green-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Easy Mode</h3>
              </div>
              <ul className="text-white/70 space-y-2 mb-4">
                <li>• 20 seconds per question</li>
                <li>• Obvious AI tells</li>
                <li>• 1x point multiplier</li>
                <li>• Perfect for beginners</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-yellow-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Medium Mode</h3>
              </div>
              <ul className="text-white/70 space-y-2 mb-4">
                <li>• 15 seconds per question</li>
                <li>• Subtle differences</li>
                <li>• 1.5x point multiplier</li>
                <li>• Balanced challenge</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-red-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Hard Mode</h3>
              </div>
              <ul className="text-white/70 space-y-2 mb-4">
                <li>• 10 seconds per question</li>
                <li>• Nearly indistinguishable</li>
                <li>• 2x point multiplier</li>
                <li>• Expert level challenge</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1000+</div>
              <div className="text-white/70">Historical Quotes</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-white/70">AI Fakes</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-white/70">Historical Figures</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-white/70">Games Played</div>
            </div>
          </div>
        </div>
      </section>

      {/* Player Setup Modal */}
      {showPlayerSetup && (
        <PlayerSetupModal onClose={() => setShowPlayerSetup(false)} />
      )}
    </div>
  );
}