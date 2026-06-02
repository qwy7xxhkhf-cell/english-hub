import { useState, useMemo } from 'react'
import { SENTENCES, ISLAND_NAMES } from '../../data/islands'
import SentenceCard from '../shared/SentenceCard'
import AudioPlayer from '../shared/AudioPlayer'

const LEVELS = ['All','A1','A2','B1','B2']

const LEVEL_STYLE = {
  A1:'bg-green-100 text-green-700', A2:'bg-sky-100 text-sky-700',
  B1:'bg-amber-100 text-amber-700', B2:'bg-rose-100 text-rose-700'
}

export default function IslandsPage({ islandFilter, setIslandFilter, progress, toggleMastered }) {
  const [view,   setView]   = useState('gallery')
  const [level,  setLevel]  = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => SENTENCES.filter(s => {
    if (islandFilter !== 'all' && s.island !== islandFilter) return false
    if (level !== 'All' && s.level !== level) return false
    if (search && !s.en.toLowerCase().includes(search.toLowerCase()) && !s.zh.includes(search)) return false
    return true
  }), [islandFilter, level, search])

  const masteredHere = filtered.filter(s => progress[`s_${s.id}`]?.mastered).length

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-stone-800" style={{fontFamily:'Georgia,serif'}}>🏝️ Island Sentences</h1>
          <div className="flex bg-stone-100 rounded-lg p-1 gap-1">
            {[['gallery','⊞ Gallery'],['table','☰ Table'],['board','⊟ Board']].map(([id,label])=>(
              <button key={id} onClick={()=>setView(id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view===id?'bg-white shadow-sm text-stone-800':'text-stone-500 hover:text-stone-700'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Island tabs */}
        <div className="flex gap-2 flex-wrap mb-3">
          <button onClick={()=>setIslandFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${islandFilter==='all'?'bg-emerald-800 text-white':'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>All</button>
          {ISLAND_NAMES.map(n=>(
            <button key={n} onClick={()=>setIslandFilter(n)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${islandFilter===n?'bg-emerald-800 text-white':'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
              {n.replace(' Island','')}
            </button>
          ))}
        </div>

        {/* Level + Search */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {LEVELS.map(l=>(
            <button key={l} onClick={()=>setLevel(l)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${level===l?'bg-stone-800 text-white':'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{l}</button>
          ))}
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索句子..."
            className="ml-auto border border-stone-200 rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 w-32" />
        </div>

        <p className="text-xs text-stone-400 mb-4">{filtered.length} sentences · {masteredHere} mastered</p>

        {/* GALLERY */}
        {view==='gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(s=>(
              <SentenceCard key={s.id} s={s} mastered={progress[`s_${s.id}`]?.mastered} onToggle={toggleMastered} showIsland={islandFilter==='all'} />
            ))}
          </div>
        )}

        {/* TABLE */}
        {view==='table' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>{['English','中文','Island','Level','Audio','✅'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((s,i)=>{
                  const mk = `s_${s.id}`
                  return (
                    <tr key={s.id} className={`border-b border-stone-50 hover:bg-stone-50 ${i%2===1?'bg-stone-50/40':''}`}>
                      <td className="px-4 py-3 text-xs text-stone-800 max-w-xs">{s.en}</td>
                      <td className="px-4 py-3 text-xs text-stone-500 max-w-xs">{s.zh}</td>
                      <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">{s.island?.replace(' Island','')}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LEVEL_STYLE[s.level]||''}`}>{s.level}</span></td>
                      <td className="px-4 py-3"><AudioPlayer text={s.en} compact /></td>
                      <td className="px-4 py-3">
                        <button onClick={()=>toggleMastered(mk)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${progress[mk]?.mastered?'bg-emerald-500 border-emerald-500':'border-stone-300 hover:border-emerald-400'}`}>
                          {progress[mk]?.mastered && <span className="text-white text-xs">✓</span>}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* BOARD */}
        {view==='board' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {['A1','A2','B1','B2'].map(lv=>{
              const cards = filtered.filter(s=>s.level===lv)
              return (
                <div key={lv} className="flex-none w-72">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 font-semibold text-sm border ${LEVEL_STYLE[lv]}`}>
                    {lv} <span className="opacity-50 text-xs font-normal">({cards.length})</span>
                  </div>
                  <div className="space-y-3">
                    {cards.map(s=>(
                      <div key={s.id} className="bg-white border border-stone-200 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <AudioPlayer text={s.en} compact />
                          <span className="text-xs text-stone-400 truncate ml-2">{s.subtitle}</span>
                        </div>
                        <p className="text-stone-800 text-xs font-medium leading-relaxed">{s.en}</p>
                        <p className="text-stone-500 text-xs mt-1">{s.zh}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
