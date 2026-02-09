
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
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-2 border-zinc-800 pb-6">
        <div>
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-64 bg-zinc-800" />
                <Skeleton className="h-4 w-48 bg-zinc-800" />
             </div>
          ) : (
            <>
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-6xl font-['Anton'] tracking-tight text-white uppercase drop-shadow-[2px_2px_0px_#000]"
                >
                    Safehouse <span className="text-zinc-600">/</span> {user?.email?.split('@')[0] || 'Admin'}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-base text-zinc-400 font-medium uppercase tracking-widest"
                >
                    System Status: <span className="text-green-500">Online</span> // Heat Level: <span className="text-blue-500">Low</span>
                </motion.p>
            </>
          )}
        </div>
        <Link 
            to="/projects" 
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-3 font-['Anton'] text-lg uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-[4px_4px_0px_#000]"
        >
          <Plus className="h-5 w-5" /> New Operation
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
            title="Active Operations" 
            value={stats.projects} 
            loading={loading}
            icon={Briefcase} 
            color="text-blue-500" 
            delay={0}
        />
        <StatCard 
            title="Pending Missions" 
            value={stats.tasks - stats.completedTasks} 
            loading={loading}
            icon={CheckCircle2} 
            color="text-yellow-500" 
            delay={0.1}
        />
        <StatCard 
            title="Success Rate" 
            value={stats.completedTasks} 
            loading={loading}
            icon={TrendingUp} 
            color="text-green-500" 
            delay={0.2}
        />
        <StatCard 
            title="Time Clocked" 
            value={stats.todayTime} 
            loading={loading}
            icon={Clock} 
            color="text-purple-500" 
            delay={0.3}
        />
      </motion.div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
         {/* Quick Tasks Panel */}
         <div className="bg-zinc-900/50 border-2 border-zinc-800 p-8 lg:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="h-32 w-32 border-4 border-white transform rotate-45" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="font-['Anton'] text-2xl text-white uppercase tracking-wider">
                    <span className="text-yellow-400 mr-2">///</span> 
                    Active Missions
                </h3>
                <Link to="/tasks" className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 hover:gap-3 transition-all">
                    View Dossier <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-14 w-full bg-zinc-800" />
                    <Skeleton className="h-14 w-full bg-zinc-800" />
                    <Skeleton className="h-14 w-full bg-zinc-800" />
                </div>
            ) : (
                <div className="space-y-3 relative z-10">
                    {/* Mock Items for Visual Demo */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group flex items-center gap-4 border border-zinc-800 bg-black/50 p-4 transition-all hover:border-yellow-400 hover:translate-x-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                            <div className="h-3 w-3 bg-zinc-700 transform rotate-45 group-hover:bg-yellow-400 transition-colors" />
                            <span className="text-base font-medium text-zinc-300 group-hover:text-white">Secure the payload from the Drop Zone</span>
                            <span className="ml-auto text-xs font-bold uppercase tracking-widest text-zinc-600 bg-zinc-900 px-2 py-1 rounded">Project Alpha</span>
                        </div>
                    ))}
                </div>
            )}
         </div>

         {/* Promo / Upgrade Panel */}
         <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 relative overflow-hidden text-black shadow-lg">
            <div className="relative z-10">
                <h3 className="font-['Anton'] text-3xl mb-2 uppercase drop-shadow-sm">Upgrade License</h3>
                <div className="h-1 w-20 bg-black mb-6" />
                <p className="font-bold mb-8 text-black/80 leading-relaxed uppercase tracking-tight">Unlock the full arsenal. Unlimited projects, AI tactical support, and crew management tools.</p>
                <button className="w-full bg-black text-white py-4 font-['Anton'] text-xl uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl border-2 border-transparent hover:border-black">
                    Purchase Pro
                </button>
            </div>
            {/* Decorative Background */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 border-[20px] border-black/10 rounded-full" />
            <div className="absolute top-10 right-10 w-24 h-24 bg-black/5 rotate-12" />
         </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, loading }) {
    if (loading) {
        return <Skeleton className="h-40 w-full bg-zinc-800" />
    }

    return (
        <div 
            className="group relative overflow-hidden bg-zinc-900 border-2 border-zinc-800 p-6 transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000] hover:border-white hover:z-10"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Icon className={`h-16 w-16 ${color} transform rotate-12`} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`h-2 w-2 rounded-full ${color.replace('text-', 'bg-')}`} />
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">{title}</p>
                    </div>
                    <h3 className="text-5xl font-['Anton'] text-white tracking-tight">{value}</h3>
                </div>
                
                <div className="mt-4 w-full h-1 bg-zinc-800 overflow-hidden">
                    <div className={`h-full ${color.replace('text-', 'bg-')} w-2/3 group-hover:w-full transition-all duration-500`} />
                </div>
            </div>
        </div>
    )
}
