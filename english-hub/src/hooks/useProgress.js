import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const LS_KEY = 'eh_progress'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}
function saveLocal(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

export function useProgress(userId) {
  // progress = { "s_123": {mastered:true, reps:3}, "v_giveup_1": {mastered:false, reps:1} }
  const [progress, setProgress] = useState(loadLocal)
  const [syncing,  setSyncing]  = useState(false)

  // Load from Supabase on mount
  useEffect(() => {
    if (!userId) return
    setSyncing(true)
    supabase
      .from('progress')
      .select('key,mastered,reps')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (!error && data) {
          const remote = {}
          data.forEach(r => { remote[r.key] = { mastered: r.mastered, reps: r.reps } })
          const merged = { ...loadLocal(), ...remote }
          setProgress(merged)
          saveLocal(merged)
        }
        setSyncing(false)
      })
  }, [userId])

  const update = useCallback(async (key, patch) => {
    const next = { ...progress, [key]: { mastered: false, reps: 0, ...progress[key], ...patch } }
    setProgress(next)
    saveLocal(next)
    if (userId) {
      await supabase.from('progress').upsert(
        { user_id: userId, key, ...next[key], updated_at: new Date().toISOString() },
        { onConflict: 'user_id,key' }
      )
    }
  }, [progress, userId])

  const toggleMastered = useCallback((key) => {
    const cur = progress[key] || { mastered: false, reps: 0 }
    update(key, { mastered: !cur.mastered, reps: cur.reps + 1 })
  }, [progress, update])

  const masteredCount = Object.values(progress).filter(v => v.mastered).length

  return { progress, update, toggleMastered, masteredCount, syncing }
}
