import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Lock, User, Bell, Shield, Terminal } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [pin, setPin] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('vault_pin')
        .eq('id', user.id)
        .single()
        
      if (data) {
        setPin(data.vault_pin || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleUpdatePin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (pin.length !== 4) throw new Error('PIN must be 4 digits')

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          vault_pin: pin,
          updated_at: new Date()
        })

      if (error) throw error
      setMessage('Vault PIN updated successfully!')
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-8 h-full">
      <div className="border-b-2 border-zinc-800 pb-6">
        <h1 className="font-['Anton'] text-5xl text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_#000]">
          System Config
        </h1>
        <p className="mt-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Preferences // Security Protocols
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
          {/* Vault Security Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-none border-2 border-zinc-700 bg-black p-1 shadow-[10px_10px_0px_#000]"
          >
            <div className="bg-zinc-900/50 p-6 border border-zinc-800 h-full">
                <div className="flex items-center gap-4 border-b-2 border-zinc-800 pb-6 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_#000]">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-['Anton'] text-2xl text-white uppercase tracking-wide">Vault Protocols</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase">Encryption Key Management</p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePin} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Security PIN</label>
                    <div className="flex items-center gap-4">
                        <input 
                        type="password" 
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="****"
                        className="block w-full bg-black border-2 border-zinc-700 px-4 py-3 text-4xl font-mono text-white text-center tracking-[1em] focus:border-yellow-400 focus:outline-none"
                        />
                    </div>
                    <p className="mt-2 text-zinc-600 font-mono text-[10px] uppercase">
                        Must be exactly 4 digits. Do not share.
                    </p>
                  </div>

                  {message && (
                    <div className={`p-3 border-l-4 ${message.includes('Error') ? 'border-red-500 bg-red-900/10 text-red-500' : 'border-green-500 bg-green-900/10 text-green-500'}`}>
                        <p className="font-mono text-xs uppercase font-bold">{message}</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black font-['Anton'] text-xl uppercase py-3 tracking-widest hover:bg-yellow-400 transition-colors border-2 border-zinc-500 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {loading ? 'Encrypting...' : 'Update Protocol'}
                  </button>
                </form>
            </div>
          </motion.div>

          {/* Placeholder for other settings */}
          <div className="space-y-6">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="group rounded-none border-2 border-zinc-700 bg-zinc-900/30 p-6 opacity-60 hover:opacity-100 transition-opacity"
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 text-zinc-500 border-2 border-zinc-700">
                        <Bell className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-['Anton'] text-xl text-zinc-400 uppercase tracking-wide">Comms Channels</h2>
                        <p className="text-zinc-600 font-mono text-xs uppercase">Notification feeds (Offline)</p>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="group rounded-none border-2 border-zinc-700 bg-zinc-900/30 p-6 opacity-60 hover:opacity-100 transition-opacity"
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 text-zinc-500 border-2 border-zinc-700">
                        <Terminal className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-['Anton'] text-xl text-zinc-400 uppercase tracking-wide">Interface Mods</h2>
                        <p className="text-zinc-600 font-mono text-xs uppercase">HUD Customization (Offline)</p>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="group rounded-none border-2 border-red-900/50 bg-red-900/10 p-6 hover:bg-red-900/20 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-900/20 text-red-500 border-2 border-red-900">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-['Anton'] text-xl text-red-500 uppercase tracking-wide">Burn Identity</h2>
                        <p className="text-red-900 font-mono text-xs uppercase">Delete Account / Wipe Data</p>
                    </div>
                </div>
            </motion.div>
          </div>
      </div>
    </div>
  )
}
