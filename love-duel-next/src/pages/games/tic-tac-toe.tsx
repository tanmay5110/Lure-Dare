import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { getPunishment } from '@/utils/getPunishment'

type Player = 'X' | 'O' | null
type Board = Player[]

interface GameSettings {
  difficulty: string
  players: {
    player1: { name: string; gender: string }
    player2: { name: string; gender: string }
  }
}

export default function KinkyConquest() {
  const router = useRouter()
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null)
  const [winner, setWinner] = useState<Player | 'draw' | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [matchCount, setMatchCount] = useState(0)
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [showMatchAnimation, setShowMatchAnimation] = useState(false)
  const [gameStatus, setGameStatus] = useState<string>('')
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  useEffect(() => {
    const settings = localStorage.getItem('gameSettings')
    if (!settings) {
      router.push('/difficulty')
      return
    }
    setGameSettings(JSON.parse(settings))
  }, [router])

  useEffect(() => {
    const audio = new Audio('/sounds/pop.mp3')
    if (isSoundEnabled && board.some(cell => cell !== null)) {
      audio.volume = 0.6
      audio.play().catch(() => {})
    }
  }, [board, isSoundEnabled])

  const calculateWinner = (squares: Board): [Player | 'draw' | null, number[] | null] => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], line]
      }
    }

    if (squares.every(square => square !== null)) {
      return ['draw', null]
    }

    return [null, null]
  }

  const handleClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const [gameWinner] = calculateWinner(newBoard)
    if (gameWinner) {
      if (gameWinner === 'draw') {
        setWinner('draw')
        setGameStatus('Game is a draw!')
      } else {
        setTimeout(() => {
          setWinner(gameWinner)
          setGameStatus(`${gameWinner === 'X' ? gameSettings?.players.player1.name : gameSettings?.players.player2.name} wins!`)
          
          if (gameWinner === 'X') {
            setScores(prev => ({ ...prev, player1: prev.player1 + 1 }))
          } else {
            setScores(prev => ({ ...prev, player2: prev.player2 + 1 }))
          }
          setMatchCount(prev => prev + 1)

          const loser = gameWinner === 'X' ? 'player2' : 'player1'
          const punishment = getPunishment(
            gameSettings?.difficulty || 'easy', 
            gameSettings?.players[loser].gender || 'neutral'
          )
          localStorage.setItem('currentPunishment', JSON.stringify({
            ...punishment,
            loser
          }))
        }, 500)
      }
    } else {
      setGameStatus(`${!isXNext ? gameSettings?.players.player1.name : gameSettings?.players.player2.name}'s turn`)
    }
    
    setIsXNext(!isXNext)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setGameStatus('')
    setShowMatchAnimation(false)
  }

  useEffect(() => {
    return () => {
      setBoard(Array(9).fill(null))
      setWinner(null)
      setShowMatchAnimation(false)
    }
  }, [])

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
        {/* Score Display with enhanced styling */}
        <div className="flex justify-between mb-6 text-white bg-black/40 p-4 rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <p className="text-violet-300">{gameSettings?.players.player1.name}</p>
            <p className="text-3xl font-bold text-violet-400">{scores.player1}</p>
          </div>
          <div className="text-center">
            <p className="text-violet-300">Match {matchCount + 1}/3</p>
            <p className="text-sm text-violet-200">{gameStatus}</p>
          </div>
          <div className="text-center">
            <p className="text-violet-300">{gameSettings?.players.player2.name}</p>
            <p className="text-3xl font-bold text-violet-400">{scores.player2}</p>
          </div>
        </div>

        {/* Turn Indicator */}
        <div className="text-center mb-4">
          <p className="text-white">
            Current Turn: {isXNext ? gameSettings?.players.player1.name : gameSettings?.players.player2.name}
          </p>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="absolute top-2 right-2 text-white opacity-50 hover:opacity-100"
        >
          {isSoundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Winner Announcement */}
        <AnimatePresence>
          {winner && winner !== 'draw' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 right-0 text-center -mt-12"
            >
              <div className="text-2xl font-bold text-violet-400 shadow-glow">
                {winner === 'X' ? gameSettings?.players.player1.name : gameSettings?.players.player2.name} Wins!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <div className="relative grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/70 border border-violet-500/30">
          {board.map((value, index) => {
            const [_, winningCells] = calculateWinner(board);
            const isWinningCell = winner && winningCells?.includes(index) && board[index] === winner;
            
            return (
              <motion.button
                key={index}
                onClick={() => handleClick(index)}
                animate={isWinningCell ? {
                  scale: 1.1,
                  backgroundColor: "rgba(139, 92, 246, 0.3)",
                  borderColor: "rgba(139, 92, 246, 0.8)",
                  transition: {
                    scale: {
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }
                } : {
                  scale: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  borderColor: "rgba(139, 92, 246, 0.2)"
                }}
                className={`aspect-square rounded-lg flex items-center justify-center
                          border transition-colors duration-500`}
                whileHover={!value && !winner ? {
                  scale: 1.05,
                  backgroundColor: "rgba(139, 92, 246, 0.1)"
                } : {}}
              >
                {value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-12 relative"
                  >
                    <Image
                      src={value === 'X' ? '/images/handcuffs.png' : '/images/condom.png'}
                      alt={value === 'X' ? 'Handcuffs' : 'Condom'}
                      fill
                      className={`object-contain ${isWinningCell ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : ''}`}
                    />
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Continue Button (appears after win) */}
          <AnimatePresence>
            {winner && winner !== 'draw' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-x-0 -bottom-16"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/punishment')}
                  className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg
                            hover:bg-violet-500 transition-all duration-300
                            shadow-[0_0_10px rgba(139,92,246,0.3)]"
                >
                  Continue to Punishment
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Draw Game Popup */}
        <AnimatePresence>
          {winner === 'draw' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { type: "spring", stiffness: 300, damping: 25 }
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-black/80 border border-violet-500/30 p-8 rounded-xl
                          backdrop-blur-md shadow-[0_0_15px rgba(139,92,246,0.3)]"
              >
                <h2 className="text-2xl font-bold text-white mb-6">It's a Draw!</h2>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(139,92,246,0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-8 py-3 bg-violet-600 text-white rounded-lg
                            hover:bg-violet-500 transition-all duration-300
                            shadow-[0_0_10px rgba(139,92,246,0.3)]"
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restart Game Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="mt-4 px-6 py-2 bg-violet-600/50 text-white rounded-lg
                    hover:bg-violet-500/50 transition-all duration-300
                    w-full"
        >
          Restart Game
        </motion.button>
      </div>

      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .shadow-glow {
          text-shadow: 0 0 10px rgba(139, 92, 246, 0.5),
                       0 0 20px rgba(139, 92, 246, 0.3),
                       0 0 30px rgba(139, 92, 246, 0.2);
        }
      `}</style>
    </main>
  )
} 