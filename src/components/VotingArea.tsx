import React from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store';
import { socket } from '../socket';

const CARDS = [1, 3, 5, 8, 13, 21];

export const VotingArea: React.FC = () => {
  const { players, revealed, allowVoteChange } = useGameStore();
  const playerId = React.useRef(localStorage.getItem('playerId'));
  const currentPlayer = players[playerId.current!];

  const votes = Object.values(players)
    .map(p => p.vote)
    .filter((v): v is number => v !== null);

  const average = votes.length 
    ? Math.round(votes.reduce((a, b) => a + b, 0) / votes.length * 10) / 10
    : 0;

  const handleVote = (value: number) => {
    if (revealed && !allowVoteChange) return;
    socket.emit('vote', { playerId: playerId.current, vote: value });
  };

  React.useEffect(() => {
    if (revealed && votes.length > 1 && new Set(votes).size === 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [revealed, votes]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-3 gap-4">
        {CARDS.map((value) => (
          <button
            key={value}
            onClick={() => handleVote(value)}
            className={`w-24 h-36 rounded-lg shadow-lg transition-all transform hover:scale-105 ${
              currentPlayer?.vote === value
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl font-bold">{value}</span>
          </button>
        ))}
      </div>

      {revealed && (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Round Results</h3>
          <div className="space-y-2">
            <p>Average: <span className="font-semibold">{average}</span></p>
            <p>Votes: {votes.join(', ')}</p>
            {votes.length > 1 && new Set(votes).size === 1 && (
              <p className="text-green-600 font-semibold">Perfect consensus! 🎉</p>
            )}
            {votes.length > 1 && Math.max(...votes) / Math.min(...votes) >= 2 && (
              <div className="text-yellow-600">
                <p className="font-semibold">Outliers detected:</p>
                <ul className="list-disc list-inside">
                  {Object.values(players)
                    .filter(p => p.vote !== null && Math.abs(p.vote - average) > average * 0.5)
                    .map(p => (
                      <li key={p.id}>{p.name}: {p.vote}</li>
                    ))
                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};