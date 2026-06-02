import { useState, useMemo, useEffect, useRef } from 'react'
import { SENTENCES, ISLAND_NAMES } from '../../data/islands'
import { useAudio } from '../../hooks/useAudio'

const REPEAT_OPTS = [1,2,3,5]

// ── Today stats hook (local) ──────────────────────────────────
function useTodayStats() {
  const today = new Date().toISOString().slice(0,10)
  const key   = `eh_today_${today}`
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || {practiced:0,reps:0,mastered:0} }
    catch { return {practiced:0,reps:0,mastered:0} }
  })
  const inc = (field, n=1) => setStats(prev => {
    const next = {...prev,[field]:prev[field]+n}
    localStorage.setItem(key, JSON.stringify(next))
    return next
  })
  return { stats, inc }
}

// ── Star Rating ───────────────────────────────────────────────
function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange(n)}
          className={`text-2xl transition-transform hover:scale-110 ${n <= value ? 'text-amber-400' : 'text-stone-200'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function StudyPage({ progress, toggleMastered, update }) {
  const [mode,        setMode]        = useState('recall')   // 'recall' | 'shadow'
  const [islandFilter,setIslandFilter]= useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [reps,        setReps]        = useState(1)
  const [idx,         setIdx]         = useState(0)
  const [revealed,    setRevealed]    = useState(false)
  const [rating,      setRating]      = useState(0)
  const { play, playing, repsLeft }   = useAudio()
  const { stats, inc }                = useTodayStats()

  // Filter sentences
  const deck = useMemo(() => {
    let s = SENTENCES
    if (islandFilter !== 'all') s = s.filter(x => x.island === islandFilter)
    if (levelFilter  !== 'all') s = s.filter(x => x.level  === levelFilter)
    return s
  }, [islandFilter, levelFilter])

  const current = deck[idx] || null
  const progressKey = current ? `s_${current.id}` : null
  const mastered    = progressKey ? progress[progressKey]?.mastered : false

  // Auto-play in Shadow mode
  useEffect(() => {
    if (mode === 'shadow' && current?.audio) {
      play(current.en, reps)
    }
  }, [idx, mode]) // eslint-disable-line

  function next() {
    setIdx(i => (i + 1) % deck.length)
    setRevealed(false)
    setRating(0)
    if (mode === 'shadow') inc('practiced')
  }

  function prev() {
    setIdx(i => (i - 1 + deck.length) % deck.length)
    setRevealed(false)
    setRating(0)
  }

  function reveal() {
    setRevealed(true)
    inc('practiced')
    if (current?.audio) play(current.en, reps)
  }

  function handleRating(r) {
    setRating(r)
    inc('reps')
    if (r >= 4 && progressKey && !mastered) {
      toggleMastered(progressKey)
      inc('mastered')
    }
    setTimeout(next, 500)
  }

  function handleMaster() {
    if (progressKey) {
      toggleMastered(progressKey)
      if (!mastered) inc('mastered')
    }
  }

  if (!current) return (
    <div className="p-8 text-center text-stone-400">No sentences found</div>
  )

  return (
    <div className="flex flex-col h-full bg-stone-50">

      {/* ── Today Stats ── */}
      <div className="bg-white border-b border-stone-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex gap-4">
            {[
              {n:stats.practiced, l:'Practiced'},
              {n:stats.reps,      l:'Reps'},
              {n:stats.mastered,  l:'Mastered'},
            ].map(s=>(
              <div key={s.l} className="text-center">
                <div className="text-lg font-bold text-stone-800">{s.n}</div>
                <div className="text-xs text-stone-400">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-stone-400">{idx+1}/{deck.length}</div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="bg-white border-b border-stone-100 px-4 py-2 space-y-2">
        <div className="flex gap-2 flex-wrap max-w-2xl mx-auto">
          {/* Mode */}
          <div className="flex bg-stone-100 rounded-lg p-0.5 gap-0.5">
            {[['recall','💬 Recall'],['shadow','🎧 Shadow']].map(([m,l])=>(
              <button key={m} onClick={()=>{setMode(m);setRevealed(false);setIdx(0)}}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode===m?'bg-white shadow-sm text-stone-800':'text-stone-500'}`}>
                {l}
              </button>
            ))}
          </div>

          {/* Island filter */}
          <select value={islandFilter} onChange={e=>{setIslandFilter(e.target.value);setIdx(0)}}
            className="border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
            <option value="all">All Islands</option>
            {ISLAND_NAMES.map(n=><option key={n} value={n}>{n.replace(' Island','')}</option>)}
          </select>

          {/* Level filter */}
          <select value={levelFilter} onChange={e=>{setLevelFilter(e.target.value);setIdx(0)}}
            className="border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
            {['all','A1','A2','B1','B2'].map(l=><option key={l} value={l}>{l==='all'?'All Levels':l}</option>)}
          </select>

          {/* Repeat */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-stone-400">×</span>
            {REPEAT_OPTS.map(n=>(
              <button key={n} onClick={()=>setReps(n)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${reps===n?'bg-stone-800 text-white':'bg-stone-100 text-stone-500'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Card ── */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-2xl">

          {/* Island + Level badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full">{current.island}</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">{current.level}</span>
            {mastered && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">✅ Mastered</span>}
          </div>

          {mode === 'recall' ? (
            /* ── RECALL MODE ── */
            <div>
              {/* Chinese (always shown) */}
              <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 mb-4">
                <p className="text-xs text-stone-400 mb-2 font-medium uppercase tracking-wider">中文</p>
                <p className="text-2xl text-stone-800 font-medium leading-relaxed">{current.zh}</p>
              </div>

              {/* English (hidden until revealed) */}
              {!revealed ? (
                <button onClick={reveal}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-4 rounded-2xl font-medium text-sm transition-all active:scale-95">
                  點擊顯示英文 + 播放音頻
                </button>
              ) : (
                <div>
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-4">
                    <p className="text-xs text-emerald-600 mb-2 font-medium uppercase tracking-wider">English</p>
                    <p className="text-xl text-stone-800 font-medium leading-relaxed">{current.en}</p>
                    {current.subtitle && <p className="text-xs text-stone-400 mt-2">{current.subtitle}</p>}
                  </div>

                  {/* Audio status */}
                  {playing && (
                    <div className="text-center text-sm text-emerald-600 mb-3 animate-pulse">
                      🔊 Playing {repsLeft > 1 ? `× ${repsLeft} more` : '...'}
                    </div>
                  )}

                  {/* Replay button */}
                  <button onClick={()=>current.audio&&play(current.en,reps)}
                    className="w-full border border-stone-200 text-stone-600 py-2 rounded-xl text-sm mb-4 hover:bg-stone-50">
                    🔁 Replay ×{reps}
                  </button>

                  {/* Star rating */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4">
                    <p className="text-xs text-stone-500 mb-3 text-center">記得幾清楚？（4-5星自動標為 Mastered）</p>
                    <div className="flex justify-center mb-3">
                      <Stars value={rating} onChange={handleRating}/>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleMaster}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${mastered?'bg-emerald-100 text-emerald-700':'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                        {mastered?'✅ Mastered':'☐ Mark Mastered'}
                      </button>
                      <button onClick={next}
                        className="flex-1 py-2 rounded-xl text-xs font-medium bg-stone-800 text-white hover:bg-stone-700">
                        下一句 →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── SHADOW MODE ── */
            <div>
              <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 mb-4">
                <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wider">
                  🎧 Listen & Repeat
                </p>
                <p className="text-2xl text-stone-800 font-medium leading-relaxed mb-3">{current.en}</p>
                <p className="text-stone-400">{current.zh}</p>
              </div>

              {/* Audio status */}
              <div className={`text-center py-3 rounded-xl mb-4 transition-all ${playing?'bg-emerald-50 text-emerald-600':'bg-stone-100 text-stone-400'}`}>
                {playing
                  ? <span className="animate-pulse">🔊 Playing {repsLeft > 1 ? `— ${repsLeft} more times` : '...'}</span>
                  : <span>Audio complete — now repeat aloud</span>
                }
              </div>

              {/* Replay */}
              <button onClick={()=>current.audio&&play(current.en,reps)}
                className="w-full border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm mb-3 hover:bg-stone-50">
                🔁 Replay ×{reps}
              </button>

              {/* Master + Next */}
              <div className="flex gap-2">
                <button onClick={handleMaster}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${mastered?'bg-emerald-100 text-emerald-700':'bg-stone-100 text-stone-600'}`}>
                  {mastered?'✅':'☐'} Master
                </button>
                <button onClick={next}
                  className="flex-2 flex-grow py-3 rounded-xl text-sm font-medium bg-stone-800 text-white hover:bg-stone-700">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Prev */}
          <button onClick={prev} className="w-full mt-3 py-2 text-xs text-stone-400 hover:text-stone-600">
            ← Previous
          </button>
        </div>
      </div>
    </div>
  )
}
