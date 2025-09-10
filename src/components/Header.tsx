import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Quote, Trophy, User, Menu, X, Zap } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function Header() {
  const { player } = usePlayer();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Quote className="h-8 w-8 text-yellow-400" />
              <Zap className="h-4 w-4 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Misquote Me
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${
                isActive('/') 
                  ? 'text-yellow-400' 
                  : 'text-white/80 hover:text-yellow-400'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/game" 
              className={`transition-colors ${
                isActive('/game') 
                  ? 'text-yellow-400' 
                  : 'text-white/80 hover:text-yellow-400'
              }`}
            >
              Play Game
            </Link>
            <Link 
              to="/leaderboard" 
              className={`flex items-center space-x-1 transition-colors ${
                isActive('/leaderboard') 
                  ? 'text-yellow-400' 
                  : 'text-white/80 hover:text-yellow-400'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
          </nav>

          {/* Player Info */}
          <div className="flex items-center space-x-4">
            {player && (
              <div className="hidden sm:flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-white">
                  <div className="text-sm font-medium">{player.name}</div>
                  <div className="text-xs text-white/70">{player.score.toLocaleString()} pts</div>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`transition-colors ${
                  isActive('/') 
                    ? 'text-yellow-400' 
                    : 'text-white/80 hover:text-yellow-400'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/game" 
                className={`transition-colors ${
                  isActive('/game') 
                    ? 'text-yellow-400' 
                    : 'text-white/80 hover:text-yellow-400'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Play Game
              </Link>
              <Link 
                to="/leaderboard" 
                className={`flex items-center space-x-1 transition-colors ${
                  isActive('/leaderboard') 
                    ? 'text-yellow-400' 
                    : 'text-white/80 hover:text-yellow-400'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              
              {player && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-white">
                      <div className="text-sm font-medium">{player.name}</div>
                      <div className="text-xs text-white/70">{player.score.toLocaleString()} pts</div>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}