import React from 'react';
import { User, Clock } from 'lucide-react';
import { useGameStore } from '../store';

export const PlayerList: React.FC = () => {
  const { players, revealed, roundStartTime } = useGameStore();
  const [timer, setTimer] = React.useState('00:00');

  React.useEffect(() => {
    if (!roundStartTime) return;

    const interval = setInterval(() => {
      const diff = Date.now() - roundStartTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [roundStartTime]);

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span className="font-semibold">Players ({Object.keys(players).length})</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{timer}</span>
        </div>
      </div>
      <div className="space-y-2">
        {Object.values(players).map((player) => (
          <div key={player.id} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {player.name}
              {player.isAdmin && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Host</span>
              )}
            </span>
            {player.vote !== null && (
              <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
                revealed ? 'bg-green-100 text-green-800' : 'bg-gray-100'
              }`}>
                {revealed ? player.vote : '?'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};