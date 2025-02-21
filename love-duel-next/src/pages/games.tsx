import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface GameData {
  id: string
  title: string
  image: string
  description: string
}

interface GameSettings {
  difficulty: string
  players: {
    player1: { name: string; gender: string }
    player2: { name: string; gender: string }
  }
}

export default function GamesSelection() {
  const router = useRouter()
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null)

  useEffect(() => {
    const settings = localStorage.getItem('gameSettings')
    if (!settings) {
      router.push('/difficulty')
      return
    }
    setGameSettings(JSON.parse(settings))
  }, [router])

  const games: GameData[] = [
    {
      id: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      image: '/images/tic-tac-toe.png',
      description: 'Classic game of X\'s and O\'s with a twist'
    },
    {
      id: 'dice-roll',
      title: 'Love Dice',
      image: '/images/games/dice.jpg',
      description: 'Test your luck with even or odd rolls'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      image: '/images/games/memory.jpg',
      description: 'Test your memory by matching pairs of cards'
    },
    {
      id: 'reaction',
      title: 'Quick Reaction',
      image: '/images/games/reaction.jpg',
      description: 'Click the target as fast as you can'
    }
  ]

  const handleGameSelect = (gameId: string) => {
    router.push(`/games/${gameId}`)
  }

  if (!gameSettings) return null

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/sel.webp"
        alt="Background"
        fill
        className="object-cover object-center"
        priority
      />
      
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 py-12 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-12
                     text-transparent bg-clip-text bg-gradient-to-r 
                     from-purple-400 to-pink-600
                     [text-shadow:_0_0_30px_rgb(168_85_247_/_0.5)]"
        >
          Choose Your Game
        </motion.h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGameSelect(game.id)}
              className="relative group cursor-pointer rounded-xl overflow-hidden
                        bg-black/30 backdrop-blur-sm
                        [box-shadow:_0_0_15px_rgba(139,92,246,0.3)]
                        hover:[box-shadow:_0_0_30px_rgba(139,92,246,0.5)]
                        transition-all duration-500"
            >
              <div className="relative h-52 w-full bg-black/30">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className={`transition-transform duration-500 
                            group-hover:scale-110
                            ${game.id === 'tic-tac-toe' ? 'object-contain p-4' : 'object-cover'}`}
                />
                
                {/* Info Overlay - Only visible on hover */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/95 to-black/70
                            flex flex-col justify-end p-6 translate-y-full
                            group-hover:translate-y-0 transition-transform duration-300"
                >
                  <h2 className="text-2xl font-bold text-white mb-2
                                [text-shadow:_0_0_10px_rgb(139,92,246)]">
                    {game.title}
                  </h2>
                  <p className="text-white/90 mb-4">{game.description}</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 px-4 
                             bg-gradient-to-r from-violet-600 to-purple-600
                             hover:from-violet-500 hover:to-purple-500
                             text-white rounded-lg transition-all duration-300
                             border border-violet-400/30
                             [box-shadow:_0_0_15px_rgba(139,92,246,0.5)]"
                  >
                    Play Now
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
} 