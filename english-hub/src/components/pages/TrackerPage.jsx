import { useState } from 'react'
import { ISLAND_NAMES } from '../../data/islands'

const MOODS = ['😊 Great','😐 Okay','😔 Tough']

function CalendarGrid({ studiedDates, streak }) {
  const today = new Date()
  const days  = []
  for (let i = 41; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d.toISOString().slice(0,10))
  }
  const weeks = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i+7))

  return (
    <div>
      <div className="flex gap-1 mb-2 text-xs text-stone-400">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
          <div key={d} className="w-7 text-center">{d}</div>
        ))}
      </div>
      {weeks.map((week,wi) => (
        <div key={wi} className="flex gap-1 mb-1">
          {week.map(date => {
            const studied = studiedDates.has(date)
            const isToday = date === today.toISOString().slice(0,10)
            return (
              <div key={date} title={date}
                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all
                  ${studied ? 'bg-emerald-500 text-white font-bold' : 'bg-stone-100 text-stone-300'}
                  ${isToday ? 'ring-2 ring-emerald-600 ring-offset-1' : ''}`}>
                {studied ? '✓' : new Date(date+'T12:00:00').getDate()}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function TrackerPage({ stats, logs, addLog, studiedDates }) {
  const [form, setForm] = useState({ island:'', sentences_studied:'', mastered_today:'', time_spent:'', mood:'😊 Great', notes:'' })
  const [saved, setSaved] = useState(false)

  async function submit(e) {
    e.preventDefault()
    await addLog({
      island:           form.island,
      sentences_studied:parseInt(form.sentences_studied)||0,
      mastered_today:   parseInt(form.mastered_today)||0,
      time_spent:       parseInt(form.time_spent)||0,
      mood:             form.mood,
      notes:            form.notes,
    })
    setSaved(true)
    setTimeout(()=>setSaved(false), 3000)
  }

  const todayLogged = studiedDates.has(new Date().toISOString().slice(0,10))

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-6" style={{fontFamily:'Georgia,serif'}}>📔 Study Tracker</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Streak */}
        <div className="bg-gradient-to-br from-stone-900 to-emerald-900 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold mb-1">{stats.streak}</div>
              <div className="text-emerald-300 text-sm">Day streak 🔥</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">{stats.longest}</div>
              <div className="text-emerald-300 text-xs">Best streak</div>
            </div>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-1.5 rounded-full bg-emerald-400" style={{width:`${Math.min(100,(stats.streak/30)*100)}%`}}/>
          </div>
          <div className="text-emerald-300 text-xs mt-2">{stats.streak}/30 days milestone</div>
        </div>

        {/* Log form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-700">✏️ Log Today</h2>
            {todayLogged && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">✅ Logged!</span>}
          </div>
          <form onSubmit={submit} className="space-y-3">
            <select value={form.island} onChange={e=>setForm(p=>({...p,island:e.target.value}))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <option value="">🏝️ Island studied...</option>
              {ISLAND_NAMES.map(n=><option key={n} value={n}>{n}</option>)}
              <option value="Phrasal Verbs">💬 Phrasal Verbs</option>
            </select>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Sentences</label>
                <input type="number" min="0" value={form.sentences_studied} onChange={e=>setForm(p=>({...p,sentences_studied:e.target.value}))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="0"/>
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Mastered</label>
                <input type="number" min="0" value={form.mastered_today} onChange={e=>setForm(p=>({...p,mastered_today:e.target.value}))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="0"/>
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1">Minutes</label>
                <input type="number" min="0" value={form.time_spent} onChange={e=>setForm(p=>({...p,time_spent:e.target.value}))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="0"/>
              </div>
            </div>
            <div className="flex gap-2">
              {MOODS.map(m=>(
                <button type="button" key={m} onClick={()=>setForm(p=>({...p,mood:m}))}
                  className={`flex-1 py-1.5 rounded-lg text-sm transition-all ${form.mood===m?'bg-emerald-100 text-emerald-700 font-medium':'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}>
                  {m.split(' ')[0]}
                </button>
              ))}
            </div>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              rows={2} placeholder="今天的學習筆記... (可選)"/>
            <button type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors">
              {saved ? '✅ Saved!' : '📝 Save Log'}
            </button>
          </form>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-stone-700 mb-4">📅 Study Calendar (Last 6 weeks)</h2>
        <CalendarGrid studiedDates={studiedDates} streak={stats.streak} />
        <div className="flex items-center gap-4 mt-4 text-xs text-stone-400">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-emerald-500"/>Studied</div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-stone-100 border border-stone-200"/>No session</div>
        </div>
      </div>

      {/* Recent logs */}
      {logs.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="font-bold text-stone-700 mb-4">📋 Recent Sessions</h2>
          <div className="space-y-3">
            {logs.slice(0,10).map((log,i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-stone-100 last:border-0">
                <div className="text-xs text-stone-400 w-20 flex-shrink-0">{log.date}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-stone-700 font-medium truncate">{log.island || '—'}</div>
                  <div className="text-xs text-stone-400">{log.sentences_studied} sentences · {log.mastered_today} mastered · {log.time_spent}min</div>
                </div>
                <div className="text-lg flex-shrink-0">{log.mood?.split(' ')[0]||'😊'}</div>
                <div className="text-xs text-stone-400 flex-shrink-0">🔥 Day {log.streak_day}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
