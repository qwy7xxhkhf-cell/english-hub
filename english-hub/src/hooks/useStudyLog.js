import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const LS_LOG   = 'eh_studylog'
const LS_STATS = 'eh_stats'

function loadLocal(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def } catch { return def }
}

export function useStudyLog(userId) {
  const [logs,   setLogs]   = useState(() => loadLocal(LS_LOG, []))
  const [stats,  setStats]  = useState(() => loadLocal(LS_STATS, { streak: 0, longest: 0, lastDate: null }))

  // Load from Supabase
  useEffect(() => {
    if (!userId) return
    Promise.all([
      supabase.from('study_log').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(90),
      supabase.from('user_stats').select('*').eq('user_id', userId).single()
    ]).then(([logsRes, statsRes]) => {
      if (!logsRes.error && logsRes.data) {
        setLogs(logsRes.data)
        localStorage.setItem(LS_LOG, JSON.stringify(logsRes.data))
      }
      if (!statsRes.error && statsRes.data) {
        const s = { streak: statsRes.data.streak, longest: statsRes.data.longest_streak, lastDate: statsRes.data.last_study_date }
        setStats(s)
        localStorage.setItem(LS_STATS, JSON.stringify(s))
      }
    })
  }, [userId])

  const addLog = useCallback(async (entry) => {
    const today = new Date().toISOString().slice(0, 10)
    const row = { date: today, island: '', sentences_studied: 0, mastered_today: 0, time_spent: 0, mood: '😊', streak_day: stats.streak + 1, notes: '', ...entry }

    // Update streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const isConsecutive = stats.lastDate === yesterday || stats.lastDate === today
    const newStreak  = isConsecutive ? stats.streak + (stats.lastDate === today ? 0 : 1) : 1
    const newLongest = Math.max(newStreak, stats.longest)
    const newStats   = { streak: newStreak, longest: newLongest, lastDate: today }

    setLogs(prev => [{ ...row, streak_day: newStreak }, ...prev.filter(l => l.date !== today)])
    setStats(newStats)
    localStorage.setItem(LS_STATS, JSON.stringify(newStats))

    if (userId) {
      await Promise.all([
        supabase.from('study_log').upsert({ user_id: userId, ...row, streak_day: newStreak }, { onConflict: 'user_id,date' }),
        supabase.from('user_stats').upsert({ user_id: userId, streak: newStreak, longest_streak: newLongest, last_study_date: today }, { onConflict: 'user_id' })
      ])
    }
  }, [stats, userId])

  const studiedDates = new Set(logs.map(l => l.date))

  return { logs, stats, addLog, studiedDates }
}
