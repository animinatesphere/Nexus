
import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--primary)]">Nexus Pro</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Your productivity, evolved.</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
          <Outlet />
        </div>
      </motion.div>
    </div>
  )
}
