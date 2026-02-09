import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, Skull } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/app',
        },
      })

      if (error) throw error
      setMsg('Encryption Key Sent. Check your secure comms (email).')
    } catch (error) {
      setMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-md border-2 border-zinc-700 p-8 shadow-[10px_10px_0px_#000]"
      >
        {/* Header */}
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-yellow-400 text-black rounded-sm border-2 border-black mb-4 transform -rotate-6 shadow-lg">
                <Lock className="h-8 w-8" />
            </div>
            <h1 className="font-['Anton'] text-4xl text-white uppercase tracking-widest drop-shadow-md">
                System Access
            </h1>
            <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mt-2">
                Restricted Area // Authorized Personnel Only
            </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider ml-1">
                    Operative Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="agent@nexus.corp"
                    className="w-full bg-black border-2 border-zinc-700 p-4 text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="group w-full bg-white text-black font-['Anton'] text-xl uppercase py-4 tracking-widest hover:bg-yellow-400 transition-colors relative overflow-hidden"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Decrypting...' : 'Authenticate'} 
                    {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </span>
            </button>
        </form>

        {/* Message */}
        {msg && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-zinc-800 border-l-4 border-yellow-400 text-zinc-300 text-sm font-mono"
            >
                {msg}
            </motion.div>
        )}

        <div className="mt-8 text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-widest">
                New to the underworld?{' '}
                <Link to="/signup" className="text-white hover:text-yellow-400 font-bold border-b border-transparent hover:border-yellow-400 transition-colors">
                    Join the Syndicate
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}
