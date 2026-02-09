
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { UserPlus, ArrowRight, ShieldAlert } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/app',
        },
      })

      if (error) throw error
      setMsg('Identity Record Created. Verify via secure comms (email).')
    } catch (error) {
      setMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur-md border-2 border-zinc-700 p-8 shadow-[10px_10px_0px_#FFF]"
      >
      
      <div className="text-center text-sm">
        <span className="text-[var(--muted-foreground)]">Already have an account? </span>
        <Link to="/login" className="font-medium text-[var(--primary)] hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}
