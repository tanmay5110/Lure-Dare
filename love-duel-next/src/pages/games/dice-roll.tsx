import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { getPunishment } from '@/utils/getPunishment'

interface GameSettings {
  difficulty: string
  players: {
    player1: { name: string; gender: string }
    player2: { name: string; gender: string }
  }
}

export default function DiceRoll() {
  const router = useRouter()
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null)
  const [diceNumber, setDiceNumber] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1')
  const [playerChoice, setPlayerChoice] = useState<'even' | 'odd' | null>(null)
  const [winner, setWinner] = useState<'player1' | 'player2' | null>(null)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  useEffect(() => {
    const settings = localStorage.getItem('gameSettings')
    if (!settings) {
      router.push('/difficulty')
      return
    }
    setGameSettings(JSON.parse(settings))
  }, [router])

  const handleChoice = (choice: 'even' | 'odd') => {
    setPlayerChoice(choice)
  }

  const rollDice = () => {
    if (isRolling || !playerChoice) return
    
    setIsRolling(true)
    if (isSoundEnabled) {
      new Audio('/sounds/dice-roll.mp3').play().catch(() => {})
    }

    let rollCount = 0
    const maxRolls = 20
    const rollInterval = setInterval(() => {
      setDiceNumber(Math.floor(Math.random() * 6) + 1)
      rollCount++

      if (rollCount >= maxRolls) {
        clearInterval(rollInterval)
        const finalNumber = Math.floor(Math.random() * 6) + 1
        setDiceNumber(finalNumber)
        determineRoundWinner(finalNumber)
        setIsRolling(false)
      }
    }, 50)
  }

  const determineRoundWinner = (number: number) => {
    const isEven = number % 2 === 0
    const playerWonRound = (playerChoice === 'even' && isEven) || (playerChoice === 'odd' && !isEven)
    
    if (playerWonRound) {
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }))

      // Check for game winner (first to 3)
      if (scores[currentPlayer] === 2) { // 2 because new point hasn't been added yet
        setWinner(currentPlayer)
        const loser = currentPlayer === 'player1' ? 'player2' : 'player1'
        const punishment = getPunishment(
          gameSettings?.difficulty || 'easy',
          gameSettings?.players[loser].gender || 'neutral'
        )
        localStorage.setItem('currentPunishment', JSON.stringify({
          ...punishment,
          loser
        }))
      }
    }

    // Switch player for next turn
    setCurrentPlayer(current => current === 'player1' ? 'player2' : 'player1')
    setPlayerChoice(null)
  }

  if (!gameSettings) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <Image
        src="/images/tic.webp"
        alt="Background"
        fill
        priority
        className="object-cover opacity-30"
      />
      
      <div className="relative z-10 max-w-md w-full mx-auto p-6">
        {/* Score Display */}
        <div className="flex justify-between mb-6 text-white bg-black/40 p-4 rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <p className="text-violet-300">{gameSettings.players.player1.name}</p>
            <p className="text-3xl font-bold text-violet-400">{scores.player1}</p>
          </div>
          <div className="text-center">
            <p className="text-violet-300">First to 3</p>
            {diceNumber && <p className="text-xl text-violet-200">
              Rolled {diceNumber} ({diceNumber % 2 === 0 ? 'EVEN' : 'ODD'})
            </p>}
          </div>
          <div className="text-center">
            <p className="text-violet-300">{gameSettings.players.player2.name}</p>
            <p className="text-3xl font-bold text-violet-400">{scores.player2}</p>
          </div>
        </div>

        {/* Current Player Turn */}
        {!winner && (
          <div className="text-center mb-6">
            <p className="text-violet-300 text-xl">
              {gameSettings.players[currentPlayer].name}&apos;s Turn
            </p>
          </div>
        )}

        {/* Choice Buttons */}
        {!winner && !isRolling && !playerChoice && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoice('even')}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg
                        hover:bg-violet-500 transition-all duration-300"
            >
              Choose Even
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoice('odd')}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg
                        hover:bg-violet-500 transition-all duration-300"
            >
              Choose Odd
            </motion.button>
          </div>
        )}

        {/* Dice Display */}
        <motion.div
          className="w-32 h-32 mx-auto mb-8 bg-violet-600/20 rounded-xl flex items-center justify-center
                     border-2 border-violet-500/30 backdrop-blur-sm"
          animate={isRolling ? {
            rotate: [0, 360],
            scale: [1, 0.8, 1]
          } : {}}
          transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
        >
          <span className="text-6xl text-white">
            {diceNumber || '?'}
          </span>
        </motion.div>

        {/* Roll Button */}
        {!winner && playerChoice && !isRolling && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rollDice}
            className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg
                      hover:bg-violet-500 transition-all duration-300"
          >
            Roll Dice
          </motion.button>
        )}

        {/* Winner Display */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-violet-400 mb-4">
                {gameSettings.players[winner].name} Wins!
              </h2>
              <p className="text-violet-300 mb-4">
                {winner === 'player1' ? gameSettings.players.player2.name : gameSettings.players.player1.name} 
                must perform the punishment!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/punishment')}
                className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg
                          hover:bg-violet-500 transition-all duration-300"
              >
                Continue to Punishment
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound Toggle */}
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="absolute top-2 right-2 text-white opacity-50 hover:opacity-100"
        >
          {isSoundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </main>
  )
} 