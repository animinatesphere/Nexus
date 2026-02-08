
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function LoginOtp() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email | otp
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Also handles signup
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
    <div className="w-full">
      <AnimatePresence mode='wait'>
        {step === 'email' ? (
          <motion.div
            key="email-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Welcome to Nexus Pro</h2>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">Enter your email to sign in or create an account</p>
              </div>

              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="block w-full rounded-lg border border-[var(--border)] bg-[var(--input)] py-2.5 pl-10 pr-3 text-[var(--foreground)] shadow-sm transition-colors focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] py-2.5 text-sm font-bold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    Continue with Email
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <Mail className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Check your inbox</h2>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  We've sent a 6-digit code to <span className="font-medium text-[var(--foreground)]">{email}</span>
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">One-Time Password</label>
                <input 
                  type="text" 
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2.5 text-center text-lg font-bold tracking-widest text-[var(--foreground)] shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] py-2.5 text-sm font-bold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & Sign In'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Entered wrong email?
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
