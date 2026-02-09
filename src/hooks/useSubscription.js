import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook to check and manage user subscription status.
 * Returns { isPremium, tier, loading, error, refetch }
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState({
    isPremium: false,
    tier: 'free',
    status: null,
    loading: true,
    error: null
  })

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSubscription(prev => ({ ...prev, loading: false }))
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setSubscription({
        isPremium: data?.subscription_tier === 'premium' && data?.subscription_status === 'active',
        tier: data?.subscription_tier || 'free',
        status: data?.subscription_status,
        loading: false,
        error: null
      })
    } catch (err) {
      console.error('Error fetching subscription:', err.message)
      setSubscription(prev => ({ ...prev, loading: false, error: err.message }))
    }
  }

  useEffect(() => {
    fetchSubscription()

    // Listen for profile changes
    const profileSubscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles' 
      }, payload => {
        if (payload.new) {
            setSubscription({
                isPremium: payload.new.subscription_tier === 'premium' && payload.new.subscription_status === 'active',
                tier: payload.new.subscription_tier || 'free',
                status: payload.new.subscription_status,
                loading: false,
                error: null
            })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(profileSubscription)
    }
  }, [])

  return { ...subscription, refetch: fetchSubscription }
}
