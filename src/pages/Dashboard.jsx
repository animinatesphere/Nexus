
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  ArrowRight 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Skeleton from '../components/ui/Skeleton'

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
    todayTime: '0h 0m'
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Parallel fetching for speed
        const [projects, tasks, time] = await Promise.all([
             supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
             supabase.from('tasks').select('*').eq('user_id', user.id),
             supabase.from('time_entries').select('*').eq('user_id', user.id).gte('start_time', new Date(new Date().setHours(0,0,0,0)).toISOString()).is('end_time', null) // Mock query for today
        ])

        console.log('Dashboard Data:', { projects, tasks, time })

        const totalTasks = tasks.data?.length || 0
        const completedTasks = tasks.data?.filter(t => t.status === 'done')?.length || 0
        const pendingTasks = totalTasks - completedTasks
        
        console.log('Calculated Stats:', { totalTasks, completedTasks, pendingTasks })

        setStats({
          projects: projects.count || 0,
          tasks: totalTasks,
          completedTasks: completedTasks,
          todayTime: '2h 15m' // Mocked real-time calc for demo
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
             </div>
          ) : (
            <>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-display"
                >
                    Welcome back, {user?.email?.split('@')[0] || 'User'}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm md:text-base text-muted-foreground"
                >
                    Here's what's happening with your projects today.
                </motion.p>
            </>
          )}
        </div>
        <Link 
            to="/projects" 
            className="inline-flex w-full md:w-auto justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" /> New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard 
            title="Active Projects" 
            value={stats.projects} 
            loading={loading}
            icon={Briefcase} 
            color="text-blue-500" 
            delay={0}
        />
        <StatCard 
            title="Pending Tasks" 
            value={stats.tasks - stats.completedTasks} 
            loading={loading}
            icon={CheckCircle2} 
            color="text-yellow-500" 
            delay={0.1}
        />
        <StatCard 
            title="Tasks Completed" 
            value={stats.completedTasks} 
            loading={loading}
            icon={TrendingUp} 
            color="text-green-500" 
            delay={0.2}
        />
        <StatCard 
            title="Time Tracked Today" 
            value={stats.todayTime} 
            loading={loading}
            icon={Clock} 
            color="text-purple-500" 
            delay={0.3}
        />
      </motion.div>

      {/* Recent Activity / Quick Actions Placeholder */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
         <div className="glass-panel rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Quick Tasks</h3>
                <Link to="/tasks" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                    View All <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Mock Items for Visual Demo */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:border-white/10 hover:bg-white/10">
                            <div className="h-5 w-5 rounded border border-zinc-600 group-hover:border-primary" />
                            <span className="text-sm text-zinc-300">Update the landing page design</span>
                            <span className="ml-auto text-xs text-zinc-500">Project Alpha</span>
                        </div>
                    ))}
                </div>
            )}
         </div>

         <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-zinc-400 mb-6">Unlock unlimited projects, AI insights, and team collaboration features.</p>
                <button className="w-full rounded-lg bg-gradient-to-r from-primary to-purple-600 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-opacity hover:opacity-90">
                    Upgrade Plan
                </button>
            </div>
            {/* Decorative Background */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
         </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, loading, delay }) {
    if (loading) {
        return <Skeleton className="h-32 w-full rounded-xl" />
    }

    return (
        <div 
            className="group relative overflow-hidden rounded-xl border border-white/5 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</h3>
                </div>
                <div className={`rounded-xl bg-white/5 p-3 transition-colors group-hover:bg-white/10`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
            </div>
        </div>
    )
}
