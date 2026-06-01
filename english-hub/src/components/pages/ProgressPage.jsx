import { useMemo } from 'react'
import { SENTENCES, ISLAND_NAMES } from '../../data/islands'

const ISLAND_META = {
  'Lifestyle Island':        '🌿',
  'Work & Study Island':     '💻',
  'Mindset Island':          '🧠',
  'Coffee Shop Island':      '☕',
  'Hobbies & Interests Island':'🎨',
  'Family Island':           '👨‍👩‍👧',
  'Small Talk Island':       '💬',
  'Feeling Island':          '💭',
  "Girl's Talk Island":      '👯',
}

const MILESTONES = [
  { emoji:'🥚', title:'First 50 sentences', target:50 },
  { emoji:'🌱', title:'First 100 mastered', target:100 },
  { emoji:'🔥', title:'30-day streak',      target:30, isStreak:true },
  { emoji:'🏝️', title:'Complete 3 Islands', target:3, isIsland:true },
  { emoji:'💬', title:'50 Phrasal Verbs',   target:50, isVerb:true },
  { emoji:'⭐', title:'500 sentences',       target:500 },
]

export default function ProgressPage({ progress, masteredCount, stats }) {
  const islandProgress = useMemo(() => {
    const map = {}
    ISLAND_NAMES.forEach(name => { map[name] = 0 })
    SENTENCES.forEach(s => {
      if (progress[`s_${s.id}`]?.mastered) map[s.island] = (map[s.island]||0) + 1
    })
    return map
  }, [progress])

  const verbMastered = useMemo(() =>
    Object.entries(progress).filter(([k,v]) => v.mastered && k.startsWith('v_')).length
  , [progress])

  const islandsCompleted = Object.values(islandProgress).filter(n => n >= 200).length

  const getMilestoneProgress = (m) => {
    if (m.isStreak)  return { cur: stats.streak, pct: Math.min(100, (stats.streak/m.target)*100) }
    if (m.isIsland)  return { cur: islandsCompleted, pct: Math.min(100, (islandsCompleted/m.target)*100) }
    if (m.isVerb)    return { cur: verbMastered, pct: Math.min(100, (verbMastered/m.target)*100) }
    return { cur: masteredCount, pct: Math.min(100, (masteredCount/m.target)*100) }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-6" style={{fontFamily:'Georgia,serif'}}>📊 My Progress</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {e:'📚',v:'1,800',l:'Total',s:'sentences'},
          {e:'✅',v:masteredCount,l:'Mastered',s:'sentences'},
          {e:'🔥',v:`Day ${stats.streak}`,l:'Streak',s:`best: ${stats.longest}`},
          {e:'💬',v:verbMastered,l:'Verbs',s:'sentences mastered'},
        ].map(s=>(
          <div key={s.l} className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="text-2xl mb-2">{s.e}</div>
            <div className="text-xl font-bold text-stone-800">{s.v}</div>
            <div className="text-xs text-stone-500 mt-0.5">{s.l}</div>
            <div className="text-xs text-stone-300">{s.s}</div>
          </div>
        ))}
      </div>

      {/* Island progress */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-stone-700 mb-5">Island Completion</h2>
        <div className="space-y-3">
          {ISLAND_NAMES.map(name => {
            const mc  = islandProgress[name] || 0
            const pct = Math.round((mc/200)*100)
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-stone-700">{ISLAND_META[name]} {name}</span>
                  <span className="text-xs font-medium text-stone-500">{mc}/200 · {pct}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{width:`${pct}%`}}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Milestones */}
      <h2 className="font-bold text-stone-700 mb-4">🏆 Milestones</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MILESTONES.map(m => {
          const { cur, pct } = getMilestoneProgress(m)
          const done = pct >= 100
          return (
            <div key={m.title} className={`border rounded-2xl p-5 ${done?'bg-emerald-50 border-emerald-200':'bg-white border-stone-200'}`}>
              <div className="text-3xl mb-3">{m.emoji}</div>
              <div className={`text-sm font-semibold mb-2 ${done?'text-emerald-800':'text-stone-700'}`}>{m.title}</div>
              {done
                ? <div className="text-xs text-emerald-600 font-medium">✅ Completed!</div>
                : <div>
                    <div className="text-xs text-stone-400 mb-1.5">{cur} / {m.target}</div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full bg-amber-400 transition-all" style={{width:`${pct}%`}}/>
                    </div>
                  </div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
