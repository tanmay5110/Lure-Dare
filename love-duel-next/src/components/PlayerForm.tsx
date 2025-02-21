import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function PlayerForm({ className }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [players, setPlayers] = useState({
    player1: { name: '', gender: 'male' as const },
    player2: { name: '', gender: 'female' as const }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!players.player1.name.trim() || !players.player2.name.trim()) {
      setError('Please enter names for both players');
      return;
    }
    localStorage.setItem('playerData', JSON.stringify(players));
    router.push('/difficulty');
  };

  return (
    <form onSubmit={handleSubmit} 
          className={`bg-black/30 backdrop-blur-sm p-4 sm:p-6 md:p-8 
                     rounded-lg border border-white/10 ${className}`}>
      {['player1', 'player2'].map((player, index) => (
        <motion.div 
          key={player} 
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 
                          flex items-center justify-center border border-white/20 
                          text-sm md:text-base">
              {index + 1}
            </div>
            <h3 className="text-lg md:text-xl text-white">Player {index + 1}</h3>
          </div>
          
          <div className="space-y-4">
            <motion.input
              type="text"
              value={players[player as keyof typeof players].name}
              onChange={(e) => {
                setError('');
                setPlayers(prev => ({
                  ...prev,
                  [player]: { ...prev[player as keyof typeof players], name: e.target.value }
                }))
              }}
              placeholder="Enter name"
              className={`w-full px-4 py-2 bg-white/10 border rounded-lg 
                        text-white placeholder-white/50 focus:outline-none
                        transition-all duration-200 hover:bg-white/20
                        ${!players[player as keyof typeof players].name.trim() && error 
                          ? 'border-red-500' 
                          : 'border-white/20 focus:border-white/40'}`}
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            />

            <div className="flex gap-3">
              {['male', 'female'].map((gender) => (
                <motion.button
                  key={gender}
                  type="button"
                  onClick={() => setPlayers(prev => ({
                    ...prev,
                    [player]: { ...prev[player as keyof typeof players], gender: gender as 'male' | 'female' }
                  }))}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-all duration-200
                    ${players[player as keyof typeof players].gender === gender
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-black/20 border-white/10 text-white/60'}`}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    x: players[player as keyof typeof players].gender === gender ? 0 : -5,
                    opacity: players[player as keyof typeof players].gender === gender ? 1 : 0.7
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {gender === 'male' ? '👨 Male' : '👩 Female'}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs md:text-sm mb-4 text-center"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        className="w-full py-2.5 md:py-3 px-4 md:px-6 
                   bg-white/10 border border-white/20 rounded-lg 
                   text-white font-bold text-sm md:text-base 
                   transition-all duration-200"
        whileHover={{ 
          scale: 1.02,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        Start Game
      </motion.button>
    </form>
  );
}