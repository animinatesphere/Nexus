
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, DollarSign, TrendingUp, TrendingDown, Lock, Download, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAudio } from '../hooks/useAudio'
import { useSubscription } from '../hooks/useSubscription'

export default function Finance() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { playClick, playHover, playSuccess } = useAudio()
  const { currency, updateCurrency } = useSubscription()
  
  // Form State
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('food')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: parseFloat(amount),
          type,
          category,
          description,
          date: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      setTransactions([data[0], ...transactions])
      setIsModalOpen(false)
      setAmount('')
      setDescription('')
    } catch (error) {
      alert(error.message)
    }
  }

  // Calculate Totals
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  const balance = income - expense

  // Prepare Chart Data
  const chartData = [
    { name: 'Income', amount: income },
    { name: 'Expense', amount: expense },
  ]

  const COLORS = ['#10b981', '#ef4444']

  const CURRENCIES = {
    USD: { symbol: '$', label: 'USD' },
    NGN: { symbol: '₦', label: 'NGN' },
    EUR: { symbol: '€', label: 'EUR' },
    GBP: { symbol: '£', label: 'GBP' },
    GHS: { symbol: 'GH₵', label: 'GHS' },
    KES: { symbol: 'KSh', label: 'KES' }
  }

  const formatCurrency = (val) => {
    const symbol = CURRENCIES[currency]?.symbol || '$'
    return `${symbol}${val.toFixed(2)}`
  }

  return (

    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-zinc-800 pb-6 gap-4">
        <div>
          <h1 className="font-['Anton'] text-5xl text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_#000]">
            Dirty Financing
          </h1>
          <p className="mt-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Money Laundering // Stash Management
          </p>
          <div className="mt-4 flex items-center gap-2 bg-black border border-zinc-800 p-1">
            <Globe className="h-4 w-4 text-zinc-600 ml-2" />
            <select 
              value={currency}
              onChange={(e) => { playClick(); updateCurrency(e.target.value) }}
              className="bg-transparent text-zinc-400 text-xs font-mono uppercase px-2 py-1 focus:outline-none border-none cursor-pointer hover:text-white"
            >
              {Object.keys(CURRENCIES).map(curr => (
                <option key={curr} value={curr} className="bg-zinc-900">{CURRENCIES[curr].label}</option>
              ))}
            </select>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-['Anton'] uppercase tracking-wider hover:bg-green-500 hover:scale-105 transition-all shadow-[4px_4px_0px_#000] border-2 border-black"
        >
          <DollarSign className="h-5 w-5" />
          Cook Books / Add Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-none border-2 border-zinc-700 bg-black p-6 relative">
          <div className="absolute top-2 right-2 text-zinc-700">
             <DollarSign className="h-12 w-12 opacity-20" />
          </div>
          <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Total Stash (Net)</p>
          <h3 className="text-4xl font-['Anton'] text-white tracking-wide">{formatCurrency(balance)}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-none border-2 border-zinc-700 bg-black p-6 relative">
           <div className="absolute top-2 right-2 text-green-900">
             <TrendingUp className="h-12 w-12 opacity-20" />
          </div>
          <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Laundered (Income)</p>
          <h3 className="text-4xl font-['Anton'] text-white tracking-wide text-green-500">+{formatCurrency(income)}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-none border-2 border-zinc-700 bg-black p-6 relative">
           <div className="absolute top-2 right-2 text-red-900">
             <TrendingDown className="h-12 w-12 opacity-20" />
          </div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Bribes / Costs (Expense)</p>
          <h3 className="text-4xl font-['Anton'] text-white tracking-wide text-red-500">-{formatCurrency(expense)}</h3>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visual Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="rounded-none border-2 border-zinc-700 bg-zinc-900/50 p-6"
        >
          <h3 className="mb-6 font-['Anton'] text-2xl text-white uppercase">Cash Flow Analysis</h3>
          <div className="h-64 w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888'}} />
                <YAxis stroke="#666" tick={{fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff', fontFamily: 'monospace' }}
                  cursor={{ fill: '#ffffff10' }}
                />
                <Bar dataKey="amount" radius={[0, 0, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % 20]} stroke="black" strokeWidth={2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Premium Feature Lock */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="relative overflow-hidden rounded-none border-2 border-zinc-700 bg-black p-6"
        >
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center">
            <div className="rounded-none border-2 border-yellow-400 p-4 bg-yellow-400/10 mb-4 animate-pulse">
              <Lock className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-['Anton'] uppercase text-white">Restricted Access</h3>
            <p className="mt-2 text-zinc-400 font-mono text-xs uppercase tracking-wider">
               Advanced financial laundering patterns required. <br/> Upgrade clearance level.
            </p>
            <button className="mt-6 bg-white text-black font-['Anton'] uppercase tracking-widest px-8 py-3 hover:bg-yellow-400 transition-colors">
              Purchase Access
            </button>
          </div>
          
          {/* Mock Content Behind Lock */}
          <div className="opacity-20 blur-sm grayscale">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold uppercase">Categorized Laundering</h3>
             </div>
             <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <div className="h-4 w-32 bg-zinc-700"></div>
                        <div className="h-4 w-12 bg-zinc-700"></div>
                    </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="border border-zinc-800 bg-black">
        <div className="border-b border-zinc-800 px-6 py-4 bg-zinc-900">
          <h3 className="font-['Anton'] text-lg text-white uppercase tracking-wider">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-zinc-800">
          {loading ? (
             <div className="p-6 text-center text-zinc-500 font-mono uppercase">Decrypting ledger...</div>
          ) : transactions.length === 0 ? (
             <div className="p-6 text-center text-zinc-500 font-mono uppercase">No records found. Clean slate.</div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-900/50 group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 border ${t.type === 'income' ? 'border-green-900 bg-green-900/10 text-green-500' : 'border-red-900 bg-red-900/10 text-red-500'}`}>
                    {t.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase tracking-wide group-hover:text-yellow-400 transition-colors">{t.description || 'Unknown'}</p>
                    <p className="text-xs text-zinc-500 font-mono uppercase">{t.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <p className="text-xs text-zinc-600 font-mono uppercase">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border-2 border-white p-6 shadow-[20px_20px_0px_#000]">
            <h2 className="font-['Anton'] text-2xl text-white uppercase mb-6 border-b-2 border-zinc-800 pb-2">Log New Entry</h2>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-3 text-xs font-bold uppercase tracking-widest border-2 transition-all ${type === 'expense' ? 'border-red-500 bg-red-500 text-black' : 'border-zinc-700 text-zinc-500 hover:border-white hover:text-white'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-3 text-xs font-bold uppercase tracking-widest border-2 transition-all ${type === 'income' ? 'border-green-500 bg-green-500 text-black' : 'border-zinc-700 text-zinc-500 hover:border-white hover:text-white'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">{CURRENCIES[currency]?.symbol || '$'}</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full bg-black border border-zinc-700 pl-8 pr-3 py-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none uppercase text-xs"
                >
                  <option value="food">Consumables / Dining</option>
                  <option value="transport">Vehicles / Transport</option>
                  <option value="utilities">Safehouse Utilities</option>
                  <option value="housing">Safehouse Rent</option>
                  <option value="entertainment">R&R / Entertainment</option>
                  <option value="salary">Payout / Salary</option>
                  <option value="business">Front Business</option>
                  <option value="other">Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Description / Memo</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black border border-zinc-700 p-3 text-white font-mono focus:border-yellow-400 focus:outline-none"
                  placeholder="e.g. Cleaned via Casino..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase hover:text-white"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-6 py-2 font-black uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Cook Books
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
