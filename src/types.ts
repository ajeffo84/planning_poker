export interface Player {
  id: string;
  name: string;
  vote: number | null;
  isAdmin: boolean;
}

export interface GameState {
  players: Record<string, Player>;
  revealed: boolean;
  roundStartTime: number | null;
  allowVoteChange: boolean;
}