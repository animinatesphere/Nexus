
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, Key, UserPlus, LogIn, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Toaster, toast } from 'sonner'

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('adeyemipelumi2008@gmail.com')
  const [password, setPassword] = useState('pamilerin')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showReset, setShowReset] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate network delay for realism
    setTimeout(() => {
        if (email === 'adeyemipelumi2008@gmail.com' && password === 'pamilerin') {
            // SUCCESS
            localStorage.setItem('nexus_admin_session', 'true')
            toast.success('Welcome back, Admin!')
            navigate('/admin')
        } else {
            // FAILURE
            toast.error('Invalid Credentials')
        }
        setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
      <Toaster position="top-center" theme="dark" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 shadow-2xl shadow-red-900/50">
                <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-display">
                Nexus <span className="text-red-500">Admin</span>
            </h2>
            <p className="text-zinc-500">
                Secure access for platform administrators
            </p>
        </div>

        {/* Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-zinc-600" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 text-zinc-200 placeholder-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:text-sm transition-all"
                  placeholder="admin@nexus.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Key className="h-5 w-5 text-zinc-600" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 text-zinc-200 placeholder-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* SQL Hint Box */}
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                 <p className="text-xs text-zinc-500 mb-2 font-medium">To grant admin access (Run in Supabase SQL):</p>
                 <code className="block text-[10px] text-zinc-400 font-mono bg-black/50 p-2 rounded select-all">
                    update public.profiles set is_admin = true <br/> 
                    where id in (select id from auth.users where email = '{email || 'EMAIL'}');
                 </code>
            </div>

            {/* Password Reset Helper - Only Shows on Error */}
            {showReset && (
                <div className="rounded-lg border border-red-500/20 bg-red-900/10 p-4 animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <p className="text-xs font-bold text-red-500">Cannot Login? Reset User:</p>
                    </div>
                    <code className="block text-[10px] text-red-200 font-mono bg-black/50 p-2 rounded select-all">
                        -- Run this to DELETE the user so you can recreate it:<br/>
                        delete from auth.users where email = '{email}';
                    </code>
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 disabled:opacity-50"
            >
              {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                  <>Sign In <LogIn className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
