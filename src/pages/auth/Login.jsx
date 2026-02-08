
import React from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Welcome back</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Enter your credentials to access your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full rounded-md bg-[var(--primary)] py-2 text-sm font-bold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      
      <div className="text-center text-sm">
        <span className="text-[var(--muted-foreground)]">Don't have an account? </span>
        <Link to="/register" className="font-medium text-[var(--primary)] hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  )
}
