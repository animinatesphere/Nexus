
import React, { useState, useEffect, useRef } from 'react'
import { Play, Square, Clock, History, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function TimeTracking() {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState('')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [recentEntries, setRecentEntries] = useState([])
  const [loading, setLoading] = useState(true)
  
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    fetchData()
    return () => clearInterval(timerRef.current)
  }, [])

  const fetchData = async () => {
    try {
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('id, title, projects(name)')
        .eq('status', 'in_progress') // Only show in-progress tasks for tracking
        .order('created_at', { ascending: false })

      setTasks(tasksData || [])

      const { data: entriesData } = await supabase
        .from('time_entries')
        .select(`
          *,
          tasks (
            title,
            projects (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentEntries(entriesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTimer = async () => {
    if (isTimerRunning) {
      // Stop Timer
      clearInterval(timerRef.current)
      setIsTimerRunning(false)
      
      // Save entry
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        const { data, error } = await supabase
          .from('time_entries')
          .insert([{
            task_id: selectedTask,
            user_id: user.id,
            start_time: new Date(startTimeRef.current).toISOString(),
            end_time: new Date().toISOString(),
            duration: duration
          }])
          .select(`*, tasks(title, projects(name))`)

        if (error) throw error
        setRecentEntries([data[0], ...recentEntries])
        setElapsedTime(0)
        setSelectedTask('')
      } catch (error) {
        alert(error.message)
      }

    } else {
      // Start Timer
      if (!selectedTask) {
        alert('Please select a task first')
        return
      }
      startTimeRef.current = Date.now()
      setIsTimerRunning(true)
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    }
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Time Tracking</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Track time spent on your active tasks</p>
      </div>

      {/* Timer Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-[var(--foreground)]">Select Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              disabled={isTimerRunning}
              className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
            >
              <option value="">Choose a task...</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.projects?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center">
            <div className={`text-6xl font-mono font-bold tracking-wider ${isTimerRunning ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
              {formatTime(elapsedTime)}
            </div>
            {isTimerRunning && <p className="mt-2 text-sm text-[var(--primary)] animate-pulse">Tracking...</p>}
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={toggleTimer}
              className={`flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-bold transition-all md:w-auto ${
                isTimerRunning 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20' 
                  : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 shadow-lg shadow-indigo-500/20'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Square className="h-5 w-5 fill-current" />
                  Stop Timer
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  Start Timer
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Entries */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <History className="h-5 w-5 text-[var(--muted-foreground)]" />
          Recent Activity
        </h2>
        
        {loading ? (
          <div className="text-center text-[var(--muted-foreground)]">Loading history...</div>
        ) : recentEntries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
            No time entries recorded yet.
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-[var(--accent)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                {recentEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[var(--accent)]/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[var(--foreground)]">
                      {entry.tasks?.title || 'Unknown Task'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--muted-foreground)]">
                      {entry.tasks?.projects?.name || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.start_time).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-mono text-[var(--foreground)]">
                      {formatTime(entry.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
