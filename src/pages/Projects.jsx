import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Folder, FolderKanban } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { useSubscription } from '../hooks/useSubscription'
import { toast } from 'sonner'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [description, setDescription] = useState('')

  const navigate = useNavigate()
  const { isPremium, loading: subLoading } = useSubscription()
  const { playClick, playHover, playError } = useAudio()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    // ... rest of fetchProjects
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    
    // Check Project Limit for Free Users
    if (!isPremium && projects.length >= 5) {
      playError()
      toast.warning("OPERATION CAPACITY REACHED", {
        description: "Free operatives are limited to 5 schemes. Upgrade clearance?",
        action: {
          label: "UPGRADE",
          onClick: () => navigate('/upgrade')
        },
      })
      setIsModalOpen(false)
      return
    }

    playClick()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            name: newProjectName, 
            description,
            user_id: user.id 
          }
        ])
        .select()

      if (error) throw error
      setProjects([data[0], ...projects])
      setIsModalOpen(false)
      setNewProjectName('')
      setDescription('')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-zinc-800 pb-6 gap-4">
        <div>
          <h1 className="font-['Anton'] text-5xl text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            Heist Dossiers
          </h1>
          <div className="h-1 w-24 bg-yellow-400 mt-2" />
          <p className="mt-4 text-zinc-400 font-mono text-sm uppercase tracking-widest">
            Manage your active operations and schemes.
          </p>
        </div>
        <button 
          onClick={() => { playClick(); setIsModalOpen(true) }}
          onMouseEnter={playHover}
          className="group flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 font-['Anton'] text-xl uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-[4px_4px_0px_#000] border-2 border-black"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          New Scheme
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-zinc-900/50 border-2 border-zinc-800 animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-none border-4 border-dashed border-zinc-800 bg-zinc-900/20 text-center">
          <Folder className="h-20 w-20 text-zinc-700 mb-4" />
          <h3 className="font-['Anton'] text-3xl text-zinc-500 uppercase">No Active Operations</h3>
          <p className="mt-2 text-zinc-600 font-mono uppercase tracking-widest">Initialize a new scheme to begin.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
          <Link
            to={`/projects/${project.id}`}
            onClick={playClick}
            onMouseEnter={playHover}
            className="group relative block h-full bg-[#f0f0f0] text-black p-1 shadow-xl hover:scale-[1.02] hover:-rotate-1 transition-transform duration-300"
            style={{ 
                clipPath: "polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)", // Dossier folder shape
            }}
          >
            {/* Folder Tab Effect */}
            <div className="absolute top-0 right-0 w-24 h-8 bg-zinc-300 transform -skew-x-12 origin-bottom-left" />

            <div className="h-full border-2 border-zinc-400 p-6 flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]">
                
                {/* Stamp */}
                <div className="absolute top-4 right-4 border-4 border-red-600 px-2 py-1 transform rotate-12 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="font-black text-red-600 uppercase tracking-widest text-xs">TOP SECRET</span>
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-3 w-3 rounded-full bg-black" />
                        <span className="font-mono text-xs uppercase tracking-widest text-zinc-600">Case File #{project.id.slice(0, 4)}</span>
                    </div>

                    <h3 className="font-['Anton'] text-4xl uppercase leading-none mb-4 break-words group-hover:text-red-700 transition-colors">
                        {project.name}
                    </h3>
                    
                    <div className="h-px w-full bg-black/10 mb-4" />
                    
                    <p className="font-mono text-sm text-zinc-700 line-clamp-3 leading-relaxed">
                        {project.description || 'Intel on this operation is currently classified. Proceed with caution.'}
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <FolderKanban className="h-5 w-5 text-zinc-500" />
                         <span className="font-bold text-xs uppercase">Open Dossier</span>
                    </div>
                </div>
            </div>
          </Link>
          </motion.div>
        ))}
        </div>
      )}

      {/* Create Project Modal (Themed) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-zinc-900 border-2 border-white p-8 relative shadow-[20px_20px_0px_#000]"
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                <span className="font-bold text-xl">X</span>
            </button>

            <h2 className="font-['Anton'] text-3xl text-white uppercase mb-6 border-b-2 border-zinc-800 pb-2">Initialize New Scheme</h2>
            
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Operation Code Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                  placeholder="e.g. PROJECT DARK MATTER"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Intel / Objectives</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                  rows={4}
                  placeholder="Brief description of the mission parameters..."
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-8 py-3 font-black uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Launch
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
