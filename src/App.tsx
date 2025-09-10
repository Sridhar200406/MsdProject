import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { GameProvider } from './context/GameContext';
import { PlayerProvider } from './context/PlayerContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';

function App() {
  return (
    <Router>
      <PlayerProvider>
        <GameProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <Header />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
              </main>
              <NotificationToast />
            </div>
          </NotificationProvider>
        </GameProvider>
      </PlayerProvider>
    </Router>
  );
}

export default App;