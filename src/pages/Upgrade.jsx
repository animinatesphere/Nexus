import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Check, ArrowRight, Globe, CreditCard, Wallet } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useSubscription } from '../hooks/useSubscription'
import { useAudio } from '../hooks/useAudio'
import { toast } from 'sonner'

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1, flag: '🇺🇸' },
  { code: 'NGN', symbol: '₦', rate: 1500, flag: '🇳🇬' },
  { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 0.79, flag: '🇬🇧' },
  { code: 'GHS', symbol: 'GH₵', rate: 12.5, flag: '🇬🇭' },
  { code: 'KES', symbol: 'KSh', rate: 132, flag: '🇰🇪' },
]

const PLANS = [
  {
    id: 'premium_monthly_3',
    name: 'Operative',
    usd_price: 3,
    description: 'Entry-level access for rising stars.',
    features: ['Unlimited Projects', 'Basic Analytics', 'Standard Storage', 'Community Support'],
    color: 'border-white',
    accent: 'bg-white text-black'
  },
  {
    id: 'premium_monthly_10',
    name: 'Mastermind',
    usd_price: 10,
    description: 'Advanced tools for elite criminal masterminds.',
    features: ['Unlimited everything', 'Advanced Analytics', 'Prioritized Execution', 'The Vault Access', 'Direct Support'],
    color: 'border-yellow-400',
    accent: 'bg-yellow-400 text-black',
    popular: true
  }
]

export default function Upgrade() {
  const { tier, isPremium } = useSubscription()
  const { playClick, playSuccess, playHover } = useAudio()
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState(CURRENCIES[0])

  // Load BudPay Inline Script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://inlinepay.budpay.com/budpay-inline-custom.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleStripePayment = async (plan) => {
    playClick()
    playSuccess()
    setLoading(true)
    const price = (plan.usd_price * currency.rate).toFixed(2)
    toast.info(`Initializing Stripe Checkout for ${price} ${currency.code}...`)
    // Simulation: In production, redirect to Stripe session
    setLoading(false)
  }

  const handleBudPayPayment = async (plan) => {
    if (typeof window.BudPayCheckout !== 'function') {
      toast.error("Billing System Offline. Please refresh.")
      return
    }

    playClick()
    playSuccess()
    setLoading(true)
    const price = (plan.usd_price * currency.rate).toFixed(2)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      window.BudPayCheckout({
        key: 'pk_test_mtxn4ciwdpqyk2nptt5u77g3qmeejaow6kks2y',
        email: user.email,
        amount: price,
        currency: currency.code,
        metadata: {
          plan_id: plan.id,
          user_id: user.id
        },
        callback: (response) => {
          console.log('Payment Successful', response)
          toast.success("TRANSACTION COMPLETE. Clearance Level Upgraded.")
          // Update profile in production
        },
        onClose: () => {
          setLoading(false)
          toast.warning("TRANSACTION ABORTED.")
        }
      })
    } catch (err) {
      toast.error("Auth System Error.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Currency Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="text-center md:text-left">
                <motion.h1 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="font-['Anton'] text-7xl uppercase tracking-tighter"
                >
                    Expand <span className="text-yellow-400">Empire</span>
                </motion.h1>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.4em] mt-2">
                    Select Your Operational Clearances
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 bg-zinc-900/50 p-2 border border-zinc-800 rounded-sm">
                {CURRENCIES.map(curr => (
                    <button
                        key={curr.code}
                        onClick={() => { playClick(); setCurrency(curr) }}
                        onMouseEnter={playHover}
                        className={`px-4 py-2 font-mono text-xs uppercase transition-all flex items-center gap-2 ${currency.code === curr.code ? 'bg-yellow-400 text-black font-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
                    >
                        <span>{curr.flag}</span>
                        {curr.code}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {PLANS.map((plan, index) => {
            const currentPrice = (plan.usd_price * currency.rate).toLocaleString()
            return (
              <motion.div
                key={plan.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative border-4 ${plan.color} bg-black p-10 flex flex-col h-full shadow-[15px_15px_0px_#000] group hover:shadow-[20px_20px_0px_rgba(255,255,0,0.1)] transition-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black uppercase text-xs px-6 py-2 rotate-1 shadow-lg border-2 border-black">
                    Recommended Intel
                  </div>
                )}

                <div className="mb-8 overflow-hidden">
                    <h3 className="font-['Anton'] text-4xl uppercase mb-2 group-hover:text-yellow-400 transition-colors">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-['Anton']">{currency.symbol}{currentPrice}</span>
                        <span className="text-zinc-600 font-mono text-xs uppercase">/ Mo</span>
                    </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map(feat => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="h-4 w-4 border border-zinc-700 flex items-center justify-center p-0.5">
                        <Check className="h-3 w-3 text-yellow-500 shrink-0" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-900">
                    <button 
                        onClick={() => handleStripePayment(plan)}
                        disabled={loading || (isPremium && tier === plan.id)}
                        className={`w-full py-4 font-['Anton'] text-xl uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${plan.accent} hover:scale-[1.02] disabled:opacity-30`}
                    >
                        <CreditCard className="h-5 w-5" />
                        International Checkout
                    </button>

                    <button 
                        onClick={() => handleBudPayPayment(plan)}
                        disabled={loading || (isPremium && tier === plan.id)}
                        className="w-full py-4 border-2 border-zinc-800 bg-zinc-900/30 text-white font-['Anton'] text-xl uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all disabled:opacity-30"
                    >
                        <Wallet className="h-5 w-5" />
                        Local Pay (Africa)
                    </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Security Info */}
        <div className="grid md:grid-cols-3 gap-8">
            <SecurityCard title="Encrypted" icon={ShieldCheck} desc="256-bit AES protection on all channels." />
            <SecurityCard title="Global" icon={Globe} desc="Serving operatives in 50+ territories." />
            <SecurityCard title="Verified" icon={ShieldCheck} desc="Official partner of Stripe & BudPay." />
        </div>
      </div>
    </div>
  )
}

function SecurityCard({ title, icon: Icon, desc }) {
    return (
        <div className="border border-zinc-800 p-6 bg-zinc-950 flex items-start gap-4">
            <Icon className="h-6 w-6 text-zinc-700 shrink-0" />
            <div>
                <h4 className="font-['Anton'] text-lg uppercase tracking-wider text-zinc-400">{title}</h4>
                <p className="text-zinc-600 text-xs font-mono uppercase mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
