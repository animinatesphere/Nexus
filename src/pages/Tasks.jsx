
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">Tasks</h1>
          <p className="mt-1 text-sm md:text-base text-[var(--muted-foreground)]">Manage your daily todos</p>
        </div>
        <div className="flex items-center gap-3">
             {/* View Toggle */}
            <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
                <button 
                    onClick={() => setView('list')}
                    className={`rounded p-1.5 transition-colors ${view === 'list' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                >
                    <List className="h-4 w-4" />
                </button>
                <button 
                    onClick={() => setView('board')}
                    className={`rounded p-1.5 transition-colors ${view === 'board' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                >
                    <LayoutGrid className="h-4 w-4" />
                </button>
            </div>

            <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 font-medium text-[var(--primary-foreground)] hover:opacity-90 whitespace-nowrap"
            >
            <Plus className="h-4 w-4" />
            New Task
            </button>
        </div>
      </div>

      {view === 'list' && (
        <div className="flex gap-2 border-b border-[var(--border)] pb-4 shrink-0 overflow-x-auto custom-scrollbar">
            {['all', 'todo', 'in_progress', 'done'].map((f) => (
            <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f 
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                    : 'bg-[var(--accent)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                }`}
            >
                {f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
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
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-center">
          <CheckCircle2 className="h-12 w-12 text-[var(--muted-foreground)] opacity-50" />
          <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">No tasks found</h3>
          <p className="mt-1 text-[var(--muted-foreground)]">Create a new task to get started</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:shadow-sm">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
                  className={`shrink-0 h-5 w-5 rounded-full border-2 transition-colors ${
                    task.status === 'done' 
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]' 
                      : 'border-[var(--muted-foreground)] hover:border-[var(--primary)]'
                  }`}
                >
                  {task.status === 'done' && <CheckCircle2 className="h-4 w-4" />}
                </button>
                
                <div className="min-w-0 flex-1">
                  <h3 className={`truncate font-medium text-[var(--foreground)] ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Circle className="h-3 w-3 fill-current" />
                      {task.projects?.name || 'No Project'}
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

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                
                <select 
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="rounded-md border border-[var(--border)] bg-[var(--accent)] px-2 py-1 text-xs text-[var(--foreground)] focus:outline-none"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[var(--foreground)]">New Task</h2>
            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Project</label>
                <select
                  required
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)]">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)]">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
