import { useState, useMemo } from 'react'
import { VERBS, VERB_SENTENCES } from '../../data/phrasalVerbs'
import AudioPlayer from '../shared/AudioPlayer'

function getVerbOfDay() {
  const dayNum = Math.floor(Math.abs(new Date() - new Date('2026-01-01')) / 86400000) % 100
  return VERBS[((dayNum % 100) + 100) % 100]?.verb
}

export default function PhrasalPage({ progress, toggleMastered }) {
  const todayVerb  = getVerbOfDay()
  const [active,     setActive]     = useState(todayVerb || VERBS[0]?.verb)
  const [search,     setSearch]     = useState('')
  const [showDetail, setShowDetail] = useState(false)

  const verbData  = useMemo(() => VERBS.find(v => v.verb === active), [active])
  const sentences = useMemo(() => VERB_SENTENCES.filter(s => s.verb === active).sort((a,b)=>a.num-b.num), [active])
  const filtered  = useMemo(() => {
    if (!search) return VERBS
    return VERBS.filter(v => v.verb.includes(search.toLowerCase()) || v.chinese.includes(search))
  }, [search])

  function selectVerb(verb) {
    setActive(verb)
    setShowDetail(true)
  }

  // ── List Panel ────────────────────────────────────────────
  const ListPanel = (
    <div className={`flex flex-col md:w-56 md:flex-shrink-0 md:border-r md:border-stone-200 md:bg-stone-50
      ${showDetail ? 'hidden md:flex' : 'flex w-full bg-stone-50'}`}>
      <div className="p-3 border-b border-stone-100">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索動詞..."
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {!search && (
          <div className="px-2 py-1 text-xs font-semibold text-amber-600 uppercase tracking-wider">Today ✨</div>
        )}
        {filtered.map(v => (
          <button key={v.verb} onClick={() => selectVerb(v.verb)}
            className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center justify-between
              ${active === v.verb && showDetail ? 'bg-emerald-800 text-white'
                : v.verb === todayVerb && !(active === v.verb && showDetail)
                  ? 'ring-1 ring-amber-300 bg-amber-50 hover:bg-amber-100'
                  : 'hover:bg-stone-200 text-stone-700'}`}>
            <div>
              <div className={`font-semibold text-sm ${active === v.verb && showDetail ? 'text-white' : 'text-stone-800'}`}>
                {v.verb}
              </div>
              <div className={`text-xs mt-0.5 ${active === v.verb && showDetail ? 'text-emerald-200' : 'text-stone-400'}`}>
                {v.chinese}
              </div>
            </div>
            <span className="text-stone-300 md:hidden">›</span>
          </button>
        ))}
      </div>
    </div>
  )

  // ── Detail Panel ──────────────────────────────────────────
  const DetailPanel = (
    <div className={`flex-1 overflow-y-auto ${showDetail ? 'flex flex-col w-full' : 'hidden md:flex md:flex-col'}`}>

      {/* Mobile back button */}
      <button onClick={() => setShowDetail(false)}
        className="md:hidden flex items-center gap-2 px-4 py-3 text-emerald-700 font-medium border-b border-stone-100 bg-white sticky top-0 z-10">
        ‹ 返回動詞列表
      </button>

      {verbData && (
        <div className="p-5 md:p-8 max-w-2xl mx-auto w-full">

          {active === todayVerb && (
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
              ✨ Today's Verb of the Day
            </div>
          )}

          {/* Header */}
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <h1 className="text-4xl font-bold text-stone-800" style={{fontFamily:'Georgia,serif'}}>
              {verbData.verb}
            </h1>
            <span className="text-xl text-stone-400">{verbData.chinese}</span>
          </div>

          {/* Memory Association */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">🧠 Memory Association</p>
            <p className="text-stone-700 text-sm leading-relaxed">{verbData.memory}</p>
          </div>

          {/* Sentences */}
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">10 Example Sentences</p>
          <div className="space-y-3">
            {sentences.map(s => {
              const key = `v_${s.verb.replace(/\s+/g,'_')}_${s.num}`
              const m   = progress[key]?.mastered
              return (
                <div key={key} className={`border rounded-xl p-4 transition-colors ${m?'bg-emerald-50/60 border-emerald-300':'bg-white border-stone-200'}`}>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-500 text-xs flex items-center justify-center font-medium mt-0.5">
                      {s.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-800 text-sm font-medium leading-relaxed mb-1">{s.en}</p>
                      <p className="text-stone-500 text-sm leading-relaxed">{s.zh}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <AudioPlayer text={s.en} compact />
                        <button onClick={() => toggleMastered(key)}
                          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${m?'bg-emerald-100 text-emerald-700':'bg-stone-100 text-stone-500 hover:bg-emerald-100 hover:text-emerald-700'}`}>
                          {m ? '✅ Mastered' : '☐ Master'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-full overflow-hidden">
      {ListPanel}
      {DetailPanel}
    </div>
  )
}
