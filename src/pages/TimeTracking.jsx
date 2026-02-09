
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
    <div className="space-y-8 h-full">
      <div className="border-b-2 border-zinc-800 pb-6">
        <h1 className="font-['Anton'] text-5xl text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_#000]">
          Heist Timer
        </h1>
        <p className="mt-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Operation Duration // Alibi Generator
        </p>
      </div>

      {/* Timer Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-none border-2 border-zinc-700 bg-black/80 p-8 shadow-[10px_10px_0px_#000] relative overflow-hidden"
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.5)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="w-full md:w-1/3 space-y-2">
            <label className="block text-xs font-bold text-yellow-400 uppercase tracking-widest">Active Contract</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              disabled={isTimerRunning}
              className="w-full bg-zinc-900 border-2 border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none uppercase"
            >
              <option value="">Select Target...</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} // {t.projects?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center">
            <div className={`text-7xl font-mono font-black tracking-widest tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${isTimerRunning ? 'text-red-500 animate-pulse' : 'text-zinc-600'}`}>
              {formatTime(elapsedTime)}
            </div>
            {isTimerRunning && (
                <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    <p className="text-xs text-red-500 font-mono uppercase tracking-widest">Recording Evidence...</p>
                </div>
            )}
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={toggleTimer}
              className={`flex w-full items-center justify-center gap-3 px-8 py-4 text-xl font-['Anton'] uppercase tracking-widest transition-all clip-path-slant md:w-auto border-2 ${
                isTimerRunning 
                  ? 'bg-red-600 text-white border-red-800 hover:bg-black hover:text-red-500' 
                  : 'bg-yellow-400 text-black border-yellow-600 hover:bg-white hover:border-white'
              }`}
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
            >
              {isTimerRunning ? (
                <>
                  <Square className="h-5 w-5 fill-current" />
                  Abort / Save
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  Execute
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Entries */}
      <div className="space-y-6">
        <h2 className="flex items-center gap-3 text-2xl font-['Anton'] text-white uppercase tracking-wide">
          <History className="h-6 w-6 text-yellow-400" />
          Time Sheet Logs
        </h2>
        
        {loading ? (
          <div className="text-center text-zinc-500 font-mono uppercase animate-pulse">Decrypting Logs...</div>
        ) : recentEntries.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-800 p-8 text-center bg-zinc-900/50">
            <p className="text-zinc-600 font-mono uppercase">No alibis recorded yet.</p>
          </div>
        ) : (
          <div className="border border-zinc-800 bg-black">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-widest">Operation</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-widest">Scheme</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-yellow-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-yellow-400 uppercase tracking-widest">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-black">
                {recentEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-900/50 transition-colors group">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-white uppercase group-hover:text-yellow-400 transition-colors">
                      {entry.tasks?.title || 'Unknown Op'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-zinc-500 uppercase">
                      {entry.tasks?.projects?.name || 'Freelance'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.start_time).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-mono text-white">
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
