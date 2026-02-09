import React, { useEffect } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  DollarSign, 
  Lock, 
  Gamepad2, 
  Settings, 
  RefreshCcw,
  Search,
  Terminal
} from 'lucide-react'

export default function CommandMenu({ open, setOpen }) {
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/90 backdrop-blur-md p-4" 
      onClick={() => setOpen(false)}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-2xl bg-zinc-900 border-2 border-zinc-700 shadow-[20px_20px_0px_#000] overflow-hidden"
      >
        <Command label="Intel Database" className="w-full">
          <div className="flex items-center gap-3 border-b-2 border-zinc-800 p-6 bg-black">
            <Search className="h-6 w-6 text-yellow-400" />
            <Command.Input 
              placeholder="Query Intel Database..." 
              className="w-full bg-transparent border-none text-xl font-mono text-white placeholder-zinc-700 focus:ring-0 uppercase tracking-widest"
            />
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono">
              ESC TO ABORT
            </div>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar bg-zinc-950/50">
            <Command.Empty className="p-12 text-center">
                <Terminal className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">No matching intel records found.</p>
            </Command.Empty>

            <Command.Group 
                heading={<span className="px-3 py-2 text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] block mb-2 border-l-4 border-yellow-400 bg-yellow-400/5">Navigation Protocols</span>}
                className="mb-8"
            >
              <div className="grid gap-2">
                <NavItem icon={LayoutDashboard} label="Strategic Map // Dashboard" onSelect={() => runCommand(() => navigate('/app'))} />
                <NavItem icon={FolderKanban} label="Heist Dossiers // Projects" onSelect={() => runCommand(() => navigate('/projects'))} />
                <NavItem icon={CheckSquare} label="Mission Board // Tasks" onSelect={() => runCommand(() => navigate('/tasks'))} />
                <NavItem icon={DollarSign} label="Laundering Ops // Finance" onSelect={() => runCommand(() => navigate('/finance'))} />
                <NavItem icon={Lock} label="Secure Lockbox // Vault" onSelect={() => runCommand(() => navigate('/vault'))} />
                <NavItem icon={Gamepad2} label="Safehouse Lounge // Arcade" onSelect={() => runCommand(() => navigate('/break-room'))} />
                <NavItem icon={Settings} label="System Config // Settings" onSelect={() => runCommand(() => navigate('/settings'))} />
              </div>
            </Command.Group>

            <Command.Group 
                heading={<span className="px-3 py-2 text-[10px] font-black text-red-500 uppercase tracking-[0.3em] block mb-2 border-l-4 border-red-500 bg-red-500/5">Maintenance</span>}
            >
              <NavItem icon={RefreshCcw} label="Re-Initialize HUD // Refresh" onSelect={() => runCommand(() => window.location.reload())} />
            </Command.Group>
          </Command.List>

          <div className="bg-black border-t-2 border-zinc-800 p-3 flex justify-between items-center px-6">
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">System Online</span>
                </div>
             </div>
             <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Nexus DB v2.0</p>
          </div>
        </Command>
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, onSelect }) {
    return (
        <Command.Item 
            onSelect={onSelect}
            className="flex items-center gap-4 p-4 cursor-pointer font-['Anton'] text-lg text-zinc-500 uppercase tracking-wide hover:bg-white hover:text-black hover:scale-[1.01] transition-all aria-selected:bg-white aria-selected:text-black"
        >
            <div className="flex items-center justify-center w-10 h-10 border border-zinc-800 bg-black group-aria-selected:border-black">
                <Icon className="h-5 w-5" />
            </div>
            <span>{label}</span>
        </Command.Item>
    )
}
