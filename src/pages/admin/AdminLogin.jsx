import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, Key, ShieldAlert } from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function AdminLogin() {
  const [email, setEmail] = useState('adeyemipelumi2008@gmail.com')
  const [password, setPassword] = useState('pamilerin')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate network delay for realism
    setTimeout(() => {
        if (email === 'adeyemipelumi2008@gmail.com' && password === 'pamilerin') {
            // SUCCESS
            localStorage.setItem('nexus_admin_session', 'true')
            toast.success('Clearance Granted. Welcome, Overseer.', {
                style: { background: '#000', color: '#22c55e', border: '1px solid #22c55e' }
            })
            navigate('/admin')
        } else {
            // FAILURE
            toast.error('ACCESS DENIED. INCORRECT CREDENTIALS.', {
                style: { background: '#000', color: '#ef4444', border: '1px solid #ef4444' }
            })
        }
        setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 relative overflow-hidden font-sans">
      <Toaster position="top-center" theme="dark" />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center group">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center border-4 border-red-600 bg-black shadow-[10px_10px_0px_#7f1d1d] transform transition-transform group-hover:scale-110">
                <ShieldAlert className="h-12 w-12 text-red-600 animate-pulse" />
            </div>
            <h2 className="font-['Anton'] text-5xl text-white uppercase tracking-widest drop-shadow-[5px_5px_0px_#000]">
                Restricted<br/><span className="text-red-600">Area</span>
            </h2>
            <p className="mt-4 text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">
                Level 10 Clearance Required
            </p>
        </div>

        {/* Card */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-zinc-800 bg-black/80 p-8 shadow-[20px_20px_0px_#000] backdrop-blur-sm relative"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600" />

          <form onSubmit={handleAuth} className="space-y-6 mt-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
                Operative ID
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-zinc-600" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-black border-2 border-zinc-700 py-4 pl-12 text-white font-mono placeholder-zinc-800 focus:border-red-600 focus:outline-none transition-all uppercase"
                  placeholder="ID-XXXX-XXXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
                Access Key
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Key className="h-5 w-5 text-zinc-600" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full bg-black border-2 border-zinc-700 py-4 pl-12 text-white font-mono placeholder-zinc-800 focus:border-red-600 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 bg-red-600 px-4 py-4 text-xl font-['Anton'] uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black border-2 border-transparent hover:border-black disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                  <>
                    Authenticate
                    <Lock className="h-5 w-5 group-hover:unlock transition-all" />
                  </>
              )}
            </button>
          </form>
        </motion.div>
        
        <div className="text-center">
            <p className="text-[10px] text-zinc-700 font-mono uppercase">
                Unauthorized access attempts will be logged and prosecuted.<br/>System ID: NX-884-ADMIN
            </p>
        </div>
      </div>
    </div>
  )
}
