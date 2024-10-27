import React from 'react';
import { Eye, RefreshCw, Share2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useGameStore } from '../store';
import { socket } from '../socket';

export const Controls: React.FC = () => {
  const { players, revealed, allowVoteChange } = useGameStore();
  const playerId = React.useRef(localStorage.getItem('playerId'));
  const isAdmin = players[playerId.current!]?.isAdmin;

  const handleReveal = () => {
    socket.emit('reveal-cards');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const toggleVoteChange = () => {
    socket.emit('toggle-vote-change');
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        <Share2 className="w-5 h-5" />
        Share Link
      </button>
      <button
        onClick={handleReveal}
        disabled={revealed}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        <Eye className="w-5 h-5" />
        Reveal Cards
      </button>
      <button
        onClick={() => useGameStore.getState().startNewRound()}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
      >
        <RefreshCw className="w-5 h-5" />
        New Round
      </button>
      <button
        onClick={toggleVoteChange}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
      >
        {allowVoteChange ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
        {allowVoteChange ? 'Lock Votes' : 'Allow Changes'}
      </button>
    </div>
  );
};