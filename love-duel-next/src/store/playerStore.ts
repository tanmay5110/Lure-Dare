import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlayerData {
  name: string;
  gender: 'male' | 'female';
}

interface PlayerStore {
  player1: PlayerData;
  player2: PlayerData;
  setPlayers: (p1: PlayerData, p2: PlayerData) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      player1: { name: '', gender: 'male' },
      player2: { name: '', gender: 'female' },
      setPlayers: (player1, player2) => set({ player1, player2 }),
    }),
    {
      name: 'player-storage',
    }
  )
)