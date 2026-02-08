
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Gamepad2, ArrowLeft, Trophy, Users } from 'lucide-react'

export default function BreakRoom() {
  const [selectedGame, setSelectedGame] = useState(null) // 'chess' | 'whot' | null

  return (
    <div className="space-y-8 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedGame && (
            <button 
              onClick={() => setSelectedGame(null)}
              className="rounded-full bg-[var(--accent)] p-2 hover:bg-[var(--border)]"
            >
              <ArrowLeft className="h-5 w-5 text-[var(--foreground)]" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">The Break Room</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">Relax and recharge with premium games</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-[var(--card)] border border-[var(--border)] px-4 py-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-[var(--foreground)]">Your Score: 1,250</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedGame ? (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Chess Card */}
            <GameCard 
              title="Chess Master" 
              description="Challenge the AI or play solo. Classic strategy at its finest."
              icon={<div className="text-4xl">♟️</div>}
              color="from-indigo-600 to-blue-600"
              onClick={() => setSelectedGame('chess')}
            />
            {/* Whot Card */}
            <GameCard 
              title="Whot!" 
              description="The classic Naija card game. First to finish their cards wins!"
              icon={<div className="text-4xl">🎴</div>}
              color="from-red-600 to-orange-600"
              onClick={() => setSelectedGame('whot')}
            />
          </motion.div>
        ) : selectedGame === 'chess' ? (
          <ChessGame />
        ) : (
          <WhotGame />
        )}
      </AnimatePresence>
    </div>
  )
}

function GameCard({ title, description, icon, color, onClick }) {
  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] text-left shadow-lg transition-all hover:shadow-xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity group-hover:opacity-5`} />
      <div className="p-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)] text-4xl shadow-inner">
          {icon}
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[var(--foreground)]">{title}</h3>
        <p className="text-[var(--muted-foreground)]">{description}</p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
            <Gamepad2 className="h-4 w-4" />
            Play Now
        </div>
      </div>
    </motion.button>
  )
}

function ChessGame() {
    const [game, setGame] = useState(new Chess())
    const [status, setStatus] = useState('Your Turn')
    
    // Simple random move AI for demo
    function makeRandomMove() {
        const possibleMoves = game.moves()
        if (game.game_over() || possibleMoves.length === 0) return

        const randomIndex = Math.floor(Math.random() * possibleMoves.length)
        
        // Timeout to simulate "thinking"
        setTimeout(() => {
            game.move(possibleMoves[randomIndex])
            setGame(new Chess(game.fen()))
            setStatus('Your Turn')
        }, 500)
    }

    function onDrop(sourceSquare, targetSquare) {
        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            })

            if (move === null) return false
            
            setGame(new Chess(game.fen()))
            setStatus('AI is thinking...')
            makeRandomMove()
            return true
        } catch (e) {
            return false
        }
    }

    return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-4xl"
        >
            <div className="grid gap-8 md:grid-cols-[1fr,300px]">
                <div className="aspect-square w-full max-w-[600px] rounded-xl border-[8px] border-[var(--card)] shadow-2xl">
                    <Chessboard position={game.fen()} onPieceDrop={onDrop} />
                </div>
                <div className="space-y-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Game Status</h3>
                        <p className="text-[var(--primary)] font-medium">{status}</p>
                    </div>
                    {/* Placeholder for move history or chat */}
                    <div className="h-64 rounded-lg bg-[var(--background)] p-4">
                        <p className="text-sm text-[var(--muted-foreground)] italic">Move history coming soon...</p>
                    </div>
                    <button 
                        onClick={() => {
                            setGame(new Chess())
                            setStatus('Your Turn')
                        }}
                        className="w-full rounded-lg bg-[var(--primary)] py-2 text-sm font-bold text-white hover:opacity-90"
                    >
                        Reset Game
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

function WhotGame() {
    // Very simplified placeholder for Whot UI
    return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
            <div className="rounded-xl border border-[var(--border)] bg-[#1a472a] p-8 text-center shadow-2xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Carpet Texture Overlay */}
                <div className="absolute inset-0 bg-black/10" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 120%)' }}></div>
                
                <h2 className="text-4xl font-extrabold text-white mb-8 relative z-10 drop-shadow-md">WHOT!</h2>
                
                <div className="flex gap-4 mb-12 relative z-10">
                    <div className="h-40 w-28 rounded-lg bg-white shadow-xl flex items-center justify-center text-red-600 text-6xl font-bold border-4 border-white transform -rotate-6">5</div>
                    <div className="h-40 w-28 rounded-lg bg-white shadow-xl flex items-center justify-center text-blue-600 text-6xl font-bold border-4 border-white transform translate-y-[-20px]">1</div>
                    <div className="h-40 w-28 rounded-lg bg-white shadow-xl flex items-center justify-center text-yellow-500 text-6xl font-bold border-4 border-white transform rotate-6">▲</div>
                </div>

                <div className="relative z-10 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
                    <p className="text-white text-lg">Single Player Mode coming soon!</p>
                    <button className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full shadow-lg transition-transform hover:scale-105">
                        Start Demo
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
