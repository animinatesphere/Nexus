import React, { useState, useEffect } from 'react'
import { Plus, Folder, MoreVertical, Calendar, FolderKanban, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Projects</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Manage and track your ongoing projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-center">
          <Folder className="h-12 w-12 text-[var(--muted-foreground)] opacity-50" />
          <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">No projects yet</h3>
          <p className="mt-1 text-[var(--muted-foreground)]">Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
          <Link
            to={`/projects/${project.id}`}
            className="group relative block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5"
          >
            <div className="flex items-center justify-between">
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${project.color}20` }}
              >
                <FolderKanban className="h-5 w-5" style={{ color: project.color }} />
              </div>
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-full p-2 hover:bg-[var(--accent)]">
                   <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{project.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
              <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                Active
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {/* Hover Gradient Overlay */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at top right, ${project.color}10, transparent 70%)` }}
            />
          </Link>
          </motion.div>
        ))}
        {projects.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-[var(--border)] rounded-xl">
                 <p className="text-[var(--muted-foreground)]">No projects found. Create one to get started!</p>
            </div>
        )}
      </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-bold text-[var(--primary-foreground)] hover:opacity-90"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
