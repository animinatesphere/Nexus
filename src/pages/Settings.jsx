
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Lock, User, Bell } from 'lucide-react'
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
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Manage your preferences and security</p>
      </div>

      {/* Vault Security Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6">
          <div className="rounded-full bg-blue-500/10 p-3">
            <Lock className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Vault Security</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Set a 4-digit PIN to secure your private vault</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Vault PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4 digits"
              className="mt-1 block w-48 rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-2xl font-bold tracking-widest text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-bold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save PIN'}
          </button>
        </form>
      </motion.div>

      {/* Placeholder for other settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm opacity-50 pointer-events-none"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-purple-500/10 p-3">
            <Bell className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Notifications (Coming Soon)</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Manage email and push notifications</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
