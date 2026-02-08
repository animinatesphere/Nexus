
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, DollarSign, TrendingUp, TrendingDown, Lock, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Finance() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Finance & Budgeting</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Track your financial health</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--muted-foreground)]">Total Balance</p>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">${balance.toFixed(2)}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--muted-foreground)]">Income</p>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">${income.toFixed(2)}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-500/10 p-3">
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--muted-foreground)]">Expenses</p>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">${expense.toFixed(2)}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visual Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
        >
          <h3 className="mb-6 text-lg font-semibold text-[var(--foreground)]">Cash Flow</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  cursor={{ fill: 'var(--accent)' }}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
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
          className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
        >
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="rounded-full bg-[var(--primary)] p-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">Advanced Analytics</h3>
            <p className="mt-2 text-center text-sm text-gray-200">
              Upgrade to Premium to unlock <br/> custom reports and category breakdown.
            </p>
            <button className="mt-6 rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:bg-gray-100">
              Upgrade Now
            </button>
          </div>
          
          {/* Mock Content Behind Lock */}
          <div className="opacity-20 blur-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Spending by Category</h3>
                <Download className="h-5 w-5" />
             </div>
             <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex justify-between">
                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                        <div className="h-4 w-12 bg-gray-300 rounded"></div>
                    </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {loading ? (
             <div className="p-6 text-center text-[var(--muted-foreground)]">Loading...</div>
          ) : transactions.length === 0 ? (
             <div className="p-6 text-center text-[var(--muted-foreground)]">No transactions yet.</div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--accent)]/50">
                <div className="flex items-center gap-4">
                  <div className={`rounded-full p-2 ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {t.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{t.description || 'Untitled Transaction'}</p>
                    <p className="text-sm text-[var(--muted-foreground)] capitalize">{t.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-[var(--foreground)]'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[var(--foreground)]">New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`rounded-md py-2 text-sm font-medium border ${type === 'expense' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`rounded-md py-2 text-sm font-medium border ${type === 'income' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Amount</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-md border border-[var(--border)] bg-[var(--input)] pl-7 pr-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="housing">Housing</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="salary">Salary</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
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
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
