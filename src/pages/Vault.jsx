
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">The Vault</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Secure storage for your private files</p>
        </div>
        {!isLocked && (
          <button 
            onClick={handleLock}
            className="flex items-center gap-2 rounded-md bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20"
          >
            <Lock className="h-4 w-4" />
            Lock Vault
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-lg"
          >
            <div className="mb-6 rounded-full bg-[var(--primary)]/10 p-6">
              <Shield className="h-12 w-12 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Vault Locked</h2>
            <p className="mb-8 mt-2 text-[var(--muted-foreground)]">
               {savedPin === '1234' ? 'Enter default PIN: 1234' : 'Enter your secure PIN'}
            </p>
            
            <form onSubmit={handleUnlock} className="flex flex-col items-center gap-4">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN"
                className="w-32 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center text-2xl font-bold tracking-widest text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-32 rounded-lg bg-[var(--primary)] px-6 py-3 font-bold text-[var(--primary-foreground)] hover:opacity-90"
              >
                Unlock
              </button>
            </form>
            <p className="mt-4 text-xs text-[var(--muted-foreground)]">You can change your PIN in Settings</p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Upload Area */}
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-8 text-center transition-colors hover:border-[var(--primary)]">
              <Upload className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">Drag & drop files here or click to upload</p>
            </div>

            {/* File Web */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {items.length > 0 ? items.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:shadow-md">
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    {item.type === 'image' ? (
                      <ImageIcon className="h-8 w-8 text-purple-500" />
                    ) : (
                      <File className="h-8 w-8 text-blue-500" />
                    )}
                    <span className="text-center text-sm font-medium text-[var(--foreground)] truncate w-full">{item.name}</span>
                  </div>
                </div>
              )) : (
                 <div className="col-span-full py-8 text-center text-[var(--muted-foreground)]">
                    No files yet. Upload something secure!
                 </div>
              )}
              
              {/* Add New Placeholder */}
              <button className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--accent)]/50 text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]">
                <Plus className="h-6 w-6" />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
