import { useState, useMemo } from 'react'
import { VOCABULARY } from '../../data/vocabulary'
import { useAudio } from '../../hooks/useAudio'

const REPS    = [1, 2, 3, 5]
const LEVELS  = ['All','A1','A2','B1','B2']
const LEVEL_STYLE = {
  A1:{ bg:'#d1fae5', color:'#065f46', label:'Beginner'      },
  A2:{ bg:'#dbeafe', color:'#1e40af', label:'Elementary'    },
  B1:{ bg:'#fef3c7', color:'#92400e', label:'Intermediate'  },
  B2:{ bg:'#fce7f3', color:'#9d174d', label:'Upper Int.'    },
}
const POS_STYLE = {
  'noun'    :{ bg:'var(--card-1)', color:'var(--sage)'  },
  'verb'    :{ bg:'var(--card-2)', color:'var(--terra)' },
  'adjective':{ bg:'var(--card-3)', color:'#6b5f8a'     },
  'adverb'  :{ bg:'var(--card-4)', color:'#7a6a50'      },
}

// ── Today stats ───────────────────────────────────────────────
function useTodayStats() {
  const key = `eh_vocab_${new Date().toISOString().slice(0,10)}`
  const [s, setS] = useState(()=>{ try{ return JSON.parse(localStorage.getItem(key))||{p:0,m:0} }catch{ return {p:0,m:0} } })
  const inc = (f) => setS(prev=>{ const n={...prev,[f]:prev[f]+1}; localStorage.setItem(key,JSON.stringify(n)); return n })
  return { s, inc }
}

// ── Study Mode Overlay ────────────────────────────────────────
function VocabStudyMode({ word, onClose, progress, toggleMastered }) {
  const [mode,     setMode]     = useState('recall')
  const [idx,      setIdx]      = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reps,     setReps]     = useState(1)
  const { play, playing }       = useAudio()
  const { s, inc }              = useTodayStats()

  const current  = word.sentences[idx]
  const key      = `vocab_${word.word}_${idx}`
  const mastered = progress[key]?.mastered
  const lv       = LEVEL_STYLE[word.level] || LEVEL_STYLE.A1

  useMemo(()=>{
    if(mode==='shadow'&&current?.en) setTimeout(()=>play(current.en,reps),300)
  // eslint-disable-next-line
  },[idx,mode])

  function next(){ setIdx(i=>(i+1)%word.sentences.length); setRevealed(false) }
  function prev(){ setIdx(i=>(i-1+word.sentences.length)%word.sentences.length); setRevealed(false) }
  function reveal(){ setRevealed(true); inc('p'); if(current?.en) play(current.en,reps) }
  function handleMaster(){ toggleMastered(key); if(!mastered) inc('m') }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:'var(--cream)'}}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{background:'white',borderBottom:'1px solid var(--line)'}}>
        <button onClick={onClose} className="text-sm font-medium flex items-center gap-1"
          style={{color:'var(--sage)'}}>‹ {word.word}</button>
        <div className="flex gap-4 text-center">
          {[{n:s.p,l:'練習'},{n:s.m,l:'掌握'}].map(x=>(
            <div key={x.l}>
              <div className="text-base font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{x.n}</div>
              <div className="text-xs" style={{color:'var(--sub)'}}>{x.l}</div>
            </div>
          ))}
        </div>
        <span className="text-xs" style={{color:'var(--sub)'}}>{idx+1}/{word.sentences.length}</span>
      </div>

      {/* Controls */}
      <div className="px-4 py-2 flex items-center gap-2 flex-wrap"
        style={{background:'white',borderBottom:'1px solid var(--line)'}}>
        <div className="flex rounded-lg p-0.5 gap-0.5" style={{background:'var(--sage-l)'}}>
          {[['recall','💬 Recall'],['shadow','🎧 Shadow']].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setRevealed(false);setIdx(0)}}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={mode===m?{background:'white',color:'var(--deep)'}:{color:'var(--sub)'}}>
              {l}
            </button>
          ))}
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full ml-1" style={{background:lv.bg,color:lv.color,fontWeight:600}}>
          {word.level}
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs" style={{color:'var(--sub)'}}>×</span>
          {REPS.map(n=>(
            <button key={n} onClick={()=>setReps(n)}
              className="w-7 h-7 rounded-full text-xs font-bold"
              style={{background:reps===n?'var(--deep)':'var(--sage-l)',color:reps===n?'white':'var(--sage)'}}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          {/* Word header */}
          <div className="flex items-baseline gap-3 mb-5 flex-wrap">
            <h1 className="text-4xl font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{word.word}</h1>
            <span className="text-lg" style={{color:'var(--sub)'}}>{word.chinese}</span>
            {mastered && <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'var(--sage-l)',color:'var(--sage)'}}>✅</span>}
          </div>

          {mode==='recall' ? (
            <div>
              <div className="rounded-2xl p-6 mb-4" style={{background:'white',border:'2px solid var(--line)'}}>
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--sub)'}}>中文提示</p>
                <p className="text-xl leading-relaxed" style={{color:'var(--warm)'}}>{current.zh}</p>
              </div>
              {!revealed ? (
                <button onClick={reveal} className="w-full py-4 rounded-2xl font-medium text-sm text-white"
                  style={{background:'var(--deep)'}}>
                  點擊顯示英文 + 播放
                </button>
              ) : (
                <div>
                  <div className="rounded-2xl p-6 mb-4" style={{background:'var(--sage-l)',border:'2px solid rgba(90,122,114,.2)'}}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--sage)'}}>English</p>
                    <p className="text-lg leading-relaxed font-medium" style={{color:'var(--warm)'}}>{current.en}</p>
                  </div>
                  {playing && <div className="text-center text-sm mb-3 animate-pulse" style={{color:'var(--sage)'}}>🔊 Playing...</div>}
                  <button onClick={()=>play(current.en,reps)}
                    className="w-full py-2 rounded-xl text-sm mb-3" style={{border:'1px solid var(--line)',color:'var(--sub)'}}>
                    🔁 Replay ×{reps}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={handleMaster} className="flex-1 py-3 rounded-xl text-sm font-medium"
                      style={{background:mastered?'var(--sage-l)':'rgba(61,53,48,.05)',color:mastered?'var(--sage)':'var(--sub)'}}>
                      {mastered?'✅ Mastered':'☐ Master'}
                    </button>
                    <button onClick={next} className="flex-grow flex-1 py-3 rounded-xl text-sm font-medium text-white"
                      style={{background:'var(--deep)'}}>下一句 →</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="rounded-2xl p-6 mb-4" style={{background:'white',border:'2px solid var(--line)'}}>
                <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{color:'var(--sub)'}}>🎧 Listen & Repeat</p>
                <p className="text-lg font-medium leading-relaxed mb-2" style={{color:'var(--warm)'}}>{current.en}</p>
                <p style={{color:'var(--sub)',fontSize:'14px'}}>{current.zh}</p>
              </div>
              <div className="text-center py-3 rounded-xl mb-4"
                style={{background:playing?'var(--sage-l)':'rgba(61,53,48,.05)',color:playing?'var(--sage)':'var(--sub)'}}>
                {playing ? <span className="animate-pulse">🔊 Playing...</span> : 'Audio complete — now repeat aloud'}
              </div>
              <button onClick={()=>play(current.en,reps)} className="w-full py-2.5 rounded-xl text-sm mb-3"
                style={{border:'1px solid var(--line)',color:'var(--sub)'}}>🔁 Replay ×{reps}</button>
              <div className="flex gap-2">
                <button onClick={handleMaster} className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{background:mastered?'var(--sage-l)':'rgba(61,53,48,.05)',color:mastered?'var(--sage)':'var(--sub)'}}>
                  {mastered?'✅':'☐'} Master
                </button>
                <button onClick={next} className="flex-1 flex-grow py-3 rounded-xl text-sm font-medium text-white"
                  style={{background:'var(--deep)'}}>Next →</button>
              </div>
            </div>
          )}
          <button onClick={prev} className="w-full mt-3 py-2 text-xs" style={{color:'var(--sub)'}}>← Previous</button>
        </div>
      </div>
    </div>
  )
}

// ── Main VocabPage ─────────────────────────────────────────────
export default function VocabPage({ progress, toggleMastered }) {
  const [levelFilter, setLevelFilter] = useState('All')
  const [search,      setSearch]      = useState('')
  const [active,      setActive]      = useState(null)
  const [showDetail,  setShowDetail]  = useState(false)
  const [studying,    setStudying]    = useState(false)
  const { play } = useAudio()

  const filtered = useMemo(()=>{
    let list = VOCABULARY
    if(levelFilter!=='All') list = list.filter(v=>v.level===levelFilter)
    if(search) {
      const q = search.toLowerCase()
      list = list.filter(v=>v.word.toLowerCase().includes(q)||v.chinese.includes(search))
    }
    return list
  },[levelFilter,search])

  function select(word){ setActive(word); setShowDetail(true) }

  const totalMastered = (word) =>
    word.sentences.filter((_,i)=>progress[`vocab_${word.word}_${i}`]?.mastered).length

  // ── List Panel ───────────────────────────────────────────────
  const ListPanel = (
    <div className={`flex flex-col md:w-64 md:flex-shrink-0 md:flex
      ${showDetail?'hidden md:flex':'flex w-full'}`}
      style={{borderRight:'1px solid var(--line)',background:'var(--cream)'}}>

      {/* Level filters */}
      <div className="p-3 space-y-2" style={{borderBottom:'1px solid var(--line)'}}>
        <div className="flex gap-1 flex-wrap">
          {LEVELS.map(l=>{
            const lv = LEVEL_STYLE[l]
            const isActive = levelFilter===l
            return (
              <button key={l} onClick={()=>setLevelFilter(l)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                style={isActive
                  ?{background: l==='All'?'var(--deep)':lv.bg, color: l==='All'?'white':lv.color, fontWeight:700}
                  :{background:'rgba(61,53,48,.06)', color:'var(--sub)'}
                }>
                {l==='All'?'All':l}
              </button>
            )
          })}
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索單詞..."
          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
          style={{background:'white',border:'1px solid var(--line)',color:'var(--warm)'}}/>
        <p className="text-xs" style={{color:'var(--sub)'}}>{filtered.length} words</p>
      </div>

      {/* Word list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map(v=>{
          const lv  = LEVEL_STYLE[v.level]
          const pos = POS_STYLE[v.pos?.split('/')[0].trim()] || POS_STYLE['noun']
          const mc  = totalMastered(v)
          const isActive = active?.word===v.word&&showDetail
          return (
            <button key={v.word} onClick={()=>select(v)}
              className="w-full text-left px-3 py-3 rounded-xl transition-all"
              style={isActive?{background:'var(--deep)',color:'white'}:{}}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='var(--sage-l)' }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='' }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold" style={{fontFamily:'Georgia,serif',fontSize:'16px',color:isActive?'white':'var(--deep)'}}>
                  {v.word}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{background:isActive?'rgba(255,255,255,.2)':lv.bg,color:isActive?'white':lv.color,fontWeight:600}}>
                  {v.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{color:isActive?'rgba(255,255,255,.6)':'var(--sub)'}}>{v.chinese}</span>
                <span className="text-xs" style={{color:isActive?'rgba(255,255,255,.4)':'var(--sub)'}}>
                  {mc}/{v.sentences.length}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  // ── Detail Panel ─────────────────────────────────────────────
  const DetailPanel = (
    <div className={`flex-1 overflow-y-auto ${showDetail?'flex flex-col w-full':'hidden md:flex md:flex-col'}`}>
      <button onClick={()=>setShowDetail(false)}
        className="md:hidden flex items-center gap-2 px-4 py-3 font-medium sticky top-0 z-10"
        style={{color:'var(--sage)',background:'white',borderBottom:'1px solid var(--line)'}}>
        ‹ 返回詞彙列表
      </button>

      {active ? (
        <div className="p-5 md:p-8 max-w-2xl mx-auto w-full">
          {/* Word title */}
          {(() => {
            const lv  = LEVEL_STYLE[active.level] || LEVEL_STYLE.A1
            const pos = active.pos?.split('/')[0].trim()
            const posStyle = POS_STYLE[pos] || POS_STYLE['noun']
            const mc  = totalMastered(active)
            return (
              <>
                <div className="mb-5">
                  <h1 className="text-5xl font-bold mb-2" style={{color:'var(--deep)',fontFamily:'Georgia,serif',lineHeight:1.1}}>
                    {active.word}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-lg" style={{color:'var(--sub)'}}>{active.chinese}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{background:lv.bg,color:lv.color}}>{active.level} · {lv.label}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{background:posStyle.bg,color:posStyle.color}}>{active.pos}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-1.5 rounded-full" style={{background:'var(--line)'}}>
                      <div className="h-1.5 rounded-full transition-all"
                        style={{width:`${(mc/active.sentences.length)*100}%`,background:'var(--sage)'}}/>
                    </div>
                    <span className="text-xs" style={{color:'var(--sub)'}}>{mc}/{active.sentences.length} mastered</span>
                  </div>
                </div>

                {/* Study button */}
                <button onClick={()=>setStudying(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white mb-6 hover:-translate-y-0.5 transition-all"
                  style={{background:'var(--deep)'}}>
                  🎯 Study this word — Recall & Shadow
                </button>

                {/* Quick play */}
                <div className="rounded-2xl p-4 mb-6 flex items-center justify-between"
                  style={{background:posStyle.bg,border:`1px solid ${posStyle.color}22`}}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:posStyle.color}}>Quick Play</p>
                    <p className="text-sm" style={{color:'var(--warm)'}}>Hear the word used in a sentence</p>
                  </div>
                  <button onClick={()=>play(active.sentences[0]?.en||active.word, 1)}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white"
                    style={{background:'var(--deep)'}}>▶ Play</button>
                </div>

                {/* Sentences */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:'var(--sub)'}}>
                  {active.sentences.length} Example Sentences
                </p>
                <div className="space-y-3">
                  {active.sentences.map((s,i)=>{
                    const k = `vocab_${active.word}_${i}`
                    const m = progress[k]?.mastered
                    return (
                      <div key={i} className="rounded-xl p-4"
                        style={{background:m?'var(--sage-l)':'white',border:`1px solid ${m?'rgba(90,122,114,.25)':'var(--line)'}`}}>
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5"
                            style={{background:'var(--card-4)',color:'var(--sub)'}}>{i+1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-relaxed mb-1" style={{color:'var(--warm)'}}>{s.en}</p>
                            <p className="text-sm leading-relaxed" style={{color:'var(--sub)'}}>{s.zh}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button onClick={()=>play(s.en,1)}
                                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium text-white"
                                style={{background:'var(--deep)'}}>▶ Play</button>
                              <button onClick={()=>toggleMastered(k)}
                                className="text-xs px-3 py-1 rounded-full font-medium"
                                style={{background:m?'var(--sage-l)':'rgba(61,53,48,.05)',color:m?'var(--sage)':'var(--sub)'}}>
                                {m?'✅ Mastered':'☐ Master'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })()}
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-bold mb-2" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>
            Vocabulary Builder
          </h2>
          <p className="text-sm mb-5" style={{color:'var(--sub)'}}>由A1到B2，系統建立英語詞彙</p>

          {/* Level preview */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-5">
            {Object.entries(LEVEL_STYLE).map(([lv,s])=>{
              const cnt = VOCABULARY.filter(v=>v.level===lv).length
              return (
                <button key={lv} onClick={()=>setLevelFilter(lv)}
                  className="rounded-2xl p-4 text-left transition-all hover:shadow-md"
                  style={{background:s.bg,border:`1px solid ${s.color}22`}}>
                  <div className="text-lg font-bold mb-0.5" style={{color:s.color,fontFamily:'Georgia,serif'}}>{lv}</div>
                  <div className="text-xs mb-0.5" style={{color:s.color,opacity:.7}}>{s.label}</div>
                  <div className="text-xs font-semibold" style={{color:s.color}}>{cnt} words</div>
                </button>
              )
            })}
          </div>
          <p className="text-xs" style={{color:'var(--sub)'}}>← 從左邊選擇一個單詞開始學習</p>
        </div>
      )}
    </div>
  )


  return (
    <>
      <div className="flex h-full overflow-hidden">
        {ListPanel}
        {DetailPanel}
      </div>
      {studying && active && (
        <VocabStudyMode word={active} onClose={()=>setStudying(false)} progress={progress} toggleMastered={toggleMastered}/>
      )}
    </>
  )
}
