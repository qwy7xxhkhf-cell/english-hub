import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Reads the current user's premium flag from Supabase (profiles.is_premium).
// Returns { premium, loading, refresh }.
export function useEntitlement(userId) {
  const [premium, setPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) { setPremium(false); setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .maybeSingle()
    setPremium(!error && data ? !!data.is_premium : false)
    setLoading(false)
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { premium, loading, refresh }
}
