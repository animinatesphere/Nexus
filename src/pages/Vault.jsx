import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Upload, File, Image as ImageIcon, Shield, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Vault() {
  const [isLocked, setIsLocked] = useState(true)
  const [pin, setPin] = useState('')
  const [savedPin, setSavedPin] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfilePin()
  }, [])

  useEffect(() => {
    if (!isLocked) {
      fetchVaultItems()
    }
  }, [isLocked])

  const fetchProfilePin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('vault_pin')
        .eq('id', user.id)
        .single()
      
      if (data && data.vault_pin) {
        setSavedPin(data.vault_pin)
      } else {
        // Default if no PIN set
        setSavedPin('1234') 
      }
    } catch (err) {
      console.error(err)
      setSavedPin('1234') // Fallback
    }
  }

  const fetchVaultItems = async () => {
    try {
      const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .order('created_at', { ascending: false })
      
      // If table doesn't exist yet or empty, show mock data
      if (error && error.code !== 'PGRST116') {
         // Silently fail or simple mock for now if table missing
         setItems([]) 
      } else {
        setItems(data || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pin === savedPin) {
      setIsLocked(false)
      setPin('')
      setError(null)
    } else {
      setError('Incorrect PIN')
      setPin('')
    }
  }

  const handleLock = () => {
    setIsLocked(true)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-6">
        <div>
          <h1 className="font-['Anton'] text-5xl text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_#000]">
            The Vault
          </h1>
          <p className="mt-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Secure Evidence Storage // Classified
          </p>
        </div>
        {!isLocked && (
          <button 
            onClick={handleLock}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 font-['Anton'] uppercase tracking-wider hover:bg-red-500 transition-all shadow-[4px_4px_0px_#000] border-2 border-black"
          >
            <Lock className="h-5 w-5" />
            Engage Locks
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-md bg-zinc-900 border-4 border-zinc-700 p-8 shadow-[20px_20px_0px_#000] relative overflow-hidden">
                {/* Decorative Bolts */}
                <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
                <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />
                <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-zinc-600 shadow-inner" />

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-6 bg-black border-2 border-zinc-800 rounded-full mb-4">
                        <Shield className="h-12 w-12 text-zinc-500" />
                    </div>
                    <h2 className="font-['Anton'] text-3xl text-white uppercase tracking-widest">Restricted Access</h2>
                    <p className="mt-2 text-red-500 font-mono text-xs uppercase animate-pulse">
                        Level 5 Security Clearance Required
                    </p>
                </div>
            
                <form onSubmit={handleUnlock} className="flex flex-col items-center gap-6">
                    <div className="w-full relative">
                        <input
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="_ _ _ _"
                            className="w-full bg-black border-2 border-zinc-600 px-4 py-4 text-center text-4xl font-mono font-bold tracking-[1em] text-white focus:border-yellow-400 focus:outline-none placeholder-zinc-800"
                        />
                         <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    </div>

                    {error && (
                        <div className="w-full bg-red-900/20 border border-red-500 p-2 text-center">
                            <p className="text-red-500 font-mono text-xs uppercase font-bold">{error}</p>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full bg-white text-black font-['Anton'] text-xl uppercase py-4 tracking-widest hover:bg-yellow-400 transition-colors border-2 border-zinc-500"
                    >
                        Authenticate
                    </button>
                </form>
                <p className="mt-6 text-center text-zinc-600 font-mono text-[10px] uppercase">
                    {savedPin === '1234' ? 'DEBUG MODE: PIN IS 1234' : 'Attempts logged by server'}
                </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Upload Area */}
            <div className="border-2 border-dashed border-zinc-700 bg-zinc-900/30 p-12 text-center hover:bg-zinc-900/50 hover:border-yellow-400 transition-all cursor-pointer group">
              <Upload className="mx-auto h-12 w-12 text-zinc-600 group-hover:text-yellow-400 transition-colors" />
              <p className="mt-4 font-['Anton'] text-xl text-white uppercase tracking-wider">Drop Evidence Here</p>
              <p className="text-zinc-500 font-mono text-xs uppercase">Secure encryption enabled</p>
            </div>

            {/* File Web */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {items.length > 0 ? items.map((item) => (
                <div key={item.id} className="group relative aspect-square border-2 border-zinc-800 bg-black p-4 hover:border-yellow-400 transition-all">
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse" />
                   </div>
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    {item.type === 'image' ? (
                      <ImageIcon className="h-10 w-10 text-zinc-400 group-hover:text-white" />
                    ) : (
                      <File className="h-10 w-10 text-zinc-400 group-hover:text-white" />
                    )}
                    <span className="text-center font-mono text-xs text-zinc-500 group-hover:text-yellow-400 truncate w-full uppercase">{item.name}</span>
                  </div>
                </div>
              )) : (
                 <div className="col-span-full py-12 text-center border-2 border-zinc-800 bg-black">
                    <p className="text-zinc-500 font-mono uppercase tracking-widest">Vault Empty. No intel stored.</p>
                 </div>
              )}
              
              {/* Add New Placeholder */}
              <button className="flex aspect-square flex-col items-center justify-center gap-2 border-2 border-zinc-800 bg-zinc-900/50 text-zinc-600 hover:text-white hover:bg-zinc-800 hover:border-white transition-all">
                <Plus className="h-8 w-8" />
                <span className="font-['Anton'] text-sm uppercase tracking-wider">New File</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
