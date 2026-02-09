
import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, Calendar, LayoutGrid, List } from 'lucide-react'
import { supabase } from '../lib/supabase'
import KanbanBoard from '../components/kanban/KanbanBoard'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, todo, in_progress, done
  const [view, setView] = useState('list') // 'list' | 'board'
  const [refreshKey, setRefreshKey] = useState(0) // Forces Kanban refresh

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch Projects for the dropdown
      const { data: projectsData } = await supabase
        .from('projects')
        .select('id, name')
        .order('name')
      
      setProjects(projectsData || [])

      // Fetch Tasks
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (name)
        `)
        .order('due_date', { ascending: true })

      if (error) throw error
      setTasks(tasksData || [])
    } catch (error) {
      console.error('Error fetching data:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { 
            title: newTaskTitle,
            project_id: selectedProject,
            priority,
            due_date: dueDate || null,
            user_id: user.id,
            status: 'todo'
          }
        ])
        .select(`*, projects(name)`)

      if (error) throw error
      setTasks([data[0], ...tasks])
      setRefreshKey(prev => prev + 1) // Force Kanban refresh
      setIsModalOpen(false)
      // Reset form
      setNewTaskTitle('')
      setSelectedProject('')
      setPriority('medium')
      setDueDate('')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error
      
      // Optimistic update
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const getPriorityColor = (p) => {
    switch(p) {
      case 'high': return 'text-red-500 bg-red-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'low': return 'text-blue-500 bg-blue-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0 border-b-2 border-zinc-800 pb-4">
        <div>
          <h1 className="font-['Anton'] text-4xl text-white uppercase tracking-wider drop-shadow-[2px_2px_0px_#000]">
            Mission List
          </h1>
          <p className="mt-1 text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Current Objectives // Active Contracts
          </p>
        </div>
        <div className="flex items-center gap-3">
             {/* View Toggle */}
            <div className="flex items-center border-2 border-zinc-800 bg-black p-1">
                <button 
                    onClick={() => setView('list')}
                    className={`p-2 transition-all ${view === 'list' ? 'bg-yellow-400 text-black' : 'text-zinc-600 hover:text-white'}`}
                >
                    <List className="h-4 w-4" />
                </button>
                <div className="w-px h-4 bg-zinc-800 mx-1" />
                <button 
                    onClick={() => setView('board')}
                    className={`p-2 transition-all ${view === 'board' ? 'bg-yellow-400 text-black' : 'text-zinc-600 hover:text-white'}`}
                >
                    <LayoutGrid className="h-4 w-4" />
                </button>
            </div>

            <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 font-['Anton'] uppercase tracking-wider hover:bg-white transition-colors border-2 border-black shadow-[2px_2px_0px_#000]"
            >
            <Plus className="h-4 w-4" />
            Add Contract
            </button>
        </div>
      </div>

      {view === 'list' && (
        <div className="flex gap-2 border-b-2 border-zinc-800 pb-4 shrink-0 overflow-x-auto custom-scrollbar">
            {['all', 'todo', 'in_progress', 'done'].map((f) => (
            <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1 font-bold text-xs uppercase tracking-widest transition-all clip-path-slant ${
                filter === f 
                    ? 'bg-white text-black' 
                    : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
            >
                {f.replace('_', ' ').toUpperCase()}
            </button>
            ))}
        </div>
      )}

      {view === 'board' ? (
          <div className="flex-1 overflow-hidden -mx-6">
              <KanbanBoard key={refreshKey} />
          </div>
      ) : (
          /* List View Content */
          null 
      )}

      {view === 'list' && (
      loading ? (
        <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-16 bg-zinc-900 animate-pulse border-b border-zinc-800" />)}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-900/20 text-center">
          <AlertCircle className="h-12 w-12 text-zinc-700 mb-4" />
          <h3 className="font-['Anton'] text-2xl text-zinc-500 uppercase">No Active Contracts</h3>
          <p className="mt-1 text-zinc-600 font-mono text-xs uppercase">Your schedule is clear. Enjoy the R&R.</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto custom-scrollbar pb-20 md:pb-0 pr-2">
          {filteredTasks.map((task) => (
            <div key={task.id} className="group flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-l-4 border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:bg-zinc-900 hover:border-yellow-400 hover:pl-5">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
                  className={`shrink-0 h-6 w-6 border-2 transition-all flex items-center justify-center ${
                    task.status === 'done' 
                      ? 'border-green-500 bg-green-500/20 text-green-500' 
                      : 'border-zinc-600 hover:border-yellow-400 text-transparent hover:text-yellow-400'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
                
                <div className="min-w-0 flex-1">
                  <h3 className={`truncate font-bold uppercase tracking-wide text-lg text-white ${task.status === 'done' ? 'line-through opacity-50 decoration-2 decoration-green-500' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 uppercase">
                    <span className="flex items-center gap-1 text-yellow-400/80">
                      <Circle className="h-2 w-2 fill-current" />
                      {task.projects?.name || 'Freelance'}
                    </span>
                    {task.due_date && (
                      <span className={`flex items-center gap-1 ${
                        new Date(task.due_date) < new Date() ? 'text-red-500' : ''
                      }`}>
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 md:justify-end">
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border ${
                    task.priority === 'high' ? 'border-red-500 text-red-500 bg-red-500/10' :
                    task.priority === 'medium' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                    'border-blue-500 text-blue-500 bg-blue-500/10'
                }`}>
                  {task.priority} INTEL
                </span>
                
                <select 
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="bg-black border border-zinc-700 text-zinc-400 text-xs font-mono uppercase px-2 py-1 focus:outline-none focus:border-yellow-400"
                >
                  <option value="todo">Pending</option>
                  <option value="in_progress">Active</option>
                  <option value="done">Complete</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border-2 border-white p-6 shadow-[15px_15px_0px_#000]">
            <h2 className="font-['Anton'] text-2xl text-white uppercase mb-6 border-b-2 border-zinc-800 pb-2">New Contract</h2>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Objective</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                  placeholder="Eliminate the target..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Operation (Project)</label>
                <select
                  required
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Select Operation...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Intel Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Value Target</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Deadline</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-6 py-2 font-black uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Accept Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
