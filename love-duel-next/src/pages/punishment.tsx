import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { getPunishment } from '@/utils/getPunishment'

interface Punishment {
  task: string
  description: string
  time: number
  loser: 'player1' | 'player2'
}

interface GameSettings {
  difficulty: string
  players: {
    player1: { name: string; gender: string }
    player2: { name: string; gender: string }
  }
  loser: 'player1' | 'player2'
}

export default function PunishmentDisplay() {
  const router = useRouter()
  const [punishment, setPunishment] = useState<Punishment | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isActive, setIsActive] = useState(false)
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null)
  const [canSkip, setCanSkip] = useState(true)
  const [usedTasks, setUsedTasks] = useState<string[]>([])

  useEffect(() => {
    const settings = localStorage.getItem('gameSettings')
    const punishmentData = localStorage.getItem('currentPunishment')
    const usedTasksData = localStorage.getItem('usedTasks')
    
    if (!settings || !punishmentData) {
      router.push('/games')
      return
    }
    
    const parsedSettings = JSON.parse(settings)
    const parsedPunishment = JSON.parse(punishmentData)
    
    setGameSettings(parsedSettings)
    setPunishment(parsedPunishment)
    setTimeLeft(parsedPunishment.time)
    setUsedTasks(usedTasksData ? JSON.parse(usedTasksData) : [])
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const startTimer = () => {
    setIsActive(true)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSkip = () => {
    if (punishment && gameSettings) {
      // Add current task to used tasks
      const newUsedTasks = [...usedTasks, punishment.task]
      setUsedTasks(newUsedTasks)
      localStorage.setItem('usedTasks', JSON.stringify(newUsedTasks))
      
      // Get new punishment using the loser from the current punishment
      const newPunishment = getPunishment(
        gameSettings.difficulty, 
        gameSettings.players[punishment.loser].gender
      )
      
      // Add loser info to new punishment
      const punishmentWithLoser = {
        ...newPunishment,
        loser: punishment.loser
      }
      
      // Update punishment and reset timer
      setPunishment(punishmentWithLoser)
      setTimeLeft(newPunishment.time)
      setIsActive(false)
      
      // Store new punishment
      localStorage.setItem('currentPunishment', JSON.stringify(punishmentWithLoser))
      
      // Disable skip button
      setCanSkip(false)
    }
  }

  const handleComplete = () => {
    if (punishment) {
      // Add completed task to used tasks
      const newUsedTasks = [...usedTasks, punishment.task]
      setUsedTasks(newUsedTasks)
      localStorage.setItem('usedTasks', JSON.stringify(newUsedTasks))
    }
    localStorage.removeItem('currentPunishment')
    router.push('/games')
  }

  const playAgain = () => {
    localStorage.removeItem('currentPunishment')
    router.push('/games/tic-tac-toe')
  }

  if (!punishment || !gameSettings) return null

  return (
    <main className="min-h-screen relative overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="max-w-2xl w-full bg-black/30 backdrop-blur-sm p-8 rounded-xl
                    [box-shadow:_0_0_15px_rgba(139,92,246,0.3)]"
        >
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 10,
              delay: 0.2
            }}
            className="text-4xl font-bold text-center mb-8 text-white
                     [text-shadow:_0_0_10px_rgb(139,92,246)]"
          >
            <motion.span
              animate={{ 
                color: ['#fff', '#e879f9', '#fff'],
                textShadow: [
                  '0 0 10px rgb(139,92,246)',
                  '0 0 20px rgb(139,92,246)',
                  '0 0 10px rgb(139,92,246)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Punishment Time
            </motion.span>
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={punishment?.task}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center mb-8"
            >
              <motion.h2 
                className="text-2xl text-white mb-4"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {punishment?.task}
              </motion.h2>
              <p className="text-white/80 mb-6">{punishment?.description}</p>
              
              <motion.div
                className="text-5xl font-bold text-white mb-8
                          [text-shadow:_0_0_10px_rgb(139,92,246)]"
                animate={isActive ? {
                  scale: [1, 1.1, 1],
                  color: ['#fff', '#e879f9', '#fff'],
                } : {}}
                transition={{
                  duration: 1,
                  repeat: isActive ? Infinity : 0,
                }}
              >
                {formatTime(timeLeft)}
              </motion.div>

              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {!isActive && timeLeft === punishment?.time && timeLeft > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col gap-4"
                    >
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 25px rgba(139,92,246,0.6)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startTimer}
                        className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600
                                  hover:from-violet-500 hover:to-purple-500 text-white rounded-lg
                                  transition-all duration-300 font-bold"
                      >
                        Start
                      </motion.button>

                      {canSkip && (
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 0 25px rgba(244,63,94,0.6)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSkip}
                          className="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600
                                    hover:from-rose-500 hover:to-pink-500 text-white rounded-lg
                                    transition-all duration-300 font-bold"
                        >
                          Try Different Task (Once Only)
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {timeLeft === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15
                      }}
                      className="flex flex-col items-center gap-4"
                    >
                      <motion.p
                        animate={{
                          scale: [1, 1.2, 1],
                          color: ['#fff', '#e879f9', '#fff'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="text-2xl font-bold text-white mb-4"
                      >
                        Time's Up!
                      </motion.p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <motion.button
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 0 25px rgba(59,130,246,0.6)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={playAgain}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600
                                    hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg
                                    transition-all duration-300 font-bold"
                        >
                          Play Again
                        </motion.button>
                        <motion.button
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 0 25px rgba(139,92,246,0.6)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleComplete}
                          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600
                                    hover:from-violet-500 hover:to-purple-500 text-white rounded-lg
                                    transition-all duration-300 font-bold"
                        >
                          Choose New Game
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
} 