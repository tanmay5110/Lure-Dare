import { easyChallengesToysi } from '../js/easy'
import { mediumChallenges } from '../js/medium'
import { hardChallenges } from '../js/hard'

interface Challenge {
  task: string
  description: string
  time: number
  number?: number
  image?: string
}

export const getPunishment = (difficulty: string, gender: string): Challenge => {
  let challenges
  
  switch(difficulty) {
    case 'easy':
      challenges = easyChallengesToysi[gender]
      break
    case 'medium':
      challenges = mediumChallenges[gender]
      break
    case 'hard':
      challenges = hardChallenges[gender]
      break
    default:
      challenges = easyChallengesToysi[gender]
  }

  // Get used tasks from localStorage
  const usedTasks = JSON.parse(localStorage.getItem('usedTasks') || '[]')
  
  // Filter out used tasks
  const availableChallenges = challenges.filter(
    challenge => !usedTasks.includes(challenge.task)
  )

  // If all tasks have been used, clear history and use all tasks
  if (availableChallenges.length === 0) {
    localStorage.setItem('usedTasks', '[]')
    return challenges[Math.floor(Math.random() * challenges.length)]
  }

  // Get random challenge from available ones
  const randomIndex = Math.floor(Math.random() * availableChallenges.length)
  return availableChallenges[randomIndex]
} 