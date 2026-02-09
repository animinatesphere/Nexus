import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Loader2, Lock, ShieldAlert, Key } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1605218427306-6354db696f98?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920",
]

export default function LoginOtp() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email | otp
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentBg, setCurrentBg] = useState(0)
  const [introLoading, setIntroLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })
      if (error) throw error
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (error) throw error
      navigate('/app')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans text-white cursor-none">
      <CustomCursor />
      
      <AnimatePresence>
        {introLoading && <IntroOverlay onComplete={() => setIntroLoading(false)} />}
      </AnimatePresence>

      {/* Background Slideshow */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence>
          <motion.img
            key={currentBg}
            src={BACKGROUNDS[currentBg]}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      {/* Navbar Area */}
      <nav className="fixed top-0 z-50 w-full px-8 py-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-white text-black flex items-center justify-center font-black text-2xl rounded-sm border-2 border-black transform -skew-x-12 shadow-[4px_4px_0px_rgba(255,255,0,1)] group-hover:bg-yellow-400 transition-colors">
                N
            </div>
            <span className="font-['Anton'] text-2xl tracking-widest text-white uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                NEXUS
            </span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
            <AnimatePresence mode='wait'>
                {step === 'email' ? (
                <motion.div
                    key="email-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="border-2 border-zinc-800 bg-black/80 p-8 shadow-[20px_20px_0px_#000] backdrop-blur-md relative"
                >
                    {/* Decorative Corner Borders */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400" />

                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="font-['Anton'] text-4xl text-white uppercase tracking-wider mb-2">System Access</h2>
                            <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">Enter Operative Credentials</p>
                        </div>

                        {error && (
                            <div className="bg-red-900/20 border border-red-500 p-3 text-[10px] text-red-500 font-mono uppercase font-bold text-center">
                                ERROR: {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-2">Operative Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ID-XXXX@TERMINAL.SYS"
                                    className="block w-full bg-black border-2 border-zinc-800 py-4 pl-12 pr-4 text-white font-mono placeholder-zinc-800 focus:border-yellow-400 focus:outline-none transition-all uppercase"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group relative flex w-full items-center justify-center gap-3 bg-white text-black font-['Anton'] text-2xl uppercase py-4 tracking-widest hover:bg-yellow-400 transition-all border-2 border-transparent hover:border-black disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                            <>
                                Initialize Session
                                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                            </>
                            )}
                        </button>
                    </form>
                </motion.div>
                ) : (
                <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="border-2 border-zinc-800 bg-black/80 p-8 shadow-[20px_20px_0px_#000] backdrop-blur-md relative"
                >
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400" />

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="inline-flex h-16 w-16 items-center justify-center border-2 border-yellow-400 bg-black mb-4">
                                <Key className="h-8 w-8 text-yellow-400 animate-pulse" />
                            </div>
                            <h2 className="font-['Anton'] text-4xl text-white uppercase tracking-wider mb-2">Auth Required</h2>
                            <p className="text-zinc-500 font-mono text-xs uppercase">
                                Key sent to: <span className="text-white">{email}</span>
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-900/20 border border-red-500 p-3 text-[10px] text-red-500 font-mono uppercase font-bold text-center">
                                ERROR: {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-2">Verification Key</label>
                            <input 
                                type="text" 
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="******"
                                className="block w-full bg-black border-2 border-zinc-800 py-4 px-4 text-center text-4xl font-mono font-bold tracking-[0.5em] text-white focus:border-yellow-400 focus:outline-none transition-all"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 bg-white text-black font-['Anton'] text-2xl uppercase py-4 tracking-widest hover:bg-yellow-400 transition-all border-2 border-transparent hover:border-black disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Enter System'}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => setStep('email')}
                            className="w-full text-[10px] text-zinc-600 font-mono uppercase hover:text-white transition-colors tracking-widest"
                        >
                            Abort / Wrong Identity
                        </button>
                    </form>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-8 w-full text-center z-10">
         <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em]">
            Security Level 5 Active // Encrypted Channel
         </p>
      </div>
    </div>
  )
}

function IntroOverlay({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2000)
        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="h-20 w-20 mx-auto bg-white text-black flex items-center justify-center font-black text-4xl rounded-sm border-2 border-black mb-6">
                    N
                </div>
                <h1 className="font-['Anton'] text-4xl text-white tracking-widest uppercase mb-2">Nexus Pro</h1>
                <div className="w-64 h-2 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-full bg-yellow-400"
                    />
                </div>
                <p className="mt-4 text-zinc-500 font-mono text-xs uppercase animate-pulse">Initializing Security Protocols...</p>
            </motion.div>
        </motion.div>
    )
}

function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener("mousemove", updateMousePosition)
        return () => window.removeEventListener("mousemove", updateMousePosition)
    }, [])

    return (
        <>
            <motion.div 
                className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-yellow-400 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
                animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
                transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
            />
            <motion.div 
                className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
                animate={{ x: mousePosition.x, y: mousePosition.y }}
                transition={{ type: "tween", ease: "linear", duration: 0 }}
            />
        </>
    )
}
