import { motion } from 'framer-motion'
import PlayerForm from '../components/PlayerForm'
import Image from 'next/image'
import { Great_Vibes, Playfair_Display } from 'next/font/google'

const greatVibes = Great_Vibes({ 
  subsets: ['latin'],
  weight: ['400'],
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="fixed inset-0">
        <Image
          src="/images/bjredlip.jpeg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          ease: "easeOut"
        }}
        className={`absolute top-6 left-1/2 -translate-x-1/2 text-center ${greatVibes.className}`}
      >
        <motion.h1
          className="text-6xl font-normal tracking-wide px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <span className="bg-gradient-to-r from-red-400 via-red-600 to-red-800 
                         bg-clip-text text-transparent 
                         drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
                         hover:from-red-300 hover:via-red-500 hover:to-red-700
                         transition-all duration-300">
            Love Duel
          </span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent mt-4 w-[140%] -ml-[20%]"
        />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          delay: 0.4 
        }}
        className="absolute left-[10%]
                   top-[20%] -translate-y-1/2 
                   w-[350px]"
      >
        <PlayerForm className={playfair.className} />
      </motion.div>
    </main>
  );
}