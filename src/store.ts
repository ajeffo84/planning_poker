import { create } from 'zustand';
import { GameState, Player } from './types';
import { socket } from './socket';

interface GameStore extends GameState {
  setPlayers: (players: Record<string, Player>) => void;
  setRevealed: (revealed: boolean) => void;
  setVote: (playerId: string, vote: number | null) => void;
  startNewRound: () => void;
  toggleVoteChange: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  players: {},
  revealed: false,
  roundStartTime: null,
  allowVoteChange: true,
  setPlayers: (players) => set({ players }),
  setRevealed: (revealed) => set({ revealed }),
  setVote: (playerId, vote) => 
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: { ...state.players[playerId], vote }
      }
    })),
  startNewRound: () => {
    socket.emit('start-new-round');
    set({ revealed: false, roundStartTime: Date.now() });
  },
  toggleVoteChange: () => 
    set((state) => ({ allowVoteChange: !state.allowVoteChange }))
}));