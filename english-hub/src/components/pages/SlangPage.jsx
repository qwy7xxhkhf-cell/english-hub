import { useState, useMemo } from 'react'
import { SLANG } from '../../data/internetSlang'
import { useAudio } from '../../hooks/useAudio'

const REPS = [1, 2, 3, 5]

// ── Today stats ───────────────────────────────────────────────
function useTodayStats() {
  const key = `eh_slang_${new Date().toISOString().slice(0,10)}`
  const [s, setS] = useState(() => { try { return JSON.parse(localStorage.getItem(key))||{p:0,r:0,m:0} } catch { return {p:0,r:0,m:0} } })
  const inc = (f) => setS(prev => { const n={...prev,[f]:prev[f]+1}; localStorage.setItem(key,JSON.stringify(n)); return n })
  return { s, inc }
}

// ── Study Mode Overlay ────────────────────────────────────────
function SlangStudyMode({ word, onClose, progress, toggleMastered }) {
  const [mode,     setMode]     = useState('recall')
  const [idx,      setIdx]      = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reps,     setReps]     = useState(1)
  const { play, playing }       = useAudio()
  const { s, inc }              = useTodayStats()

  const current = word.sentences[idx]
  const key     = `slang_${word.zh}_${idx}`
  const mastered = progress[key]?.mastered

  useMemo(() => {
    if (mode === 'shadow' && current?.en) setTimeout(() => play(current.en, reps), 300)
  // eslint-disable-next-line
  }, [idx, mode])

  function next() { setIdx(i=>(i+1)%word.sentences.length); setRevealed(false) }
  function prev() { setIdx(i=>(i-1+word.sentences.length)%word.sentences.length); setRevealed(false) }
  function reveal() { setRevealed(true); inc('p'); if(current?.en) play(current.en, reps) }
  function handleMaster() { if(key){ toggleMastered(key); if(!mastered) inc('m') } }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:'var(--cream)'}}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{background:'white',borderBottom:'1px solid var(--line)'}}>
        <button onClick={onClose} className="text-sm font-medium flex items-center gap-1"
          style={{color:'var(--sage)'}}>
          ‹ 返回熱詞列表
        </button>
        <div className="flex gap-4 text-center">
          {[{n:s.p,l:'練習'},{n:s.r,l:'重複'},{n:s.m,l:'掌握'}].map(x=>(
            <div key={x.l}>
              <div className="text-base font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{x.n}</div>
              <div className="text-xs" style={{color:'var(--sub)'}}>{x.l}</div>
            </div>
          ))}
        </div>
        <span className="text-xs" style={{color:'var(--sub)'}}>{idx+1}/{word.sentences.length}</span>
      </div>

      {/* Mode + Reps */}
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
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs" style={{color:'var(--sub)'}}>×</span>
          {REPS.map(n=>(
            <button key={n} onClick={()=>setReps(n)}
              className="w-7 h-7 rounded-full text-xs font-bold transition-all"
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
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-3xl font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{word.zh}</span>
            <span className="text-sm px-3 py-1 rounded-full" style={{background:'var(--terra-l)',color:'var(--terra)'}}>{word.en}</span>
            {mastered && <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'var(--sage-l)',color:'var(--sage)'}}>✅ Mastered</span>}
          </div>

          {mode === 'recall' ? (
            <div>
              <div className="rounded-2xl p-6 mb-4" style={{background:'white',border:'2px solid var(--line)'}}>
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--sub)'}}>中文例句</p>
                <p className="text-xl leading-relaxed" style={{color:'var(--warm)'}}>{current.zh}</p>
              </div>
              {!revealed ? (
                <button onClick={reveal} className="w-full py-4 rounded-2xl font-medium text-sm text-white transition-all"
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
                      style={{background:'var(--deep)'}}>
                      下一句 →
                    </button>
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
              <button onClick={()=>play(current.en,reps)}
                className="w-full py-2.5 rounded-xl text-sm mb-3" style={{border:'1px solid var(--line)',color:'var(--sub)'}}>
                🔁 Replay ×{reps}
              </button>
              <div className="flex gap-2">
                <button onClick={handleMaster} className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{background:mastered?'var(--sage-l)':'rgba(61,53,48,.05)',color:mastered?'var(--sage)':'var(--sub)'}}>
                  {mastered?'✅':'☐'} Master
                </button>
                <button onClick={next} className="flex-1 flex-grow py-3 rounded-xl text-sm font-medium text-white"
                  style={{background:'var(--deep)'}}>
                  Next →
                </button>
              </div>
            </div>
          )}
          <button onClick={prev} className="w-full mt-3 py-2 text-xs" style={{color:'var(--sub)'}}>← Previous</button>
        </div>
      </div>
    </div>
  )
}

// ── Main SlangPage ─────────────────────────────────────────────
export default function SlangPage({ progress, toggleMastered }) {
  const [active,    setActive]    = useState(null)
  const [search,    setSearch]    = useState('')
  const [showDetail,setShowDetail]= useState(false)
  const [studying,  setStudying]  = useState(false)

  const filtered = useMemo(() => {
    if (!search) return SLANG
    const q = search.toLowerCase()
    return SLANG.filter(w => w.zh.includes(search) || w.en.toLowerCase().includes(q) || w.description.includes(search))
  }, [search])

  function select(word) { setActive(word); setShowDetail(true) }

  // ── List ────────────────────────────────────────────────────
  const ListPanel = (
    <div className={`flex flex-col md:w-60 md:flex-shrink-0 md:flex
      ${showDetail ? 'hidden md:flex' : 'flex w-full'}` }
      style={{borderRight:'1px solid var(--line)',background:'var(--cream)'}}>
      <div className="p-3" style={{borderBottom:'1px solid var(--line)'}}>
        <p className="text-xs font-semibold mb-2" style={{color:'var(--sub)'}}>🔥 中文熱詞 × 英文表達</p>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索熱詞..."
          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
          style={{background:'white',border:'1px solid var(--line)',color:'var(--warm)'}}/>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map(w => (
          <button key={w.zh} onClick={()=>select(w)}
            className="w-full text-left px-3 py-3 rounded-xl transition-all"
            style={active?.zh===w.zh&&showDetail
              ?{background:'var(--deep)',color:'white'}
              :{color:'var(--warm)'}
            }
            onMouseEnter={e=>{ if(!(active?.zh===w.zh&&showDetail)) e.currentTarget.style.background='var(--sage-l)' }}
            onMouseLeave={e=>{ if(!(active?.zh===w.zh&&showDetail)) e.currentTarget.style.background='' }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-base" style={{fontFamily:'Georgia,serif'}}>{w.zh}</span>
              </div>
              <span style={{color:active?.zh===w.zh&&showDetail?'rgba(255,255,255,.4)':'var(--sub)'}}>›</span>
            </div>
            <div className="text-xs mt-0.5" style={{color:active?.zh===w.zh&&showDetail?'rgba(255,255,255,.6)':'var(--terra)'}}>{w.en}</div>
          </button>
        ))}
      </div>
    </div>
  )

  // ── Detail ──────────────────────────────────────────────────
  const DetailPanel = (
    <div className={`flex-1 overflow-y-auto ${showDetail?'flex flex-col w-full':'hidden md:flex md:flex-col'}`}>
      <button onClick={()=>setShowDetail(false)}
        className="md:hidden flex items-center gap-2 px-4 py-3 font-medium sticky top-0 z-10"
        style={{color:'var(--sage)',background:'white',borderBottom:'1px solid var(--line)'}}>
        ‹ 返回熱詞列表
      </button>

      {active ? (
        <div className="p-5 md:p-8 max-w-2xl mx-auto w-full">
          {/* Word title */}
          <div className="mb-5">
            <h1 className="text-4xl font-bold mb-1" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{active.zh}</h1>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-sm px-3 py-1 rounded-full" style={{background:'var(--terra-l)',color:'var(--terra)',fontWeight:600}}>{active.en}</span>
              
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl p-4 mb-5" style={{background:'var(--card-2)',border:'1px solid rgba(184,105,74,.12)'}}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--terra)'}}>📖 解釋</p>
            <p className="text-sm leading-relaxed" style={{color:'var(--warm)'}}>{active.description}</p>
          </div>

          {/* Study button */}
          <button onClick={()=>setStudying(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white mb-6 transition-all hover:-translate-y-0.5"
            style={{background:'var(--deep)'}}>
            🎯 Study this word (Recall + Shadow)
          </button>

          {/* 10 sentences */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:'var(--sub)'}}>10 Example Sentences</p>
          <div className="space-y-3">
            {active.sentences.map((s,i) => {
              const key = `slang_${active.zh}_${i}`
              const m   = progress[key]?.mastered
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
                        <button onClick={()=>{const u=new SpeechSynthesisUtterance(s.en);u.lang='en-US';u.rate=0.88;window.speechSynthesis.speak(u)}}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium text-white"
                          style={{background:'var(--deep)'}}>▶ Play</button>
                        <button onClick={()=>toggleMastered(key)}
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
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-5xl mb-4">🔥</div>
          <h2 className="text-xl font-bold mb-2" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>中文網絡熱詞</h2>
          <p className="text-sm" style={{color:'var(--sub)'}}>選擇一個熱詞，學習對應的英文表達和例句</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm">
            {SLANG.slice(0,6).map(w=>(
              <button key={w.zh} onClick={()=>select(w)}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{background:'var(--card-2)',color:'var(--terra)'}}>
                {w.zh}
              </button>
            ))}
          </div>
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
        <SlangStudyMode word={active} onClose={()=>setStudying(false)} progress={progress} toggleMastered={toggleMastered} />
      )}
    </>
  )
}
