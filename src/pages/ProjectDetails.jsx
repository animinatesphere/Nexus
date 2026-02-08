
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Calendar, CheckCircle2, Clock, MoreVertical, Plus } from 'lucide-react'
import Skeleton from '../components/ui/Skeleton'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      // Fetch Project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      
      if (projectError) throw projectError
      setProject(projectData)

      // Fetch Tasks for this project
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })

      if (tasksError) throw tasksError
      setTasks(tasksData || [])

    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-8 w-64" />
              </div>
              <Skeleton className="h-64 w-full rounded-xl" />
          </div>
      )
  }

  if (!project) return <div className="p-8 text-center">Project not found</div>

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
            onClick={() => navigate('/projects')}
            className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
            <h1 className="text-3xl font-bold font-display">{project.name}</h1>
            <p className="text-muted-foreground">{project.description || 'No description provided.'}</p>
        </div>
        <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90">
                <Plus className="h-4 w-4" /> Add Task
            </button>
        </div>
      </div>

      {/* Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/5 bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Tasks</h3>
              <p className="text-3xl font-bold mt-2">{tasks.length}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-500">{tasks.filter(t => t.status !== 'done').length}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
              <p className="text-3xl font-bold mt-2 text-green-500">{tasks.filter(t => t.status === 'done').length}</p>
          </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
          <h2 className="text-xl font-bold font-display">Tasks</h2>
          {tasks.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed border-white/10">
                  <p className="text-muted-foreground">No tasks in this project yet.</p>
              </div>
          ) : (
              tasks.map(task => (
                  <div key={task.id} className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-card hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                          <button className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-primary'}`}>
                              {task.status === 'done' && <CheckCircle2 className="h-3 w-3 text-black" />}
                          </button>
                          <span className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {task.due_date && (
                              <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                              </div>
                          )}
                          <div className={`px-2 py-0.5 rounded textxs capitalize ${
                              task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                              task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                              'bg-blue-500/10 text-blue-500'
                          }`}>
                              {task.priority}
                          </div>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  )
}
