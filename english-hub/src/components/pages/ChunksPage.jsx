import { useState, useMemo } from 'react'
import { CHUNKS, CHUNK_SENTENCES } from '../../data/chunks'
import AudioPlayer from '../shared/AudioPlayer'
import { useAudio } from '../../hooks/useAudio'

const REPS = [1, 2, 3, 5]

function getChunkOfDay() {
  const dayNum = Math.floor(Math.abs(new Date() - new Date('2026-01-01')) / 86400000) % 100
  return CHUNKS[((dayNum % 100) + 100) % 100]?.chunk
}

// ── Today stats ───────────────────────────────────────────────
function useTodayStats() {
  const key = `eh_ctoday_${new Date().toISOString().slice(0,10)}`
  const [s, setS] = useState(() => { try { return JSON.parse(localStorage.getItem(key))||{p:0,r:0,m:0} } catch { return {p:0,r:0,m:0} } })
  const inc = (f) => setS(prev => { const n={...prev,[f]:prev[f]+1}; localStorage.setItem(key,JSON.stringify(n)); return n })
  return { s, inc }
}

// ── Chunk Study Mode ──────────────────────────────────────────
function ChunkStudyMode({ chunk, chunkData, sentences, progress, toggleMastered, onClose }) {
  const [mode,     setMode]     = useState('recall')
  const [idx,      setIdx]      = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reps,     setReps]     = useState(1)
  const { play, playing }       = useAudio()
  const { s, inc }              = useTodayStats()

  const current = sentences[idx]
  const key     = current ? `c_${chunk.replace(/\s+/g,'_')}_${current.num}` : null
  const mastered = key ? progress[key]?.mastered : false

  // Auto-play in shadow mode
  useMemo(() => {
    if (mode === 'shadow' && current?.en) setTimeout(() => play(current.en, reps), 300)
  // eslint-disable-next-line
  }, [idx, mode])

  function next() { setIdx(i => (i+1) % sentences.length); setRevealed(false) }
  function prev() { setIdx(i => (i-1+sentences.length) % sentences.length); setRevealed(false) }

  function reveal() {
    setRevealed(true)
    inc('p')
    if (current?.en) play(current.en, reps)
  }

  function handleMaster() {
    if (key) { toggleMastered(key); if (!mastered) inc('m') }
  }

  if (!current) return null

  return (
    <div className="fixed inset-0 bg-stone-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between">
        <button onClick={onClose} className="text-emerald-700 font-medium text-sm flex items-center gap-1">
          ‹ {chunk}
        </button>
        <div className="flex gap-4 text-center">
          {[{n:s.p,l:'Practiced'},{n:s.r,l:'Reps'},{n:s.m,l:'Mastered'}].map(x=>(
            <div key={x.l}>
              <div className="text-base font-bold text-stone-800">{x.n}</div>
              <div className="text-xs text-stone-400">{x.l}</div>
            </div>
          ))}
        </div>
        <span className="text-xs text-stone-400">{idx+1}/{sentences.length}</span>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-stone-100 px-4 py-2 flex items-center gap-2 flex-wrap">
        <div className="flex bg-stone-100 rounded-lg p-0.5 gap-0.5">
          {[['recall','💬 Recall'],['shadow','🎧 Shadow']].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setRevealed(false);setIdx(0)}}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode===m?'bg-white shadow-sm text-stone-800':'text-stone-500'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-stone-400">×</span>
          {REPS.map(n=>(
            <button key={n} onClick={()=>setReps(n)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${reps===n?'bg-stone-800 text-white':'bg-stone-100 text-stone-500'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-lg">

          {/* Chunk context */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-emerald-700">{chunk}</span>
            <span className="text-sm text-stone-400">{chunkData?.chinese}</span>
            {mastered && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✅ Mastered</span>}
          </div>

          {mode === 'recall' ? (
            <div>
              <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 mb-4">
                <p className="text-xs text-stone-400 mb-2 font-medium uppercase tracking-wider">中文</p>
                <p className="text-2xl text-stone-800 font-medium leading-relaxed">{current.zh}</p>
              </div>

              {!revealed ? (
                <button onClick={reveal}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-4 rounded-2xl font-medium text-sm transition-all">
                  點擊顯示英文 + 播放
                </button>
              ) : (
                <div>
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-4">
                    <p className="text-xs text-emerald-600 mb-2 font-medium uppercase tracking-wider">English</p>
                    <p className="text-xl text-stone-800 font-medium leading-relaxed">{current.en}</p>
                  </div>
                  {playing && <div className="text-center text-sm text-emerald-600 mb-3 animate-pulse">🔊 Playing...</div>}
                  <button onClick={()=>play(current.en, reps)}
                    className="w-full border border-stone-200 text-stone-600 py-2 rounded-xl text-sm mb-3 hover:bg-stone-50">
                    🔁 Replay ×{reps}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={handleMaster}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium ${mastered?'bg-emerald-100 text-emerald-700':'bg-stone-100 text-stone-600'}`}>
                      {mastered?'✅ Mastered':'☐ Master'}
                    </button>
                    <button onClick={next}
                      className="flex-grow flex-1 py-3 rounded-xl text-sm font-medium bg-stone-800 text-white hover:bg-stone-700">
                      下一句 →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 mb-4">
                <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wider">🎧 Listen & Repeat</p>
                <p className="text-xl text-stone-800 font-medium leading-relaxed mb-2">{current.en}</p>
                <p className="text-stone-400">{current.zh}</p>
              </div>
              <div className={`text-center py-3 rounded-xl mb-4 ${playing?'bg-emerald-50 text-emerald-600 animate-pulse':'bg-stone-100 text-stone-400'}`}>
                {playing ? '🔊 Playing...' : 'Audio complete — now repeat aloud'}
              </div>
              <button onClick={()=>play(current.en, reps)}
                className="w-full border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm mb-3 hover:bg-stone-50">
                🔁 Replay ×{reps}
              </button>
              <div className="flex gap-2">
                <button onClick={handleMaster}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium ${mastered?'bg-emerald-100 text-emerald-700':'bg-stone-100 text-stone-600'}`}>
                  {mastered?'✅':'☐'} Master
                </button>
                <button onClick={next}
                  className="flex-1 flex-grow py-3 rounded-xl text-sm font-medium bg-stone-800 text-white hover:bg-stone-700">
                  Next →
                </button>
              </div>
            </div>
          )}

          <button onClick={prev} className="w-full mt-3 py-2 text-xs text-stone-400 hover:text-stone-600">
            ← Previous
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main ChunksPage ───────────────────────────────────────────
export default function ChunksPage({ progress, toggleMastered }) {
  const todayChunk   = getChunkOfDay()
  const [active,     setActive]     = useState(todayChunk || CHUNKS[0]?.chunk)
  const [search,     setSearch]     = useState('')
  const [showDetail, setShowDetail] = useState(false)
  const [studyMode,  setStudyMode]  = useState(false)

  const chunkData = useMemo(() => CHUNKS.find(v => v.chunk === active), [active])
  const sentences = useMemo(() => CHUNK_SENTENCES.filter(s => s.chunk === active).sort((a,b)=>a.num-b.num), [active])
  const filtered  = useMemo(() => {
    if (!search) return CHUNKS
    return CHUNKS.filter(v => v.chunk.includes(search.toLowerCase()) || v.chinese.includes(search))
  }, [search])

  function selectChunk(chunk) { setActive(chunk); setShowDetail(true) }

  // ── List ─────────────────────────────────────────────────
  const ListPanel = (
    <div className={`flex flex-col md:w-56 md:flex-shrink-0 md:border-r md:border-stone-200 md:bg-stone-50
      ${showDetail ? 'hidden md:flex' : 'flex w-full bg-stone-50'}`}>
      <div className="p-3 border-b border-stone-100">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索片語..."
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {!search && <div className="px-2 py-1 text-xs font-semibold text-amber-600 uppercase tracking-wider">Today ✨</div>}
        {filtered.map(v => (
          <button key={v.chunk} onClick={() => selectChunk(v.chunk)}
            className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center justify-between
              ${active===v.chunk&&showDetail ? 'bg-emerald-800 text-white'
                : v.chunk===todayChunk&&!(active===v.chunk&&showDetail) ? 'ring-1 ring-amber-300 bg-amber-50'
                : 'hover:bg-stone-200 text-stone-700'}`}>
            <div>
              <div className={`font-semibold text-sm ${active===v.chunk&&showDetail?'text-white':'text-stone-800'}`}>{v.chunk}</div>
              <div className={`text-xs mt-0.5 ${active===v.chunk&&showDetail?'text-emerald-200':'text-stone-400'}`}>{v.chinese}</div>
            </div>
            <span className="text-stone-300 md:hidden">›</span>
          </button>
        ))}
      </div>
    </div>
  )

  // ── Detail ───────────────────────────────────────────────
  const DetailPanel = (
    <div className={`flex-1 overflow-y-auto ${showDetail?'flex flex-col w-full':'hidden md:flex md:flex-col'}`}>
      <button onClick={()=>setShowDetail(false)}
        className="md:hidden flex items-center gap-2 px-4 py-3 text-emerald-700 font-medium border-b border-stone-100 bg-white sticky top-0 z-10">
        ‹ 返回片語列表
      </button>

      {chunkData && (
        <div className="p-5 md:p-8 max-w-2xl mx-auto w-full">
          {active===todayChunk && (
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
              ✨ Today's Chunk of the Day
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <h1 className="text-4xl font-bold text-stone-800" style={{fontFamily:'Georgia,serif'}}>{chunkData.chunk}</h1>
            <span className="text-xl text-stone-400">{chunkData.chinese}</span>
          </div>

          {/* Study button */}
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setStudyMode(true)}
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              🎯 Study this chunk
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">🧠 Memory Association</p>
            <p className="text-stone-700 text-sm leading-relaxed">{chunkData.memory}</p>
          </div>

          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">10 Example Sentences</p>
          <div className="space-y-3">
            {sentences.map(s => {
              const key = `c_${s.chunk.replace(/\s+/g,'_')}_${s.num}`
              const m   = progress[key]?.mastered
              return (
                <div key={key} className={`border rounded-xl p-4 ${m?'bg-emerald-50/60 border-emerald-300':'bg-white border-stone-200'}`}>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-500 text-xs flex items-center justify-center font-medium mt-0.5">{s.num}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-800 text-sm font-medium leading-relaxed mb-1">{s.en}</p>
                      <p className="text-stone-500 text-sm leading-relaxed">{s.zh}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <AudioPlayer text={s.en} compact />
                        <button onClick={()=>toggleMastered(key)}
                          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${m?'bg-emerald-100 text-emerald-700':'bg-stone-100 text-stone-500 hover:bg-emerald-100 hover:text-emerald-700'}`}>
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
      )}
    </div>
  )

  return (
    <>
      <div className="flex h-full overflow-hidden">
        {ListPanel}
        {DetailPanel}
      </div>

      {/* Study Mode overlay */}
      {studyMode && chunkData && (
        <ChunkStudyMode
          chunk={active}
          chunkData={chunkData}
          sentences={sentences}
          progress={progress}
          toggleMastered={toggleMastered}
          onClose={()=>setStudyMode(false)}
        />
      )}
    </>
  )
}
