
import React, { useEffect, useState } from 'react'
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
  LogOut,
  Moon,
  Sun
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg shadow-2xl">
        <Command label="Command Menu" className="commands">
            <Command.Input placeholder="Type a command or search..." />
            <Command.List>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading="Navigation">
                    <Command.Item onSelect={() => runCommand(() => navigate('/app'))}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => navigate('/projects'))}>
                        <FolderKanban className="h-4 w-4" /> Projects
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => navigate('/tasks'))}>
                        <CheckSquare className="h-4 w-4" /> Tasks
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => navigate('/finance'))}>
                        <DollarSign className="h-4 w-4" /> Finance
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => navigate('/vault'))}>
                        <Lock className="h-4 w-4" /> Vault
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => navigate('/break-room'))}>
                        <Gamepad2 className="h-4 w-4" /> Break Room
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => navigate('/settings'))}>
                        <Settings className="h-4 w-4" /> Settings
                    </Command.Item>
                </Command.Group>

                <Command.Group heading="System">
                    <Command.Item onSelect={() => runCommand(() => window.location.reload())}>
                        <Sun className="h-4 w-4" /> Refresh App
                    </Command.Item>
                </Command.Group>
            </Command.List>
        </Command>
      </div>
    </div>
  )
}
