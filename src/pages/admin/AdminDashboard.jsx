import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Activity, TrendingUp, ShieldAlert, Map, Skull } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    mrr: 0,
    activeSubs: 0
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock Revenue Data (since we don't have Stripe live yet)
  const revenueData = [
    { name: 'Jan', amt: 2400 },
    { name: 'Feb', amt: 1398 },
    { name: 'Mar', amt: 9800 },
    { name: 'Apr', amt: 3908 },
    { name: 'May', amt: 4800 },
    { name: 'Jun', amt: 3800 },
    { name: 'Jul', amt: 12500 }
  ]

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // Fetch Users Count
      const { count: userCount, data: usersList, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      setStats({
        totalUsers: userCount || 0,
        mrr: 12500, // Mocked
        activeSubs: Math.floor((userCount || 0) * 0.4) // Mocked conversion rate
      })

      setUsers(usersList || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 h-full bg-black min-h-screen p-8 text-white font-sans">
      <div className="border-b-4 border-red-900 pb-6 flex justify-between items-end">
        <div>
            <h1 className="font-['Anton'] text-6xl text-white uppercase tracking-tighter drop-shadow-[5px_5px_0px_#7f1d1d]">
            God Mode
            </h1>
            <p className="mt-2 text-red-500 font-mono text-sm uppercase tracking-[0.2em] animate-pulse">
            System Overseer // All Eyes On Me
            </p>
        </div>
        <div className="hidden md:block">
            <div className="flex items-center gap-2 border border-red-900 p-2 bg-red-950/20">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-xs font-mono text-red-500 uppercase">Live Feed Active</span>
            </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Operatives Recruited" value={stats.totalUsers} icon={Users} color="text-red-500" bgColor="bg-red-950/30" borderColor="border-red-900" />
        <StatCard title="Laundered Monthly" value={`$${stats.mrr.toLocaleString()}`} icon={DollarSign} color="text-green-500" bgColor="bg-green-950/30" borderColor="border-green-900" />
        <StatCard title="Active Contracts" value={stats.activeSubs} icon={Activity} color="text-yellow-500" bgColor="bg-yellow-950/30" borderColor="border-yellow-900" />
      </div>

      {/* Revenue Chart */}
      <div className="border-2 border-red-900 bg-black p-6 relative overflow-hidden">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(127,29,29,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(127,29,29,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <h3 className="mb-6 font-['Anton'] text-2xl text-white uppercase flex items-center gap-3 relative z-10">
            <TrendingUp className="h-6 w-6 text-red-500" />
            Syndicate Growth
        </h3>
        <div className="h-[350px] w-full font-mono text-xs relative z-10">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                    <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" tick={{fill: '#999'}} />
                    <YAxis stroke="#666" tick={{fill: '#999'}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#000', borderColor: '#7f1d1d', color: '#fff', fontFamily: 'monospace' }}
                        itemStyle={{ color: '#ef4444' }}
                    />
                    <Area type="monotone" dataKey="amt" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="border-2 border-zinc-800 bg-black overflow-hidden relative">
         <div className="absolute top-0 right-0 p-2 opacity-50">
            <Map className="h-24 w-24 text-zinc-900 rotate-12" />
         </div>

        <div className="border-b border-zinc-800 px-6 py-4 bg-zinc-900/50">
            <h3 className="font-['Anton'] text-xl text-white uppercase tracking-wider">Surveillance Log</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400 font-mono uppercase">
                <thead className="bg-zinc-950 text-xs text-zinc-600 border-b border-zinc-900">
                    <tr>
                        <th className="px-6 py-4 tracking-widest">Target Identity</th>
                        <th className="px-6 py-4 tracking-widest">Recruitment Date</th>
                        <th className="px-6 py-4 tracking-widest">Clearance Level</th>
                        <th className="px-6 py-4 text-right tracking-widest">Protocol</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-red-950/10 transition-colors group">
                            <td className="px-6 py-4 flex items-center gap-4">
                                <div className="h-10 w-10 border-2 border-zinc-700 bg-black flex items-center justify-center text-xs font-bold text-white group-hover:border-red-500 transition-colors">
                                    {user.full_name?.[0] || <Skull className="h-4 w-4" />}
                                </div>
                                <div>
                                    <div className="font-bold text-white group-hover:text-red-500 transition-colors">{user.full_name || 'REDACTED'}</div>
                                    <div className="text-[10px] text-zinc-600">{user.email?.split('@')[0] || 'Unknown ID'}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold tracking-wider ${user.is_admin ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-green-800 bg-green-900/10 text-green-700'}`}>
                                    {user.is_admin ? 'OVERSEER' : 'GRUNT'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-zinc-500 hover:text-white hover:underline decoration-red-500 underline-offset-4">Investigate</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, bgColor, borderColor }) {
    return (
        <div className={`border-2 ${borderColor} ${bgColor} p-6 relative overflow-hidden group hover:bg-opacity-50 transition-all`}>
            {/* Corner Accents */}
            <div className={`absolute top-0 left-0 w-2 h-2 ${color.replace('text-', 'bg-')}`} />
            <div className={`absolute bottom-0 right-0 w-2 h-2 ${color.replace('text-', 'bg-')}`} />
            
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${color} opacity-80`}>{title}</p>
                    <h3 className="mt-2 text-4xl font-['Anton'] text-white drop-shadow-md">{value}</h3>
                </div>
                <div className={`p-4 border-2 ${borderColor.replace('border-', 'border-')} bg-black`}>
                    <Icon className={`h-8 w-8 ${color}`} />
                </div>
            </div>
        </div>
    )
}
