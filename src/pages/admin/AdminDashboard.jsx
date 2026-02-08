
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react'
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Example Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Platform overview and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-500" bgColor="bg-blue-500/10" />
        <StatCard title="Monthly Revenue" value={`$${stats.mrr.toLocaleString()}`} icon={DollarSign} color="text-green-500" bgColor="bg-green-500/10" />
        <StatCard title="Active Subscriptions" value={stats.activeSubs} icon={Activity} color="text-purple-500" bgColor="bg-purple-500/10" />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Revenue Growth
        </h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                    <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                    />
                    <Area type="monotone" dataKey="amt" stroke="#ef4444" fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Recent Signups</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                    <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Signed Up</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                    {user.full_name?.[0] || 'U'}
                                </div>
                                <div className="font-medium text-slate-200">{user.full_name || 'Anonymous User'}</div>
                            </td>
                            <td className="px-6 py-4">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.is_admin ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {user.is_admin ? 'Admin' : 'User'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-white">Edit</button>
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

function StatCard({ title, value, icon: Icon, color, bgColor }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`rounded-xl p-3 ${bgColor}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
            </div>
        </div>
    )
}
