import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface PlayerData {
  player1: { name: string; gender: string }
  player2: { name: string; gender: string }
}

export default function DifficultySelection() {
  const router = useRouter()
  const [players, setPlayers] = useState<PlayerData | null>(null)

  useEffect(() => {
    const storedPlayers = localStorage.getItem('playerData')
    if (!storedPlayers) {
      router.push('/') // Redirect to home if no player data
      return
    }
    setPlayers(JSON.parse(storedPlayers))
  }, [router])
  
  const difficulties = [
    {
      level: 'Easy',
      image: '/images/easy.jpeg',
      description: 'Light & Playful',
      gradient: 'from-green-400 to-green-700',
      preview: [
        '• Gentle kisses and caresses',
        '• Light teasing and flirting',
        '• Playful challenges'
      ]
    },
    {
      level: 'Medium',
      image: '/images/medium.jpeg',
      description: 'Moderate & Exciting',
      gradient: 'from-yellow-400 to-orange-600',
      preview: [
        '• More intimate touches',
        '• Sensual massages',
        '• Passionate encounters'
      ]
    },
    {
      level: 'Hard',
      image: '/images/hard.jpeg',
      description: 'Intense & Daring',
      gradient: 'from-red-400 to-red-700',
      preview: [
        '• Deep intimacy',
        '• Intense passion',
        '• Ultimate pleasure'
      ]
    }
  ]

  const handleDifficultySelect = (level: string) => {
    // Store game settings
    const gameSettings = {
      difficulty: level.toLowerCase(),
      players: players,
      currentGame: null,
      scores: {
        player1: 0,
        player2: 0
      }
    }
    
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings))
    router.push('/games')
  }

  if (!players) return null

  return (
    <main className="h-screen w-screen flex">
      {difficulties.map((diff, index) => (
        <motion.div
          key={diff.level}
          initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: index === 1 ? 50 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          className="relative flex-1 h-full group cursor-pointer overflow-hidden"
          onClick={() => handleDifficultySelect(diff.level)}
        >
          <Image
            src={diff.image}
            alt={diff.level}
            fill
            className="object-cover brightness-75 group-hover:brightness-90 
                       group-hover:scale-110 transition-all duration-700"
          />
          
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 
                         transition-all duration-500" />

          <div className="absolute inset-0 flex flex-col items-center justify-center 
                          gap-6 p-4 transform group-hover:scale-105 
                          transition-transform duration-500">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              className="text-4xl font-bold text-white text-center drop-shadow-lg"
            >
              {diff.level}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
              className="text-white/90 text-center text-lg"
            >
              {diff.description}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.2 }}
              className="text-white/80 text-center space-y-2 mb-4"
            >
              {diff.preview.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </motion.ul>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 8px rgb(255,255,255)",
                boxShadow: "0 0 8px rgb(255,255,255)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 300
              }}
              className={`relative overflow-hidden group/btn
                         px-8 py-3 rounded-lg text-white font-bold
                         ${diff.level === 'Easy' ? 'bg-emerald-600 hover:bg-emerald-500' : 
                           diff.level === 'Medium' ? 'bg-amber-600 hover:bg-amber-500' :
                           'bg-rose-600 hover:bg-rose-500'}
                         transition-all duration-300
                         border border-white/20
                         before:absolute before:inset-0
                         before:bg-white/20 before:translate-x-[-100%]
                         before:hover:translate-x-[100%]
                         before:transition-transform before:duration-300
                         before:skew-x-12 before:pointer-events-none`}
            >
              <span className="relative inline-flex items-center gap-2">
                {diff.level === 'Easy' ? '🌟' : 
                 diff.level === 'Medium' ? '🔥' : 
                 '⚡'} 
                Select Level
                <motion.span
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {diff.level === 'Easy' ? '💫' : 
                   diff.level === 'Medium' ? '🌋' : 
                   '💥'}
                </motion.span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </main>
  )
} 