
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <CommandMenu open={cmdOpen} setOpen={setCmdOpen} />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-background/80 px-4 backdrop-blur-md">
         <span className="text-lg font-bold tracking-tight text-white font-display">
            NEXUS <span className="text-primary">PRO</span>
         </span>
         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-muted-foreground">
             {sidebarOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Glass Sidebar - Desktop & Top Mobile Drawer */}
      <motion.aside 
        initial={false}
        animate={{ 
            width: window.innerWidth < 768 ? '100%' : (sidebarOpen ? 256 : 80),
            x: window.innerWidth < 768 && !sidebarOpen ? '-100%' : 0
        }}
        className={`fixed md:relative z-40 h-full flex-col glass-sidebar transition-all duration-300 ease-in-out md:flex ${sidebarOpen ? 'flex' : 'hidden'}`}
      >
        <div className="hidden md:flex h-16 items-center justify-between px-6 border-b border-white/5">
          {sidebarOpen ? (
            <span className="text-lg font-bold tracking-tight text-white font-display">
              NEXUS <span className="text-primary">PRO</span>
            </span>
          ) : (
             <span className="mx-auto text-xl font-bold text-primary">N</span>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Search Button */}
        <div className={`px-4 mt-6 mb-2 ${!sidebarOpen && 'md:flex md:justify-center'}`}>
            <button 
                onClick={() => { setCmdOpen(true); if(window.innerWidth < 768) setSidebarOpen(false); }}
                className={`flex items-center gap-2 rounded-md bg-white/5 border border-white/5 text-sm text-muted-foreground transition-all hover:bg-white/10 hover:text-white ${sidebarOpen ? 'w-full px-3 py-2' : 'p-2 justify-center'}`}
            >
                <Search className="h-4 w-4" />
                {sidebarOpen && (
                    <>
                        <span>Search...</span>
                        <kbd className="hidden md:inline-flex ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded border border-white/10 bg-black/20 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </>
                )}
            </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 768) setSidebarOpen(false); }}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                } ${!sidebarOpen && 'md:justify-center'}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <button 
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 ${!sidebarOpen && 'md:justify-center'}`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pt-16 md:pt-0 w-full">
        {/* Subtle Gradient Background for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />
        
        <div className="h-full w-full overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">
            <Outlet />
        </div>
      </main>
    </div>
  )
}
