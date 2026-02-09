
import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  Lock,
  Gamepad2,
  Settings,
  Search
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import CommandMenu from '../ui/CommandMenu'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cmdOpen, setCmdOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Clock, label: 'Time Tracking', path: '/time-tracking' },
    { icon: CreditCard, label: 'Finance', path: '/finance' },
    { icon: Lock, label: 'Vault', path: '/vault' },
    { icon: Gamepad2, label: 'Break Room', path: '/break-room' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-yellow-400 selection:text-black">
      <CommandMenu open={cmdOpen} setOpen={setCmdOpen} />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b-2 border-zinc-800 bg-black/90 px-4 backdrop-blur-md">
         <span className="text-xl font-['Anton'] tracking-wider text-white uppercase">
            Nexus <span className="text-yellow-400">Pro</span>
         </span>
         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white hover:text-yellow-400">
             {sidebarOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* GTA Style Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
            width: window.innerWidth < 768 ? '100%' : (sidebarOpen ? 280 : 80), // Slightly wider
            x: window.innerWidth < 768 && !sidebarOpen ? '-100%' : 0
        }}
        className={`fixed md:relative z-40 h-full flex-col bg-zinc-950 border-r-2 border-zinc-800 transition-all duration-300 ease-in-out md:flex ${sidebarOpen ? 'flex' : 'hidden'}`}
      >
        <div className="hidden md:flex h-20 items-center justify-between px-6 border-b-2 border-zinc-800 bg-black">
          {sidebarOpen ? (
            <span className="text-2xl font-['Anton'] tracking-widest text-white uppercase drop-shadow-[2px_2px_0px_rgba(250,204,21,1)]">
              NEXUS <span className="text-yellow-400">PRO</span>
            </span>
          ) : (
             <span className="mx-auto text-2xl font-black text-yellow-500 bg-zinc-900 h-10 w-10 flex items-center justify-center border border-yellow-500/50">N</span>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-zinc-500 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Quick Search Button */}
        <div className={`px-4 mt-8 mb-4 ${!sidebarOpen && 'md:flex md:justify-center'}`}>
            <button 
                onClick={() => { setCmdOpen(true); if(window.innerWidth < 768) setSidebarOpen(false); }}
                className={`flex items-center gap-3 rounded-none bg-zinc-900 border border-zinc-700 text-sm text-zinc-400 transition-all hover:border-yellow-400 hover:text-yellow-400 group ${sidebarOpen ? 'w-full px-4 py-3' : 'p-3 justify-center'}`}
            >
                <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {sidebarOpen && (
                    <>
                        <span className="uppercase font-bold tracking-wider text-xs">Search Intel...</span>
                        <kbd className="hidden md:inline-flex ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded bg-black border border-zinc-700 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </>
                )}
            </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 768) setSidebarOpen(false); }}
                className={`group flex items-center gap-4 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 border-l-4 ${
                  isActive 
                    ? 'border-yellow-400 bg-white/5 text-white' 
                    : 'border-transparent text-zinc-500 hover:bg-white/5 hover:text-white hover:border-zinc-500'
                } ${!sidebarOpen && 'md:justify-center px-2 py-3 border-l-0 border-b-2'}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-yellow-400' : 'text-zinc-600 group-hover:text-white'} transition-colors`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t-2 border-zinc-800 p-6 bg-black">
          <button 
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-950/30 hover:text-red-500 border border-transparent hover:border-red-900 ${!sidebarOpen && 'md:justify-center px-0'}`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Bail Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pt-16 md:pt-0 w-full bg-black">
        {/* Gritty Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0" />
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] pointer-events-none z-0" />
        
        <div className="h-full w-full overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">
            <Outlet />
        </div>
      </main>
    </div>
  )
}
