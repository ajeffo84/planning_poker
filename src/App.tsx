import React from 'react';
import { useGameStore } from './store';
import { socket } from './socket';
import { PlayerList } from './components/PlayerList';
import { VotingArea } from './components/VotingArea';
import { Controls } from './components/Controls';

function App() {
  const [name, setName] = React.useState('');
  const [joined, setJoined] = React.useState(false);
  const { setPlayers, setRevealed } = useGameStore();

  React.useEffect(() => {
    socket.on('game-state', (state) => {
      setPlayers(state.players);
      setRevealed(state.revealed);
    });

    return () => {
      socket.off('game-state');
    };
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const playerId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('playerId', playerId);
    
    socket.emit('join', { playerId, name });
    setJoined(true);
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Join Planning Poker</h1>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Join Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          <PlayerList />
          <div className="flex-1">
            <VotingArea />
          </div>
        </div>
        <Controls />
      </div>
    </div>
  );
}

export default App;