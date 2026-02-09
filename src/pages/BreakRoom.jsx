import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Gamepad2, ArrowLeft, Trophy, Play, RotateCcw, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function BreakRoom() {
  const [selectedGame, setSelectedGame] = useState(null) // 'chess' | 'whot' | null

  return (
    <div className="space-y-8 h-full">
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          {selectedGame && (
            <button 
              onClick={() => setSelectedGame(null)}
              className="group flex items-center justify-center h-12 w-12 bg-yellow-400 border-2 border-black hover:bg-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-black" />
            </button>
          )}
          <div>
            <h1 className="font-['Anton'] text-5xl text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_#000]">
              The Arcade
            </h1>
            <p className="mt-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Safehouse Lounge // R&R
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-black border-2 border-zinc-700 px-6 py-3 font-mono text-zinc-400">
            <span className="text-xs uppercase tracking-widest bg-zinc-800 px-2 py-1 text-white">System Status: Nominal</span>
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
            <GameCard 
              title="Chess Master" 
              description="Tactical Simulation. Plan your moves against the Syndicate AI."
              icon={<div className="text-5xl grayscale">♟️</div>}
              color="bg-zinc-900"
              onClick={() => setSelectedGame('chess')}
            />
            <GameCard 
              title="Whot!" 
              description="The classic African card game. Match shapes, numbers, and dominate."
              icon={<div className="text-5xl grayscale">🎴</div>}
              color="bg-black"
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
      className={`group relative overflow-hidden border-2 border-zinc-700 ${color} text-left shadow-[8px_8px_0px_#000] hover:border-yellow-400 transition-all`}
    >
      <div className="p-8 relative z-10">
        <div className="mb-6 flex h-20 w-20 items-center justify-center border-2 border-zinc-800 bg-black text-4xl shadow-inner group-hover:border-yellow-400 transition-colors">
          {icon}
        </div>
        <h3 className="mb-2 font-['Anton'] text-3xl uppercase text-white tracking-wide">{title}</h3>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">{description}</p>
        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-yellow-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            <Gamepad2 className="h-4 w-4" />
            Insert Coin / Start
        </div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-20" />
    </motion.button>
  )
}

// --- CHESS GAME ---

function ChessGame() {
    const [game, setGame] = useState(new Chess())
    const [status, setStatus] = useState('Your Turn')
    const [history, setHistory] = useState([])

    const makeRandomMove = useCallback(() => {
        const possibleMoves = game.moves()
        if (game.isGameOver() || possibleMoves.length === 0) {
            handleGameOver()
            return
        }

        const randomIndex = Math.floor(Math.random() * possibleMoves.length)
        const move = possibleMoves[randomIndex]
        
        setTimeout(() => {
            game.move(move)
            setGame(new Chess(game.fen()))
            setHistory(prev => [...prev, `AI: ${move}`])
            setStatus('Your Turn')
            if (game.isGameOver()) handleGameOver()
        }, 600)
    }, [game])

    function handleGameOver() {
        if (game.isCheckmate()) setStatus('CHECKMATE!')
        else if (game.isDraw()) setStatus('DRAW')
        else setStatus('GAME OVER')
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
            setHistory(prev => [...prev, `You: ${move.san}`])
            setStatus('AI is thinking...')
            
            if (game.isGameOver()) {
                handleGameOver()
            } else {
                makeRandomMove()
            }
            return true
        } catch (e) {
            return false
        }
    }

    return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-5xl"
        >
            <div className="grid gap-8 md:grid-cols-[1fr,350px]">
                <div className="aspect-square w-full rounded-none border-4 border-zinc-800 bg-black p-4 shadow-2xl">
                    <Chessboard 
                        position={game.fen()} 
                        onPieceDrop={onDrop}
                        customDarkSquareStyle={{ backgroundColor: '#27272a' }}
                        customLightSquareStyle={{ backgroundColor: '#71717a' }}
                        customBoardStyle={{ borderRadius: '0', boxShadow: 'none' }}
                    />
                </div>
                <div className="space-y-6 border-2 border-zinc-800 bg-black p-6 h-full flex flex-col">
                    <div className="border-b-2 border-zinc-800 pb-4">
                        <h3 className="font-['Anton'] text-2xl text-white uppercase tracking-wider">Tactical Display</h3>
                        <p className="mt-1 text-yellow-400 font-mono text-xs uppercase animate-pulse">{status}</p>
                    </div>
                    
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 p-4 font-mono text-xs text-zinc-500 overflow-y-auto custom-scrollbar min-h-[300px]">
                        <p className="mb-2 text-zinc-600">{'>'} LOG_START</p>
                        {history.map((move, i) => (
                            <p key={i} className="mb-1 text-white">{'>'} {move}</p>
                        ))}
                        {history.length === 0 && <p className="italic opacity-30 italic">Waiting for initial strike...</p>}
                    </div>

                    <button 
                        onClick={() => {
                            setGame(new Chess())
                            setStatus('Your Turn')
                            setHistory([])
                        }}
                        className="w-full bg-white text-black font-['Anton'] uppercase py-4 hover:bg-yellow-400 transition-all border-2 border-black tracking-widest"
                    >
                        Reset Board
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// --- WHOT GAME ---

const SHAPES = ['CIRCLE', 'TRIANGLE', 'CROSS', 'STAR', 'SQUARE']
const WHOT_CARD = 'WHOT'

function WhotGame() {
    const [deck, setDeck] = useState([])
    const [playerHand, setPlayerHand] = useState([])
    const [aiHand, setAiHand] = useState([])
    const [topCard, setTopCard] = useState(null)
    const [gameState, setGameState] = useState('START') // START | PLAYING | WIN | LOSE
    const [turn, setTurn] = useState('PLAYER')
    
    // Initialize Game
    const initGame = useCallback(() => {
        let newDeck = []
        SHAPES.forEach(shape => {
            // Numbers 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14
            [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14].forEach(num => {
                newDeck.push({ shape, number: num })
            })
        })
        // Add 4 WHOT cards
        for (let i = 0; i < 4; i++) {
            newDeck.push({ shape: WHOT_CARD, number: 20 })
        }

        // Shuffle
        newDeck = newDeck.sort(() => Math.random() - 0.5)

        const pHand = newDeck.splice(0, 5)
        const aHand = newDeck.splice(0, 5)
        const tCard = newDeck.splice(0, 1)[0]

        setDeck(newDeck)
        setPlayerHand(pHand)
        setAiHand(aHand)
        setTopCard(tCard)
        setGameState('PLAYING')
        setTurn('PLAYER')
    }, [])

    useEffect(() => {
        if (gameState === 'START') initGame()
    }, [gameState, initGame])

    // AI Logic
    useEffect(() => {
        if (turn === 'AI' && gameState === 'PLAYING') {
            const timer = setTimeout(() => {
                const playableMove = aiHand.find(c => 
                    c.shape === WHOT_CARD || 
                    c.shape === topCard.shape || 
                    c.number === topCard.number ||
                    topCard.shape === WHOT_CARD
                )

                if (playableMove) {
                    setTopCard(playableMove)
                    setAiHand(prev => prev.filter(c => c !== playableMove))
                    if (aiHand.length === 1) setGameState('LOSE')
                    else setTurn('PLAYER')
                } else {
                    // Market
                    const newCard = deck[0]
                    setDeck(prev => prev.slice(1))
                    setAiHand(prev => [...prev, newCard])
                    setTurn('PLAYER')
                }
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [turn, aiHand, topCard, deck, gameState])

    const playCard = (card) => {
        if (turn !== 'PLAYER' || gameState !== 'PLAYING') return

        const canPlay = card.shape === WHOT_CARD || 
                        card.shape === topCard.shape || 
                        card.number === topCard.number ||
                        topCard.shape === WHOT_CARD

        if (canPlay) {
            setTopCard(card)
            setPlayerHand(prev => prev.filter(c => c !== card))
            if (playerHand.length === 1) setGameState('WIN')
            else setTurn('AI')
        } else {
            toast.error("Invalid Move. Cards must match number or shape.")
        }
    }

    const drawFromMarket = () => {
        if (turn !== 'PLAYER' || gameState !== 'PLAYING') return
        if (deck.length === 0) {
            toast.error("Market Empty.")
            return
        }
        const newCard = deck[0]
        setDeck(prev => prev.slice(1))
        setPlayerHand(prev => [...prev, newCard])
        setTurn('AI')
    }

    if (gameState === 'START') return null

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
            {/* Table Area */}
            <div className="relative h-[400px] border-4 border-zinc-800 bg-zinc-900 rounded-none mb-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* AI Stats */}
                <div className="absolute top-4 left-4 font-mono text-[10px] uppercase text-zinc-500">
                    Opponent Intelligence: Active ({aiHand.length} cards)
                </div>

                {/* Market Pile */}
                <button 
                  onClick={drawFromMarket}
                  className="absolute right-10 group"
                >
                    <div className="h-40 w-28 bg-zinc-800 border-2 border-zinc-700 flex flex-col items-center justify-center p-2 group-hover:border-yellow-400 transition-colors">
                        <div className="border border-zinc-700 w-full h-full flex flex-col items-center justify-center border-dashed">
                             <RotateCcw className="h-8 w-8 text-zinc-600 group-hover:text-yellow-400 transition-colors" />
                             <span className="mt-2 text-[10px] text-zinc-700">MARKET</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 left-0 w-full text-center text-[8px] text-zinc-600 uppercase font-mono">Tap to draw</div>
                </button>

                {/* Top Card (Discard Pile) */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={topCard ? `${topCard.shape}-${topCard.number}` : 'none'}
                        initial={{ y: -50, opacity: 0, rotate: -15 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        className="relative"
                    >
                        <WhotCardUI card={topCard} active />
                        <div className="absolute -bottom-8 left-0 w-full text-center text-[10px] text-zinc-500 uppercase font-mono">Current Target</div>
                    </motion.div>
                </AnimatePresence>

                {/* Game Overlay */}
                <AnimatePresence>
                    {(gameState === 'WIN' || gameState === 'LOSE') && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
                        >
                            <h2 className={`font-['Anton'] text-7xl uppercase mb-6 ${gameState === 'WIN' ? 'text-green-500' : 'text-red-600'}`}>
                                {gameState === 'WIN' ? 'MISSION SUCCESS' : 'MISSION FAILED'}
                            </h2>
                            <button 
                                onClick={() => setGameState('START')}
                                className="px-12 py-4 bg-white text-black font-['Anton'] text-2xl uppercase tracking-widest hover:bg-yellow-400 transition-all border-2 border-black"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hand Area */}
            <div className="border-2 border-zinc-800 bg-black p-8">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="font-mono text-xs uppercase text-zinc-500 tracking-widest">Your Crew's Hand</span>
                    <span className={`font-mono text-[10px] uppercase font-bold ${turn === 'PLAYER' ? 'text-yellow-400 animate-pulse' : 'text-zinc-700'}`}>
                        {turn === 'PLAYER' ? 'Action Required' : 'Waiting for move...'}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    {playerHand.map((card, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ y: -20, scale: 1.05 }}
                          onClick={() => playCard(card)}
                          className="cursor-pointer"
                        >
                            <WhotCardUI card={card} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Rules Overlay */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoTip icon={Info} text="Match Shape" />
                <InfoTip icon={Info} text="Match Number" />
                <InfoTip icon={Zap} text="WHOT! is Wild" />
                <InfoTip icon={Play} text="Empty hand to win" />
            </div>
        </motion.div>
    )
}

function WhotCardUI({ card, active }) {
    if (!card) return null
    const isSpecial = card.shape === WHOT_CARD
    
    return (
        <div className={`h-40 w-28 bg-white border-2 border-black flex flex-col items-center justify-center p-2 shadow-[4px_4px_0px_#000] rounded-sm transition-all ${active ? 'ring-4 ring-yellow-400' : ''}`}>
             <div className="w-full text-left font-black text-lg p-1 text-black leading-none">{card.number}</div>
             <div className="flex-1 flex items-center justify-center">
                {isSpecial ? (
                    <div className="font-['Anton'] text-2xl text-red-600 tracking-tighter">WHOT!</div>
                ) : (
                    <div className="text-4xl text-black">
                        {card.shape === 'CIRCLE' && '⭕'}
                        {card.shape === 'TRIANGLE' && '🔺'}
                        {card.shape === 'CROSS' && '❌'}
                        {card.shape === 'STAR' && '⭐'}
                        {card.shape === 'SQUARE' && '⬛'}
                    </div>
                )}
             </div>
             <div className="w-full text-right font-black text-lg p-1 text-black leading-none">{card.number}</div>
        </div>
    )
}

function InfoTip({ icon: Icon, text }) {
    return (
        <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-4 py-2 font-mono text-[10px] uppercase text-zinc-500">
            <Icon className="h-3 w-3 text-zinc-700" />
            {text}
        </div>
    )
}
